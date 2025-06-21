import type { Metadata } from 'next';
import '../globals.css';
import Footer from '../../../components/Footer';
import Navbar from '../../../components/Navbar';
import AuthProvider from '@/components/providers/AuthProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { useSession } from 'next-auth/react';

export const metadata: Metadata = {
    icons: {
        icon: '/logo1.jpg',
    },
    title: 'MovieTix - Book Your Movie Tickets',
    description: 'A modern movie ticket booking website',
};

export default function DefaultLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // const { data: session } = useSession();
    return (
        <>
        <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <Navbar />
                <main>{children}</main>
                <Footer />
            </ThemeProvider>
        </AuthProvider>
        </>
    );
} 