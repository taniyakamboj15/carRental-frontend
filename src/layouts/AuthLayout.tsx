import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle?: ReactNode;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 bg-gray-900 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    className="h-full w-full object-cover opacity-60"
                    src="https://images.unsplash.com/photo-1493238792015-164e8502561d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                    alt="Background"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-indigo-900/40 backdrop-blur-[2px]" />
            </div>

            {/* Auth Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20"
            >
                <div className="px-8 py-10 sm:px-10">
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-2 group mb-6">
                            <div className="bg-indigo-600 rounded-lg p-1.5 transition-transform group-hover:scale-110 shadow-lg shadow-indigo-500/30">
                                <div className="h-6 w-6 text-white font-bold flex items-center justify-center">C</div>
                            </div>
                            <span className="text-2xl font-bold text-gray-900 tracking-tight">CarRental</span>
                        </Link>

                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                            {title}
                        </h2>
                        {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
                    </div>

                    {children}
                </div>

                {/* Decorative bottom gradient */}
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            </motion.div>
        </div>
    );
};
