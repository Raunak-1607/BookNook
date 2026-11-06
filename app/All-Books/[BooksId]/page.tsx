"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
// import { toast } from "@/components/ui/toast";
import { toast } from "react-toastify";
import { GetTokenFromClient } from "@/lib/GetTokenFromClient";
import { BACKEND_URL } from "@/lib/api";
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  copies: number;
  description: string;
  image?: string;
};

const SAMPLE_BOOK: Book = {
  _id: "book-quiet-orchard",
  title: "The Quiet Orchard",
  author: "Mira Hossain",
  category: "Fiction",
  totalCopies: 6,
  copies: 3,
  description:
    "A heartwarming story exploring the hidden lives of an old village grove and the people who tend to it.",
  image: "",
};

export default function BookDetailsPage({
  params,
}: {
  params: Promise<{ BooksId: string }>;
}) {
  const { BooksId } = use(params);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [book, setBook] = useState<Book>(SAMPLE_BOOK);
  const [open, setOpen] = useState(false);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [availableCopies, setAvailableCopies] = useState(book.copies);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Book Details
  useEffect(() => {
    if (!BooksId) return;

    const fetchBook = async () => {
      try {
        const token = await GetTokenFromClient().catch(() => "");
        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        let res = await fetch(`${BACKEND_URL}/books/detail/${BooksId}`, {
          headers,
        });

        // Fallback in case endpoint without /detail is used
        if (!res.ok && res.status === 404) {
          res = await fetch(`${BACKEND_URL}/books/${BooksId}`, {
            headers,
          });
        }

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(
            errData.error || `Failed to fetch book details (${res.status})`,
          );
        }

        const data = await res.json();

        if (data && data.title) {
          const copies = Number(data.copies) || 0;
          const totalCopies = Number(data.totalCopies ?? data.copies) || 0;

          setBook({
            ...data,
            totalCopies,
            copies,
          });
          setAvailableCopies(copies);
        }
      } catch (error) {
        console.error("Book fetching error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [BooksId]);

  const handleBorrow = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Get form data before the first await
    const formData = new FormData(event.currentTarget);

    setIsSubmitting(true);

    try {
      const jwtToken = await GetTokenFromClient();

      const borrowData = {
        bookId: book._id,
        bookTitle: book.title,
        bookAuthor: book.author,
        bookCategory: book.category,
        bookImage: book.image,
        userName: formData.get("userName"),
        email: formData.get("email"),
        borrowDate: new Date().toISOString(),
      };

      const res = await fetch(`${BACKEND_URL}/borrowed-books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(borrowData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || data.message || "Failed to borrow book");
        return;
      }

      const remainingCopies = Math.max(0, availableCopies - 1);

      setAvailableCopies(remainingCopies);

      setBook((currentBook) => ({
        ...currentBook,
        copies: remainingCopies,
      }));

      toast.success("Book borrowed successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Borrow error:", error);
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isPending) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-[#f5f8f7]">
        <p className="text-[#104e5b] font-semibold">Loading book details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#f5f8f7] px-4 py-8 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-[1100px]">
        {/* Breadcrumb */}
        <nav className="mb-5 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#104e5b]">
            Home
          </Link>

          <span>/</span>

          <Link href="/All-Books" className="hover:text-[#104e5b]">
            All Books
          </Link>

          <span>/</span>

          <span className="font-semibold text-[#104e5b]">{book.title}</span>
        </nav>

        {/* Book Details Container */}
        <div className="grid gap-8 rounded-2xl border border-gray-200 bg-white p-6 md:grid-cols-[300px_1fr] md:gap-10 md:p-8">
          {/* Book Cover */}
          <div className="relative flex aspect-[3/4] w-full flex-col justify-end overflow-hidden rounded-xl bg-[#104e5b] p-6 shadow-xs">
            {book.image && (
              <Image
                src={book.image}
                alt={book.title}
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <h2 className="relative z-10 text-2xl font-bold leading-snug text-white">
              {book.title}
            </h2>
          </div>

          {/* Book Information */}
          <div className="flex flex-col justify-center">
            {/* Category */}
            <div>
              <Badge className="bg-[#e5f3f0] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#104e5b] hover:bg-[#e5f3f0]">
                {book.category}
              </Badge>
            </div>

            {/* Title & Author */}
            <h1 className="mt-3 text-3xl font-bold text-[#104e5b] md:text-4xl">
              {book.title}
            </h1>

            <p className="mt-1 text-base text-gray-500">by {book.author}</p>

            {/* Copies Information */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
              {/* Total Copies */}
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-xs font-medium text-gray-500">
                  Total Copies
                </p>

                <h3 className="mt-1 text-xl font-bold text-gray-800">
                  {availableCopies}
                </h3>
              </div>

              {/* Available Copies */}

              <div className="inline-flex items-center gap-2 rounded-2xl bg-green-50 border border-green-200 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-sm font-medium text-green-700">
                  Available now:{" "}
                  <span className="font-bold">{availableCopies}</span> copies
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 space-y-1.5">
              <p className="text-sm leading-relaxed text-gray-600">
                {book.description}
              </p>
            </div>

            {/* Borrow Dialog */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger
                  render={
                    <Button
                      type="button"
                      disabled={availableCopies <= 0 || !user}
                      className="h-11 rounded-lg bg-[#b68339] px-6 text-sm font-bold tracking-wider text-white uppercase hover:bg-[#a1712c] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {availableCopies > 0
                        ? "BORROW THIS BOOK"
                        : "CURRENTLY UNAVAILABLE"}
                    </Button>
                  }
                />

                <DialogContent
                  showCloseButton={false}
                  className="w-full max-w-[430px] rounded-2xl bg-white p-6 shadow-xl border border-gray-100"
                >
                  <DialogHeader className="mb-2 text-left">
                    <DialogTitle className="text-xl font-bold text-[#104e5b]">
                      Confirm Borrow
                    </DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleBorrow} className="space-y-4">
                    {/* User Name */}
                    <div className="space-y-1.5 text-left">
                      <Label
                        htmlFor="userName"
                        className="text-sm font-medium text-gray-700"
                      >
                        User Name
                      </Label>

                      <Input
                        id="userName"
                        name="userName"
                        value={user?.name || ""}
                        readOnly
                        className="h-11 rounded-lg border-0 bg-[#eef3f2] px-3.5 text-sm text-gray-800 focus-visible:ring-0 cursor-default"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5 text-left">
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700"
                      >
                        Email
                      </Label>

                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={user?.email || ""}
                        readOnly
                        className="h-11 rounded-lg border-0 bg-[#eef3f2] px-3.5 text-sm text-gray-800 focus-visible:ring-0 cursor-default"
                      />
                    </div>

                    {/* Dialog Buttons */}
                    <div className="flex items-center gap-3 pt-3">
                      <Button
                        type="submit"
                        disabled={isSubmitting || availableCopies <= 0}
                        className="h-10 rounded-lg bg-[#104e5b] px-5 text-sm font-semibold text-white hover:bg-[#0c3e49]"
                      >
                        {isSubmitting ? "Borrowing..." : "Confirm Borrow"}
                      </Button>

                      <DialogClose
                        render={
                          <Button
                            type="button"
                            variant="outline"
                            disabled={isSubmitting}
                            className="h-10 rounded-lg border border-[#104e5b] bg-white px-5 text-sm font-semibold text-[#104e5b] hover:bg-[#104e5b]/5"
                          >
                            Cancel
                          </Button>
                        }
                      />
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <p className="max-w-[260px] text-xs text-gray-500">
                Keep it for a few days, then return it from My Borrows.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
