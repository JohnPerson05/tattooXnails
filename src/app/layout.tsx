import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Owshie Tattoo x Celeste Nail",
  description:
    "Owshie Tattoo x Celeste Nail — a premium creative studio blending bold tattoo artistry with refined nail design.",
  authors: [{ name: "Owshie Tattoo x Celeste Nail" }],
  openGraph: {
    title: "Owshie Tattoo x Celeste Nail",
    description: "Where ink meets elegance — a creative studio for the bold and beautiful.",
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
