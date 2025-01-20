import "maplibre-gl/dist/maplibre-gl.css";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/context/SidebarContext";
import Navbar from "@/components/nav-bar/NavBar";
import Sidebar from "@/components/nav-bar/sidebar/Sidebar";
import { getServerSession } from "next-auth";
import { Inter, DM_Serif_Display } from "next/font/google";
import "src/app/globals.css";

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

type Session = {
  user: User | null;
};

type User = {
  name: string;
  email: string;
  image: string | null;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const session: Session = await getServerSession();

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
          <SidebarProvider>
            <Sidebar />
            <div className="relative">
              <Navbar session={session} />
              <main>{children}</main>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
