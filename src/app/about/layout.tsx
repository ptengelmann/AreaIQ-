import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | AreaIQ",
  description: "The story behind AreaIQ. Transparent, intent-driven area intelligence for every UK location decision.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
