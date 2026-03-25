// app/layout.js
import "./globals.css";

export const metadata = {
  title: "MonCash Payment Demo",
  description: "Accept payments with MonCash in Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
