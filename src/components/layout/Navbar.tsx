import { Fragment, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Menu as MenuIcon, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Fleet', href: '/vehicles' },
        ...(isAuthenticated ? [{ name: 'My Bookings', href: '/bookings' }] : []),
        ...(user?.is_superuser ? [{ name: 'Admin Dashboard', href: '/admin' }] : []),
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <Disclosure as="nav" className={clsx(
            "fixed w-full z-50 transition-all duration-300 border-b border-transparent",
            scrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-gray-100 py-2" : "bg-transparent py-4"
        )}>
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between items-center">
                            {/* Logo */}
                            <div className="flex flex-shrink-0 items-center">
                                <Link to="/" className="flex items-center gap-2 group">
                                    <div className="bg-indigo-600 rounded-lg p-1.5 transition-transform group-hover:scale-110">
                                        <div className="h-6 w-6 text-white font-bold flex items-center justify-center">C</div>
                                    </div>
                                    <span className={clsx(
                                        "font-bold text-xl tracking-tight transition-colors",
                                        scrolled || open ? "text-gray-900" : "text-white"
                                    )}>
                                        <span className={clsx(scrolled || location.pathname !== '/' ? "text-gray-900" : "text-white")}>CarRental</span>
                                    </span>
                                </Link>
                            </div>

                            {/* Desktop Menu */}
                            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={clsx(
                                            "relative px-1 py-2 text-sm font-medium transition-colors hover:text-indigo-500",
                                            isActive(item.href)
                                                ? "text-indigo-600"
                                                : (scrolled || location.pathname !== '/' ? "text-gray-700" : "text-gray-200 hover:text-white")
                                        )}
                                    >
                                        {item.name}
                                        {isActive(item.href) && (
                                            <motion.div
                                                layoutId="underline"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                                            />
                                        )}
                                    </Link>
                                ))}

                                {/* Auth Buttons / Dropdown */}
                                {isAuthenticated ? (
                                    <Menu as="div" className="relative ml-3">
                                        <Menu.Button className="flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                            <User className="h-4 w-4" />
                                            <span className="font-medium">{user?.full_name || 'User'}</span>
                                            <ChevronDown className="h-4 w-4 opacity-50" />
                                        </Menu.Button>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-200"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <Link
                                                            to="/profile"
                                                            className={clsx(
                                                                active ? 'bg-gray-50' : '',
                                                                'flex w-full items-center px-4 py-2 text-sm text-gray-700'
                                                            )}
                                                        >
                                                            <User className="mr-2 h-4 w-4" />
                                                            Profile
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button
                                                            onClick={handleLogout}
                                                            className={clsx(
                                                                active ? 'bg-gray-50' : '',
                                                                'flex w-full items-center px-4 py-2 text-sm text-gray-700'
                                                            )}
                                                        >
                                                            <LogOut className="mr-2 h-4 w-4" />
                                                            Sign out
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                ) : (
                                    <div className="flex gap-4">
                                        <Link to="/login">
                                            <button className={clsx(
                                                "text-sm font-semibold transition-colors",
                                                scrolled || location.pathname !== '/' ? "text-gray-700 hover:text-indigo-600" : "text-white hover:text-indigo-200"
                                            )}>
                                                Log in
                                            </button>
                                        </Link>
                                        <Link to="/register">
                                            <button className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-transform hover:scale-105 active:scale-95">
                                                Sign up
                                            </button>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Mobile menu button */}
                            <div className="-mr-2 flex items-center sm:hidden">
                                <Disclosure.Button className={clsx(
                                    "inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500",
                                    scrolled || location.pathname !== '/' ? "text-gray-400 hover:bg-gray-100 hover:text-gray-500" : "text-white hover:bg-white/10"
                                )}>
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <X className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Panel */}
                    <Disclosure.Panel className="sm:hidden bg-white border-b border-gray-200 shadow-xl">
                        <div className="space-y-1 pb-3 pt-2">
                            {navigation.map((item) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as={Link}
                                    to={item.href}
                                    className={clsx(
                                        isActive(item.href)
                                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                            : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700',
                                        'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                                    )}
                                >
                                    {item.name}
                                </Disclosure.Button>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 pb-3 pt-4">
                            {isAuthenticated ? (
                                <div className="space-y-1">
                                    <div className="px-4 py-2">
                                        <div className="text-base font-medium text-gray-800">{user?.full_name}</div>
                                        <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                                    </div>
                                    <Disclosure.Button
                                        as="button"
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                                    >
                                        Sign out
                                    </Disclosure.Button>
                                </div>
                            ) : (
                                <div className="space-y-1 px-4">
                                    <Disclosure.Button
                                        as={Link}
                                        to="/login"
                                        className="block w-full text-center rounded-md bg-gray-100 px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-200"
                                    >
                                        Log in
                                    </Disclosure.Button>
                                    <Disclosure.Button
                                        as={Link}
                                        to="/register"
                                        className="block w-full text-center mt-2 rounded-md bg-indigo-600 px-3 py-2 text-base font-medium text-white hover:bg-indigo-700"
                                    >
                                        Sign up
                                    </Disclosure.Button>
                                </div>
                            )}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
};
