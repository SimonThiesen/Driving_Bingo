import type { Metadata } from "next";
import { OfflineWorker } from "./OfflineWorker";
import "./globals.css";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const basePath = isGitHubPages ? "/Driving_Bingo" : "";
const siteUrl = isGitHubPages
  ? "https://simonthiesen.github.io/Driving_Bingo"
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Road Bingo — offline family driving game",
  description: "A privacy-first, offline driving bingo game for families.",
  applicationName: "Road Bingo",
  manifest: `${basePath}/manifest.webmanifest`,
  icons: { icon: `${basePath}/favicon.svg` },
  openGraph: { title: "Road Bingo", description: "Find it. Claim it. Win the road trip.", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "Road Bingo", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><OfflineWorker />{children}</body></html>;
}
