import "./globals.css";
import ThemeToggle from "./components/ThemeToggle";

export const metadata = {
  title: "Service Request Board",
  description: "A small board for homeowner service requests"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem("theme") || "light";
                document.documentElement.dataset.theme = theme;
              } catch {}
            `
          }}
        />
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
