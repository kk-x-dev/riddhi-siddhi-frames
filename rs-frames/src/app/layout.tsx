import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "रिद्धी सिद्धी Frames — श्रद्धा, प्रेरणा आणि आपुलकीचा सुंदर संगम",
  description:
    "तुमच्या घरासाठी आणि प्रियजनांसाठी मनाजवळच्या देवदेवता आणि प्रेरणादायी व्यक्तिमत्त्वांच्या सुंदर फ्रेम्स.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
