import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { sql } from "@/lib/db";
import { AreaReport, Intent } from "@/lib/types";

function generateId(): string {
  return `rpt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function buildPrompt(area: string, intent: Intent): string {
  const intentContext: Record<Intent, string> = {
    moving:
      "The user is considering moving to this area. Focus on livability: safety, schools, healthcare, parks, transport links, community feel, noise levels, cost of living, and quality of life.",
    business:
      "The user is considering opening a business in this area. Focus on: foot traffic potential, competition density, commercial rent estimates, local demographics and spending power, transport accessibility, nearby complementary businesses, and local economic trends.",
    investing:
      "The user is evaluating this area for property or business investment. Focus on: property price trends, rental yields, regeneration projects, planning applications, demographic shifts, infrastructure developments, and growth indicators.",
    research:
      "The user wants a general understanding of this area. Provide a balanced overview: demographics, economy, safety, amenities, transport, culture, and notable characteristics.",
  };

  return `You are AreaIQ, an expert area intelligence analyst. Produce a detailed, data-driven intelligence report for the following area and intent.

AREA: ${area}
INTENT: ${intentContext[intent]}

You must respond with ONLY valid JSON matching this exact structure (no markdown, no code fences, no explanation):

{
  "area": "${area}",
  "intent": "${intent}",
  "areaiq_score": <number 0-100>,
  "sub_scores": [
    { "label": "Safety", "score": <0-100>, "summary": "<1 sentence>" },
    { "label": "Transport", "score": <0-100>, "summary": "<1 sentence>" },
    { "label": "Amenities", "score": <0-100>, "summary": "<1 sentence>" },
    { "label": "Demographics", "score": <0-100>, "summary": "<1 sentence>" },
    { "label": "${intent === "business" ? "Commercial Viability" : intent === "investing" ? "Growth Potential" : intent === "moving" ? "Livability" : "Overall Quality"}", "score": <0-100>, "summary": "<1 sentence>" }
  ],
  "summary": "<2-3 sentence executive summary of the area for this specific intent>",
  "sections": [
    {
      "title": "<section title>",
      "content": "<2-4 paragraphs of detailed analysis>",
      "data_points": [
        { "label": "<metric name>", "value": "<value>" }
      ]
    }
  ],
  "recommendations": [
    "<actionable recommendation 1>",
    "<actionable recommendation 2>",
    "<actionable recommendation 3>"
  ],
  "generated_at": "${new Date().toISOString()}"
}

Requirements:
- Include 4-6 sections relevant to the intent
- Each section should have 2-5 data_points with realistic, specific values
- The areaiq_score should reflect the overall suitability of this area for the stated intent
- Sub-scores should be weighted appropriately for the intent
- Be specific to this exact area — reference real streets, landmarks, stations, and local features
- All data should be realistic and grounded. If you are uncertain about a specific number, provide a reasonable estimate and note it
- Recommendations should be specific and actionable, not generic advice`;
}

export async function POST(req: NextRequest) {
  try {
    const { area, intent } = await req.json();

    if (!area || !intent) {
      return NextResponse.json(
        { error: "Area and intent are required" },
        { status: 400 }
      );
    }

    const validIntents: Intent[] = ["moving", "business", "investing", "research"];
    if (!validIntents.includes(intent)) {
      return NextResponse.json(
        { error: "Invalid intent" },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: buildPrompt(area, intent),
        },
      ],
    });

    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from AI");
    }

    const report: AreaReport = JSON.parse(textContent.text);
    const id = generateId();

    await sql`
      INSERT INTO reports (id, area, intent, report, score)
      VALUES (${id}, ${area}, ${intent}, ${JSON.stringify(report)}, ${report.areaiq_score})
    `;

    return NextResponse.json({ id, report });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
