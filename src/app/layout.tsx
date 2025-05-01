import { Inter, DM_Serif_Display } from "next/font/google";
import localFont from "next/font/local";
import "src/app/globals.css";
import { ThemeProvider } from "next-themes";
import "maplibre-gl/dist/maplibre-gl.css";
import { SidebarProvider } from "@/context/SidebarContext";
import Navbar from "@/components/nav-bar/NavBar";
import Sidebar from "@/components/nav-bar/sidebar/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "next-auth";
import SessionProviderWrapper from "@/components/sessionProviderWrapper/SessionProviderWrapper";
import { ClerkProvider } from "@clerk/nextjs";

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

const chiaroscura = localFont({
  src: [
    {
      path: "../../public/fonts/EMT_Chiaroscura_TRIAL/ChiaroscuraTRIAL-SmBd.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/EMT_Chiaroscura_TRIAL/ChiaroscuraTRIAL-Md.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/EMT_Chiaroscura_TRIAL/ChiaroscuraTRIAL-Rg.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/EMT_Chiaroscura_TRIAL/ChiaroscuraTRIAL-XLt.otf",
      weight: "200",
      style: "normal",
    },
  ],
  variable: "--font-chiaroscura",
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
        className={`${inter.variable} ${dmSerifDisplay.variable} ${chiaroscura.variable} font-sans `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            <SessionProviderWrapper>
              <SidebarProvider>
                <Sidebar />
                <div className="relative overflow-clip">
                  <Navbar />
                  <main>{children}</main>
                </div>
              </SidebarProvider>
              <Toaster />
            </SessionProviderWrapper>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
