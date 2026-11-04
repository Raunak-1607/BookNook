
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { BookType } from "@/lib/Type/Type";
import { redirect, useRouter } from "next/navigation";
import { Trash } from "lucide-react";

const DeleteBooks = ({ book }: { book: BookType }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleDeleteBook = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/books/${book._id}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (res.ok && data.deletedCount > 0) {
        console.log("Deleted successfully:", data);

        setOpen(false); // Close dialog
        router.refresh(); // Refresh page data
        redirect('/My-Books'); // Redirect to My-Books page
      }
    } catch (error) {
      console.log("Delete failed:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="destructive"><Trash/> Delete</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center font-semibold">
            Are you sure you want to delete?
          </DialogTitle>

          <DialogDescription className="mt-5 flex justify-center gap-4">
            <Button variant="destructive" onClick={handleDeleteBook}>
              Yes
            </Button>

            <Button variant="outline" onClick={() => setOpen(false)}>
              No
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBooks;
