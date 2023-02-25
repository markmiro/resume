import { IBM_Plex_Mono, Inter } from "next/font/google";
import "../global.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "600"],
});
const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-mono",
  weight: ["500"], // font-medium in tailwind
});

export default function MyApp({ Component, pageProps }) {
  return (
    <div className={`${inter.variable} ${ibmMono.variable} font-sans`}>
      <Component {...pageProps} />
    </div>
  );
}
