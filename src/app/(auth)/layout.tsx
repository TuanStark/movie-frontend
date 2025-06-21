import type { Metadata } from 'next';
import '../globals.css';
import Footer from '../../../components/Footer';
    import Navbar from '../../../components/Navbar';

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
    return (
        <>
            <main>{children}</main>
        </>
    );
} 