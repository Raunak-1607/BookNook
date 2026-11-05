
"use client";

import Link from "next/link";
import { BookOpenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

const Navbar = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const pathname = usePathname();

  const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "All Books", href: "/All-Books" },
    { label: "Add Book", href: "/Add-Books", isPrivate: true },
    { label: "My Books", href: "/My-Books", isPrivate: true },
    { label: "My Borrows", href: "/My-Borrows", isPrivate: true },
  ];

  const visibleLinks = NAV_LINKS.filter(
    (link) => !link.isPrivate || Boolean(user)
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <BookOpenIcon className="size-6 text-[#f0a33a]" />
          <span className="text-lg font-bold tracking-tight text-[#1a3a5c]">
            BookNook
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-2 md:flex">
          {visibleLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#1a3a5c] text-white"
                    : "text-foreground/75 hover:bg-[#1a3a5c]/5 hover:text-[#1a3a5c]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Authentication */}
        <div className="flex items-center gap-2">
          {user ? (
            <Popover>
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#1a3a5c]"
                  >
                    <Avatar>
                      <AvatarImage
                        referrerPolicy="no-referrer"
                        src={user.image || ""}
                      />
                      <AvatarFallback className="bg-[#1a3a5c] text-white">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                }
              />

              <PopoverContent align="end">
                <PopoverHeader>
                  <PopoverTitle>{user.name}</PopoverTitle>

                  <PopoverDescription>
                    <span className="block text-xs text-muted-foreground">
                      {user.email}
                    </span>

                    <Button
                      className="mt-2 w-full"
                      variant="destructive"
                      onClick={() => authClient.signOut()}
                    >
                      Sign Out
                    </Button>
                  </PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
          ) : (
            <>
              <Link href="/Auth/Login">
                <Button
                  variant="outline"
                  className="border-[#1a3a5c]/20 bg-transparent text-[#1a3a5c] hover:bg-[#1a3a5c]/5"
                >
                  Login
                </Button>
              </Link>

              <Link href="/Auth/Register">
                <Button className="bg-[#1a3a5c] text-white hover:bg-[#1a3a5c]/90">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
