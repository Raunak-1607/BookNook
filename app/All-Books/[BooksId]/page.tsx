"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Shadcn UI components directly from components/ui
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

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  copies: number;
  description: string;
  image?: string;
};

// Fallback book matching the screenshot if backend is offline or for demonstration
const SAMPLE_BOOK: Book = {
  _id: "book-quiet-orchard",
  title: "The Quiet Orchard",
  author: "Mira Hossain",
  category: "Fiction",
  copies: 3,
  description:
    "A heartwarming story exploring the hidden lives of an old village grove and the people who tend to it. When an unexpected visitor arrives, old secrets surface, challenging memories and bringing long-awaited redemption and finds what they had lost.",
  image: "",
};

export  default  function BookDetailsPage({
  params,
}: {
  params: Promise<{ BooksId: string }>;
}) {
  const { BooksId } = use(params) ;

  const [book, setBook] = useState<Book>(SAMPLE_BOOK);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch book from backend if available
  useEffect(() => {
    if (!BooksId) return;

    fetch(`http://localhost:5000/books/${BooksId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.title) {
          setBook(data);
        }
      })
      .catch((err) => {
        console.info("Backend offline, displaying demo book:", err);
      });
  }, [BooksId]);

  // Handle borrow book submission
  const handleBorrow = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const borrowData = {
      bookId: book._id,
      bookTitle: book.title,
      userName: formData.get("userName"),
      email: formData.get("email"),
      borrowDate: new Date().toISOString(),
    };

    console.log("Borrow Request Data:", borrowData);

    try {
      const res = await fetch("http://localhost:5000/borrow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(borrowData),
      });

      if (res.ok) {
        console.log("Book borrowed successfully!");
      }
    } catch (error) {
      console.warn("Backend not reached:", error);
    } finally {
      setIsSubmitting(false);
      setOpen(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#f5f8f7] px-4 py-8 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-[1100px]">
        {/* Breadcrumb Navigation */}
        <nav className="mb-5 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#104e5b] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/All-Books"
            className="hover:text-[#104e5b] transition-colors"
          >
            All Books
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#104e5b]">{book.title}</span>
        </nav>

        {/* Book Details Container */}
        <div className="grid gap-8 rounded-2xl border border-gray-200 bg-white p-6 md:grid-cols-[300px_1fr] md:gap-10 md:p-8">
          {/* Left: Book Cover */}
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

            {/* Gradient Overlay for Title */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

            {/* Book Title on Cover */}
            <h2 className="relative z-10 text-2xl font-bold leading-snug text-white">
              {book.title}
            </h2>
          </div>

          {/* Right: Book Information */}
          <div className="flex flex-col justify-center">
            {/* Category Badge */}
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

            {/* Copies Stat Cards */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
              {/* Total Copies */}
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-xs font-medium text-gray-500">Total Copies</p>
                <h3 className="mt-1 text-xl font-bold text-gray-800">
                  {book.copies}
                </h3>
              </div>

              {/* Available Copies */}
              <div className="rounded-xl bg-[#e5f3f0] p-4">
                <p className="text-xs font-medium text-gray-600">Available now</p>
                <h3 className="mt-1 text-xl font-bold text-[#104e5b]">
                  {book.copies} copies
                </h3>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 space-y-1.5">
              <p className="text-sm leading-relaxed text-gray-600">
                {book.description}
              </p>
            </div>

            {/* Borrow Action with Shadcn Dialog */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger
                  render={
                    <Button
                      type="button"
                      disabled={book.copies <= 0}
                      className="h-11 rounded-lg bg-[#b68339] px-6 text-sm font-bold tracking-wider text-white uppercase hover:bg-[#a1712c] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {book.copies > 0
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
                        defaultValue="Ayesha Rahman"
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
                        defaultValue="ayesha@example.com"
                        readOnly
                        className="h-11 rounded-lg border-0 bg-[#eef3f2] px-3.5 text-sm text-gray-800 focus-visible:ring-0 cursor-default"
                      />
                    </div>

                    {/* Dialog Buttons */}
                    <div className="flex items-center gap-3 pt-3">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-10 rounded-lg bg-[#104e5b] px-5 text-sm font-semibold text-white hover:bg-[#0c3e49] transition-colors"
                      >
                        {isSubmitting ? "Borrowing..." : "Confirm Borrow"}
                      </Button>

                      <DialogClose
                        render={
                          <Button
                            type="button"
                            variant="outline"
                            className="h-10 rounded-lg border border-[#104e5b] bg-white px-5 text-sm font-semibold text-[#104e5b] hover:bg-[#104e5b]/5 transition-colors"
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
