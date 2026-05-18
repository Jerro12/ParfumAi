import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground antialiased font-sans">
            <nav className="border-b border-border/60 bg-card/80 backdrop-blur-md sticky top-0 z-40">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
                                <span className="p-1.5 bg-primary/10 rounded-lg text-primary text-base">✧</span>
                                Parfumerie <span className="text-gold">AI</span>
                            </Link>

                            <div className="hidden space-x-8 sm:-my-px sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>
                                {user?.role === 'admin' && (
                                    <NavLink
                                        href={route('admin.dashboard')}
                                        active={route().current('admin.dashboard')}
                                    >
                                        <span className="text-gold mr-1">⚡</span> Admin Panel
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-full border border-border bg-background p-1.5 px-4 shadow-sm">
                                            <button
                                                type="button"
                                                className="inline-flex items-center text-sm font-medium leading-4 text-foreground hover:text-primary transition focus:outline-none"
                                            >
                                                <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
                                                {user.name}
                                                <span className="ml-2 px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs uppercase font-serif font-bold">
                                                    {user.role}
                                                </span>

                                                <svg className="ms-2 h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile Saya
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Keluar
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(prev => !prev)}
                                className="rounded-md p-2 text-muted-foreground hover:bg-secondary transition"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden bg-card border-b border-border px-4 py-3'}>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                        {user?.role === 'admin' && (
                            <ResponsiveNavLink href={route('admin.dashboard')} active={route().current('admin.dashboard')}>
                                Admin Panel
                            </ResponsiveNavLink>
                        )}
                    </div>

                    <div className="border-t border-border pb-1 pt-4 space-y-2">
                        <div>
                            <div className="text-base font-medium text-foreground">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                        <div className="space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile Saya</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">Keluar</ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-card border-b border-border/50 shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="pb-16">{children}</main>
        </div>
    );
}
