import "./globals.css";
import { Orbitron, Titillium_Web } from "next/font/google";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-orbitron"
});

const titillium = Titillium_Web({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-titillium"
});

export const metadata = {
  title: "2025 Formula One World Championship Briefing",
  description:
    "An intelligence hub covering the 2025 Formula One season with standings, race chronology and regulation insights."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${titillium.variable} ${orbitron.variable}`}>
        {children}
      </body>
    </html>
  );
}
