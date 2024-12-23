import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/context/SidebarContext";
import Navbar from "@/components/nav-bar/NavBar";
import Sidebar from "@/components/nav-bar/sidebar/Sidebar";
import { getServerSession } from "next-auth";
import { Inter, DM_Serif_Display } from "next/font/google";

// Configure the Inter font using next/font
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Specify weights used
  display: "swap", // Matches your original link
});

// Configure the DM Serif Display font using next/font
const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  style: ["normal", "italic"], // Include italics
  weight: ["400"],
  display: "swap", // Matches your original link
});

export const metadata = {
  title: "Cardinal",
  description: "Discover, Plan...",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
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
              <main session={session}>{children}</main>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
