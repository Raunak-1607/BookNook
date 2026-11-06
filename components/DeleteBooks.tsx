"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { BookType } from "@/lib/Type/Type";
import { useRouter } from "next/navigation";
import { Trash, Loader2 } from "lucide-react";
import { GetTokenFromClient } from "@/lib/GetTokenFromClient";
import { toast } from "react-toastify";
import { BACKEND_URL } from "@/lib/api";

interface DeleteBooksProps {
  book: BookType;
  onBookDeleted?: (id: string) => void;
}

const DeleteBooks: React.FC<DeleteBooksProps> = ({ book, onBookDeleted }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteBook = async () => {
    setIsDeleting(true);
    try {
      const bookId = book._id || (book as unknown as { id: string }).id;
      if (!bookId) {
        throw new Error("Invalid book ID.");
      }

      const token = await GetTokenFromClient().catch(() => "");
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${BACKEND_URL}/books/${bookId}`, {
        method: "DELETE",
        headers,
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && (data.deletedCount > 0 || data.acknowledged)) {
        setOpen(false);
        toast.success("Book deleted successfully.");
        if (onBookDeleted) {
          onBookDeleted(bookId);
        } else {
          router.refresh();
        }
      } else {
        throw new Error(data.error || data.message || "Could not delete this book.");
      }
    } catch (error) {
      console.error("Delete book error:", error);
      toast.error(
        error instanceof Error ? error.message : "Could not delete this book.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <Trash className="size-3.5" />
            <span>Delete</span>
          </Button>
        }
      />

      <DialogContent className="w-[92vw] max-w-sm rounded-2xl bg-white p-5 sm:p-6 shadow-xl border border-gray-200">
        <DialogHeader className="text-center sm:text-left">
          <DialogTitle className="text-lg font-bold text-gray-900">
            Delete &quot;{book.title}&quot;?
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-gray-500">
            This action cannot be undone. Are you sure you want to permanently remove this book?
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <DialogClose
            render={
              <Button
                type="button"
                variant="outline"
                disabled={isDeleting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            }
          />

          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={handleDeleteBook}
            className="w-full sm:w-auto font-semibold"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Yes, Delete"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBooks;
