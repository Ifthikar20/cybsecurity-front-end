import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Log File Vulnerability Analyzer',
  description: 'Analyze log files for security vulnerabilities with DeepSeek reasoning model',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 min-h-screen`}>
        <nav className="bg-blue-800 text-white p-4 shadow-md">
          <div className="container mx-auto">
            <h1 className="text-xl font-bold">AI Spector for Log analatics and feeback</h1>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}