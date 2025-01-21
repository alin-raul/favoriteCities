import { Inter, DM_Serif_Display } from "next/font/google";
import "src/app/globals.css";
import { ThemeProvider } from "next-themes";
import "maplibre-gl/dist/maplibre-gl.css";
import { SidebarProvider } from "@/context/SidebarContext";
import Navbar from "@/components/nav-bar/NavBar";
import Sidebar from "@/components/nav-bar/sidebar/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "next-auth";
import SessionProviderWrapper from "@/components/sessionProviderWrapper/SessionProviderWrapper";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
  variable: "--font-inter",
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400"],
  display: "swap",
  preload: false,
  variable: "--font-dmSerif",
});

export const metadata = {
  title: "Cardinal",
  description: "Discover, Plan...",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${dmSerifDisplay.variable} font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProviderWrapper>
            <SidebarProvider>
              <Sidebar />
              <div className="relative">
                <Navbar />
                <main>{children}</main>
                <Toaster />
              </div>
            </SidebarProvider>
          </SessionProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
