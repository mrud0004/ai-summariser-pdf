import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI PDF Summariser Tool",
  description: "Summarise your pdf's with this simple tool.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      
      <body className={inter.className}>{children}
      <Script  src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min.js" strategy="beforeInteractive"></Script>
      </body>
      
    </html>
  );
}
