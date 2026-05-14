import "./globals.css";

export const metadata = {
  title: "Service Request Board",
  description: "A small board for homeowner service requests"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
