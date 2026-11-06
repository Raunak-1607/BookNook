"use client";

import React from "react";
import Image from "next/image";
import { BookType } from "@/lib/Type/Type";
import EditBooks from "./EditBooks";
import DeleteBooks from "./DeleteBooks";

interface MyBookCardProps {
  book: BookType;
  onBookUpdated: (updatedBook: BookType) => void;
  onBookDeleted?: (id: string) => void;
}

const MyBookCardPage: React.FC<MyBookCardProps> = ({
  book,
  onBookUpdated,
  onBookDeleted,
}) => {
  const formattedDate = book.createdAt
    ? new Date(book.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="border-b border-gray-200 transition-colors hover:bg-gray-50/50">
      {/* ============================================================== */}
      {/* 📱 Mobile & Small Tablet Card Layout (< 768px)               */}
      {/* ============================================================== */}
      <div className="flex flex-col gap-3 p-4 md:hidden">
        <div className="flex items-start gap-3.5">
          {/* Book Cover Thumbnail */}
          <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-[#104e5b] shadow-xs">
            {book.image ? (
              <Image
                src={book.image}
                alt={book.title || "Book Cover"}
                fill
                unoptimized
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                {book.title ? book.title.slice(0, 2).toUpperCase() : "BK"}
              </div>
            )}
          </div>

          {/* Book Info */}
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-base font-bold text-[#183b43]">
              {book.title}
            </h3>
            {book.author && (
              <p className="mt-0.5 text-xs text-gray-500">by {book.author}</p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-block rounded-full bg-[#e5f3f0] px-2.5 py-0.5 text-xs font-medium capitalize text-[#104e5b]">
                {book.category}
              </span>
              <span className="text-xs text-gray-400">
                Added: {formattedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <EditBooks
            book={book}
            onBookUpdated={(updatedFields) =>
              onBookUpdated({ ...book, ...updatedFields })
            }
          />
          <DeleteBooks book={book} onBookDeleted={onBookDeleted} />
        </div>
      </div>

      {/* ============================================================== */}
      {/* 💻 Tablet & Desktop Table Row Layout (>= 768px)               */}
      {/* ============================================================== */}
      <div className="hidden md:grid md:grid-cols-5 md:items-center px-4 py-3.5 gap-4">
        {/* Cover */}
        <div>
          <div className="relative h-16 w-14 overflow-hidden rounded-lg bg-[#104e5b] shadow-xs">
            {book.image ? (
              <Image
                src={book.image}
                alt={book.title || "Book Cover"}
                fill
                unoptimized
                className="object-cover"
                sizes="56px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                {book.title ? book.title.slice(0, 2).toUpperCase() : "BK"}
              </div>
            )}
          </div>
        </div>

        {/* Title & Author */}
        <div className="pr-2">
          <h3 className="line-clamp-2 font-bold text-[#183b43]">
            {book.title}
          </h3>
          {book.author && (
            <p className="text-xs text-gray-500">by {book.author}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <span className="inline-block rounded-full bg-[#e5f3f0] px-3 py-1 text-xs font-medium capitalize text-[#104e5b]">
            {book.category}
          </span>
        </div>

        {/* Added Date */}
        <div>
          <p className="text-sm text-gray-600">{formattedDate}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <EditBooks
            book={book}
            onBookUpdated={(updatedFields) =>
              onBookUpdated({ ...book, ...updatedFields })
            }
          />
          <DeleteBooks book={book} onBookDeleted={onBookDeleted} />
        </div>
      </div>
    </div>
  );
};

export default MyBookCardPage;
