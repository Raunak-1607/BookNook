"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Pencil, Loader2 } from "lucide-react";
import { BookType } from "@/lib/Type/Type";
import { BACKEND_URL } from "@/lib/api";
import { GetTokenFromClient } from "@/lib/GetTokenFromClient";
import { toast } from "react-toastify";

type EditableBookFields = Pick<
  BookType,
  "title" | "author" | "category" | "copies" | "image" | "description"
>;

interface EditBooksProps {
  book: BookType;
  onBookUpdated: (updatedFields: EditableBookFields) => void;
}

const EditBooks: React.FC<EditBooksProps> = ({ book, onBookUpdated }) => {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(book.category || "fiction");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setCategory(book.category || "fiction");
    }
  };

  const handleEditBook = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const rawData = Object.fromEntries(formData.entries());
      const copies = Number(rawData.copies);

      if (!Number.isInteger(copies) || copies < 1) {
        toast.error("Copies must be a whole number of at least 1.");
        setIsSubmitting(false);
        return;
      }

      const selectedCategory = String(rawData.category || category || "fiction").toLowerCase();

      const data: EditableBookFields = {
        title: String(rawData.title || "").trim(),
        author: String(rawData.author || "").trim(),
        category: selectedCategory,
        copies,
        image: String(rawData.image ?? "").trim(),
        description: String(rawData.description ?? "").trim(),
      };

      if (!data.title) {
        toast.error("Book title is required.");
        setIsSubmitting(false);
        return;
      }

      const bookId = book._id || (book as unknown as { id: string }).id;
      if (!bookId) {
        toast.error("Invalid book ID.");
        setIsSubmitting(false);
        return;
      }

      const token = await GetTokenFromClient().catch(() => "");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${BACKEND_URL}/books/${bookId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMsg = "Could not update this book.";
        try {
          const result = await response.json();
          errorMsg = result.error || result.message || errorMsg;
        } catch {
          // ignore parsing error
        }
        throw new Error(errorMsg);
      }

      onBookUpdated(data);
      setOpen(false);
      toast.success("Book updated successfully!");
    } catch (error) {
      console.error("Edit book error:", error);
      toast.error(
        error instanceof Error ? error.message : "Could not update this book.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 border-[#104e5b] text-[#104e5b] hover:bg-[#104e5b]/10 hover:text-[#104e5b]"
          >
            <Pencil className="size-3.5" />
            <span>Edit</span>
          </Button>
        }
      />

      <DialogContent className="max-h-[90vh] w-[95vw] max-w-lg overflow-y-auto rounded-2xl bg-white p-5 sm:max-w-xl sm:p-7 shadow-xl border border-gray-200">
        <DialogHeader className="text-left mb-2">
          <DialogTitle className="text-2xl sm:text-3xl font-bold text-[#124e5d]">
            Edit Book
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-gray-500">
            Make changes to your book details. Click save when you are done.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4 pt-2" onSubmit={handleEditBook}>
          {/* Book Title */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-title" className="text-sm font-medium text-gray-700">
              Book Title
            </Label>
            <Input
              id="edit-title"
              name="title"
              placeholder="Enter the book title"
              defaultValue={book.title}
              required
              className="h-10 text-sm"
            />
          </div>

          {/* Author Name */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-author" className="text-sm font-medium text-gray-700">
              Author Name
            </Label>
            <Input
              id="edit-author"
              name="author"
              placeholder="Enter the author"
              defaultValue={book.author}
              required
              className="h-10 text-sm"
            />
          </div>

          {/* Category and Copies */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Category</Label>
              <Select
                name="category"
                value={category}
                onValueChange={(val) => setCategory(val || "fiction")}
              >
                <SelectTrigger className="w-full h-10 text-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fiction">Fiction</SelectItem>
                  <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-copies" className="text-sm font-medium text-gray-700">
                Total Copies
              </Label>
              <Input
                id="edit-copies"
                name="copies"
                type="number"
                defaultValue={book.copies?.toString() || "1"}
                min="1"
                required
                className="h-10 text-sm"
              />
            </div>
          </div>

          {/* Book Image */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-image" className="text-sm font-medium text-gray-700">
              Book Image URL
            </Label>
            <Input
              id="edit-image"
              name="image"
              type="text"
              placeholder="Enter image URL"
              defaultValue={book.image}
              className="h-10 text-sm"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-description" className="text-sm font-medium text-gray-700">
              Short Description
            </Label>
            <Textarea
              id="edit-description"
              name="description"
              placeholder="Write a few lines about the book"
              defaultValue={book.description}
              className="min-h-24 resize-none text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-3">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto h-10 border-gray-300"
                >
                  Cancel
                </Button>
              }
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto h-10 bg-[#124e5d] font-semibold text-white hover:bg-[#0d3d49] transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBooks;
