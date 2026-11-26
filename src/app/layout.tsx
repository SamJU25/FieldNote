import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fieldnote | Interactive Courses & Study Tracker",
  description:
    "Self-contained interactive courses with mental-model visuals, execution traces, and a multi-course study tracker.",
  applicationName: "Fieldnote Learning System",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#090a0b" },
  ],
  width: "device-width",
  initialScale: 1,
};

const THEME_INIT_SCRIPT = `(function(){try{var k=['fieldnote-learning-progress-v7','fieldnote-learning-progress-v6','fieldnote-learning-progress-v5','fieldnote-learning-progress-v4','ai-ml-hub-progress-v3'];var t='';for(var i=0;i<k.length;i++){var r=localStorage.getItem(k[i]);if(!r)continue;var d=JSON.parse(r);var c=d&&(d.theme||(d.profile&&d.profile.theme));if(c==='dark'||c==='light'){t=c;break;}}if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;var m=document.querySelector('meta[name="theme-color"]');if(m){m.setAttribute('content',t==='dark'?'#090a0b':'#f6f4ef');}}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${plexSans.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#f6f4ef" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
