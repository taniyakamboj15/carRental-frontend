import type { ReactNode } from 'react';
import { Navbar } from '@/components/layout/Navbar';

interface MainLayoutProps {
    children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
                {children}
            </main>
        </div>
    );
};
