import React from "react";
import Link from "next/link";
import { BookOpenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "All Books", href: "/books" },
    { label: "Add Books", href: "/Add-Books" }
];

const Navbar = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
                <Link href="/" className="flex items-center gap-2">
                    <BookOpenIcon className="size-6 text-[#f0a33a]" />
                    <span className="text-lg font-bold tracking-tight text-[#1a3a5c]">
                        BookNook
                    </span>
                </Link>

                <nav className="hidden items-center gap-6 md:flex">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-foreground/75 transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="border-[#1a3a5c]/20 bg-transparent text-[#1a3a5c] hover:bg-[#1a3a5c]/5 hover:text-[#1a3a5c]"
                    >
                        Login
                    </Button>
                    <Button className="bg-[#1a3a5c] text-white hover:bg-[#1a3a5c]/90">
                        Register
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
