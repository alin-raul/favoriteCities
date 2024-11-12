import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/context/SidebarContext";
import Navbar from "@/components/nav-bar/NavBar";
import Sidebar from "@/components/nav-bar/sidebar/Sidebar";
import SessionWrapper from "@/components/session-wrapper/SessionWrapper";
import login from "@/components/login/login";
import { getServerSession } from "next-auth";

export const metadata = {
  title: "Favorite City App",
  description: "Discover Your Next Favorite City with Us!",
};

export default function RootLayout({ children }) {
  const session = getServerSession();
  console.log(session);

  return (
    <SessionWrapper>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <Sidebar />
              <div className="">
                <Navbar />
                <main className="m-auto px-4 sm:px-8">{children}</main>
              </div>
            </SidebarProvider>
          </ThemeProvider>
        </body>
      </html>
    </SessionWrapper>
  );
}
