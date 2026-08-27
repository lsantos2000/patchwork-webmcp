import type { Metadata } from 'next';
import './globals.css';
import './persistence.css';

export const metadata: Metadata = {
  title: 'Patchwork — Small actions, shared momentum',
  description: 'A WebMCP-powered neighbourhood action exchange where people and agents turn local needs into doable plans.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
