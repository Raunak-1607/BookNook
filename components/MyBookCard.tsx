import { BookType } from "@/lib/Type/Type";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import EditBooks from "./EditBooks";
import { Button } from "./ui/button";

interface MyBookCardProps {
  book: BookType;
}

const MyBookCardPage = ({ book }: MyBookCardProps) => {
  return (
    <div className="grid grid-cols-5 items-center border-b border-gray-200 px-4 py-4">
      {/* Image with fallback */}
      <div>
        <div className="relative h-16 w-14 overflow-hidden rounded-lg bg-[#104e5b]">
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

      {/* Title */}
      <div>
        <h3 className="font-bold text-[#183b43]">{book.title}</h3>
      </div>

      {/* Category */}
      <div>
        <p className="capitalize text-gray-600">{book.category}</p>
      </div>

      {/* Added Date */}
      <div>
        <p className="text-gray-600">
          {book.createdAt
            ? new Date(book.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "N/A"}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
       <EditBooks book={book}></EditBooks>

        <Button
          
          variant="destructive"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default MyBookCardPage;
