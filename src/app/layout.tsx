import type { Metadata } from 'next';
import './globals.css';
import { Inter, Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import AuthProvider from '@/components/providers/AuthProvider';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  icons: {
    icon: '/logo1.jpg',
  },
  title: 'MovieTix - Book Your Movie Tickets',
  description: 'A modern movie ticket booking website',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 