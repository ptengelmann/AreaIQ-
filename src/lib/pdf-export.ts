import { jsPDF } from "jspdf";
import { AreaReport } from "@/lib/types";

/* ── Brand Colors ── */
const COLORS = {
  bg: [9, 9, 11] as [number, number, number],
  bgElevated: [15, 15, 18] as [number, number, number],
  border: [28, 28, 34] as [number, number, number],
  textPrimary: [228, 228, 232] as [number, number, number],
  textSecondary: [161, 161, 170] as [number, number, number],
  textTertiary: [113, 113, 122] as [number, number, number],
  accent: [59, 130, 246] as [number, number, number],
  neonGreen: [0, 255, 136] as [number, number, number],
  neonAmber: [255, 187, 51] as [number, number, number],
  neonRed: [255, 68, 68] as [number, number, number],
};

function getRAGColor(score: number): [number, number, number] {
  if (score >= 70) return COLORS.neonGreen;
  if (score >= 45) return COLORS.neonAmber;
  return COLORS.neonRed;
}

function getRAGLabel(score: number): string {
  if (score >= 70) return "STRONG";
  if (score >= 45) return "MODERATE";
  return "WEAK";
}

/* ── Helpers ── */
function setColor(pdf: jsPDF, color: [number, number, number]) {
  pdf.setTextColor(color[0], color[1], color[2]);
}

function setFillColor(pdf: jsPDF, color: [number, number, number]) {
  pdf.setFillColor(color[0], color[1], color[2]);
}

function drawLine(pdf: jsPDF, y: number) {
  pdf.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
  pdf.line(20, y, 190, y);
}

function checkPageBreak(pdf: jsPDF, y: number, needed: number): number {
  if (y + needed > 275) {
    pdf.addPage();
    drawPageBg(pdf);
    drawPageFooter(pdf);
    return 20;
  }
  return y;
}

function drawPageBg(pdf: jsPDF) {
  setFillColor(pdf, COLORS.bg);
  pdf.rect(0, 0, 210, 297, "F");
}

function drawPageFooter(pdf: jsPDF) {
  pdf.setFontSize(7);
  setColor(pdf, COLORS.textTertiary);
  pdf.text("AREAIQ", 20, 290);
  setColor(pdf, COLORS.neonGreen);
  pdf.text("area-iq.co.uk", 190, 290, { align: "right" });
}

/** Wrap long text into lines that fit within maxWidth */
function wrapText(pdf: jsPDF, text: string, maxWidth: number): string[] {
  return pdf.splitTextToSize(text, maxWidth);
}

/* ── Main Export ── */
export function exportReportPDF(report: AreaReport) {
  const pdf = new jsPDF("p", "mm", "a4");
  pdf.setFont("helvetica");
  let y = 0;

  // ── Page 1 Background ──
  drawPageBg(pdf);

  // ── Header Bar ──
  setFillColor(pdf, COLORS.bgElevated);
  pdf.rect(0, 0, 210, 40, "F");

  // Logo
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  setColor(pdf, COLORS.textPrimary);
  pdf.text("AREA", 20, 18);
  const areaWidth = pdf.getTextWidth("AREA");
  setColor(pdf, COLORS.neonGreen);
  pdf.text("IQ", 20 + areaWidth, 18);

  // Intent + area type badges
  pdf.setFontSize(8);
  const intentText = report.intent.toUpperCase();
  const areaTypeText = report.area_type ? report.area_type.toUpperCase() : "";
  let badgeX = 190;

  // Intent badge
  const intentBadgeW = pdf.getTextWidth(intentText) + 8;
  badgeX -= intentBadgeW;
  setFillColor(pdf, [20, 30, 50]);
  pdf.roundedRect(badgeX, 11, intentBadgeW, 10, 1, 1, "F");
  setColor(pdf, COLORS.accent);
  pdf.text(intentText, badgeX + 4, 17.5);

  // Area type badge
  if (areaTypeText) {
    const areaTypeBadgeW = pdf.getTextWidth(areaTypeText) + 8;
    badgeX -= areaTypeBadgeW + 3;
    setFillColor(pdf, [25, 25, 30]);
    pdf.roundedRect(badgeX, 11, areaTypeBadgeW, 10, 1, 1, "F");
    setColor(pdf, COLORS.textSecondary);
    pdf.text(areaTypeText, badgeX + 4, 17.5);
  }

  // Subtitle
  pdf.setFontSize(8);
  setColor(pdf, COLORS.textTertiary);
  pdf.text("Intelligence Report", 20, 26);
  pdf.text(new Date(report.generated_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }), 20, 32);

  // Score badge in header
  const scoreColor = getRAGColor(report.areaiq_score);
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  setColor(pdf, scoreColor);
  pdf.text(String(report.areaiq_score), 190, 30, { align: "right" });
  pdf.setFontSize(7);
  pdf.text(`/100  ${getRAGLabel(report.areaiq_score)}`, 190, 35, { align: "right" });

  y = 48;

  // ── Area Name ──
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  setColor(pdf, COLORS.textPrimary);
  pdf.text(report.area, 20, y);
  y += 8;

  // ── Summary ──
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  setColor(pdf, COLORS.textSecondary);
  const summaryLines = wrapText(pdf, report.summary, 170);
  for (const line of summaryLines) {
    y = checkPageBreak(pdf, y, 5);
    pdf.text(line, 20, y);
    y += 4.5;
  }
  y += 4;

  // ── Dimension Scores ──
  drawLine(pdf, y);
  y += 6;
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "bold");
  setColor(pdf, COLORS.textTertiary);
  pdf.text("DIMENSION BREAKDOWN", 20, y);
  y += 6;

  for (const sub of report.sub_scores) {
    y = checkPageBreak(pdf, y, 20);
    const dimColor = getRAGColor(sub.score);

    // Label + weight + score
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    setColor(pdf, COLORS.textSecondary);
    pdf.text(sub.label, 20, y);

    pdf.setFontSize(7);
    setColor(pdf, COLORS.textTertiary);
    pdf.text(`${sub.weight}%`, 90, y);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    setColor(pdf, dimColor);
    pdf.text(String(sub.score), 190, y, { align: "right" });

    y += 3;

    // Score bar
    setFillColor(pdf, COLORS.border);
    pdf.rect(20, y, 140, 2, "F");
    setFillColor(pdf, dimColor);
    pdf.rect(20, y, (sub.score / 100) * 140, 2, "F");
    y += 5;

    // Summary
    pdf.setFontSize(7.5);
    pdf.setFont("helvetica", "normal");
    setColor(pdf, COLORS.textTertiary);
    const subLines = wrapText(pdf, sub.summary, 165);
    for (const line of subLines) {
      y = checkPageBreak(pdf, y, 4);
      pdf.text(line, 22, y);
      y += 3.5;
    }

    // Reasoning
    if (sub.reasoning) {
      pdf.setFontSize(6.5);
      setColor(pdf, [80, 80, 90]);
      const reasonLines = wrapText(pdf, `Data: ${sub.reasoning}`, 165);
      for (const line of reasonLines) {
        y = checkPageBreak(pdf, y, 4);
        pdf.text(line, 22, y);
        y += 3.2;
      }
    }

    y += 4;
  }

  // ── Detailed Sections ──
  for (const section of report.sections) {
    y = checkPageBreak(pdf, y, 30);
    drawLine(pdf, y);
    y += 6;

    // Section title
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    setColor(pdf, COLORS.textPrimary);
    pdf.text(section.title, 20, y);
    y += 6;

    // Content
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    setColor(pdf, COLORS.textSecondary);
    const contentLines = wrapText(pdf, section.content, 170);
    for (const line of contentLines) {
      y = checkPageBreak(pdf, y, 4.5);
      pdf.text(line, 20, y);
      y += 4;
    }
    y += 2;

    // Data points
    if (section.data_points && section.data_points.length > 0) {
      y = checkPageBreak(pdf, y, section.data_points.length * 6 + 4);
      setFillColor(pdf, COLORS.bgElevated);
      const dpHeight = section.data_points.length * 6 + 4;
      pdf.rect(20, y - 2, 170, dpHeight, "F");

      for (const dp of section.data_points) {
        pdf.setFontSize(7);
        pdf.setFont("helvetica", "normal");
        setColor(pdf, COLORS.textTertiary);
        pdf.text(dp.label, 24, y + 2);
        pdf.setFont("helvetica", "bold");
        setColor(pdf, COLORS.textPrimary);
        pdf.text(dp.value, 186, y + 2, { align: "right" });
        y += 6;
      }
      y += 4;
    }

    y += 4;
  }

  // ── Recommendations ──
  if (report.recommendations && report.recommendations.length > 0) {
    y = checkPageBreak(pdf, y, 20);
    drawLine(pdf, y);
    y += 6;

    pdf.setFontSize(7);
    pdf.setFont("helvetica", "bold");
    setColor(pdf, COLORS.textTertiary);
    pdf.text("RECOMMENDATIONS", 20, y);
    y += 6;

    for (let i = 0; i < report.recommendations.length; i++) {
      y = checkPageBreak(pdf, y, 15);

      // Number badge
      setFillColor(pdf, [20, 30, 50]);
      pdf.rect(20, y - 3, 6, 6, "F");
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "bold");
      setColor(pdf, COLORS.accent);
      pdf.text(String(i + 1), 23, y + 1, { align: "center" });

      // Text
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      setColor(pdf, COLORS.textSecondary);
      const recLines = wrapText(pdf, report.recommendations[i], 156);
      for (const line of recLines) {
        y = checkPageBreak(pdf, y, 4.5);
        pdf.text(line, 30, y);
        y += 4;
      }
      y += 4;
    }
  }

  // ── Data Sources Footer ──
  y = checkPageBreak(pdf, y, 15);
  drawLine(pdf, y);
  y += 6;
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  setColor(pdf, COLORS.textTertiary);
  pdf.text("Sources: ", 20, y);
  if (report.data_sources) {
    setColor(pdf, COLORS.neonGreen);
    pdf.text(report.data_sources.join("  |  "), 20 + pdf.getTextWidth("Sources: "), y);
  }

  // Page footers on all pages
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    drawPageFooter(pdf);
  }

  // Save
  const filename = `AreaIQ-${report.area.replace(/[^a-zA-Z0-9]/g, "-")}-${report.intent}.pdf`;
  pdf.save(filename);
}
