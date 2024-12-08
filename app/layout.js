import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/context/SidebarContext";
import Navbar from "@/components/nav-bar/NavBar";
import Sidebar from "@/components/nav-bar/sidebar/Sidebar";
import { getServerSession } from "next-auth";

export const metadata = {
  title: "Favorite City App",
  description: "Discover Your Next Favorite City with Us!",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <Sidebar />
            <div className="relative">
              {<Navbar session={session} />}
              <main session={session}>{children}</main>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
