import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://owshiexceleste.com"),
  title: {
    default: "Owshie Tattoo x Celeste Nail",
    template: "%s | Owshie Tattoo x Celeste Nail",
  },
  description:
    "Owshie Tattoo x Celeste Nail — a premium creative studio blending bold tattoo artistry with refined nail design.",
  applicationName: "Owshie Tattoo x Celeste Nail",
  authors: [{ name: "Owshie Tattoo x Celeste Nail" }],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/apple-icon.svg",
  },
  openGraph: {
    title: "Owshie Tattoo x Celeste Nail",
    description: "Where ink meets elegance — a creative studio for the bold and beautiful.",
    siteName: "Owshie Tattoo x Celeste Nail",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Owshie Tattoo x Celeste Nail",
    description: "Where ink meets elegance — a creative studio for the bold and beautiful.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
