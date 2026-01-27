
import { Zap, Shield, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { HeroSearchWidget } from '@/components/features/HeroSearchWidget';
import { useAuth } from '@/context/AuthContext';

const FEATURES = [
    {
        icon: Trophy,
        title: 'Premium Fleet',
        desc: 'Curated selection of high-end vehicles maintained to perfection.',
        color: 'bg-yellow-100 text-yellow-600'
    },
    {
        icon: Zap,
        title: 'Instant Booking',
        desc: 'Seamless digital process. Book and unlock your car in minutes.',
        color: 'bg-blue-100 text-blue-600'
    },
    {
        icon: Shield,
        title: 'Full Insurance',
        desc: 'Drive with peace of mind. Comprehensive coverage included.',
        color: 'bg-green-100 text-green-600'
    },
];

export const Home = () => {
    return (
        <div className="space-y-0">
            {/* Hero Section */}
            <div className="relative h-screen min-h-[700px] flex flex-col justify-center items-center overflow-hidden pb-20">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2830&auto=format&fit=crop')]"
                >
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
                </div>

                {/* Content */}
                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl drop-shadow-lg">
                            Drive the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Future</span>
                        </h1>
                        <p className="mt-6 max-w-2xl mx-auto text-xl md:text-2xl text-gray-200 font-light tracking-wide">
                            Experience the thrill of premium electric and sports vehicles.
                            Unmatched performance, zero compromise.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-10 flex justify-center gap-6"
                    >
                        {/* Buttons moved or kept, but widget is main focus now */}
                        {/* Keeping buttons for secondary CTA */}
                    </motion.div>
                </div>

                {/* Search Widget */}
                {/* Search Widget - Only for Authenticated Users */}
                <div className="w-full absolute bottom-10 z-20 px-4">
                     {useAuth().isAuthenticated ? (
                         <HeroSearchWidget />
                     ) : (
                         <motion.div 
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ delay: 0.6 }}
                             className="max-w-md mx-auto bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-center shadow-xl"
                         >
                             <h3 className="text-xl font-bold text-white mb-2">Join the Elite Club</h3>
                             <p className="text-gray-200 mb-4">Sign in to unlock our exclusive fleet and start your journey.</p>
                             <a href="/login" className="inline-block bg-white text-indigo-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                                 Login to Browse
                             </a>
                         </motion.div>
                     )}
                </div>
            </div>

            {/* Features Section */}
            <section className="py-24 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Why Choose Us?</h2>
                        <p className="mt-4 text-lg text-gray-600">We redefine the car rental experience.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                        {FEATURES.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="relative group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                <div className={`inline-flex p-3 rounded-xl mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};
