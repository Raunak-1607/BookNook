import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Pencil } from "lucide-react";
import { BookType } from "@/lib/Type/Type";
import { useRouter } from "next/navigation";

const EditBooks = ({ book }: { book: BookType }) => {
     const router =useRouter();
  const handleAddBook = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    console.log("Book Data:", data);

    const res = await fetch(`http://localhost:5000/books/${book._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    // console.log("response from server" , res);
    //   const afterSubmit = await res.json();
    //   console.log("After submit",afterSubmit);

    console.log("response from server", res);
    const afterSubmit = await res.json();
    console.log("After submit", afterSubmit);

    if (afterSubmit.insertedId || afterSubmit.insertId || res.ok) {
      // router.push('/books')
      router.refresh();
    }
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button variant="outline">
            <Pencil></Pencil>Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className="flex flex-col items-start gap-4 ">
            <DialogTitle className="mb-5 text-3xl font-bold text-[#124e5d]">
              Edit Book
            </DialogTitle>
            <DialogDescription>
              <form className="space-y-4" onSubmit={handleAddBook}>
                {/* Book Title */}
                <div className="space-y-1.5">
                  <Label htmlFor="title">Book Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter the book title"
                    defaultValue={book.title}
                    required
                  />
                </div>

                {/* Author Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="author">Author Name</Label>
                  <Input
                    id="author"
                    name="author"
                    placeholder="Enter the author"
                    defaultValue={book.author}
                    required
                  />
                </div>

                {/* Category and Copies */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Category</Label>

                    <Select name="category" defaultValue={book.category}>
                      <SelectTrigger className="w-full">
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
                    <Label htmlFor="copies">Total Copies</Label>
                    <Input
                      id="copies"
                      name="copies"
                      type="number"
                      defaultValue={book.copies?.toString() || "1"}
                      min="1"
                      required
                    />
                  </div>
                </div>

                {/* Book Image */}
                <div className="space-y-1.5">
                  <Label htmlFor="image">Book Image</Label>
                  <Input
                    id="image"
                    name="image"
                    type="text"
                    placeholder="Enter the image URL"
                    defaultValue={book.image}
                    accept="image/*"
                    className="cursor-pointer file:mr-2 file:border-0 file:bg-transparent file:text-sm"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Write a few lines about the book"
                    defaultValue={book.description}
                    className="min-h-24 resize-none"
                  />
                </div>

                {/* User Information */}
                {/* <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="userName">User Name</Label>
                          <Input
                            id="userName"
                            name="userName"
                            defaultValue={user?.name}
                            readOnly
                            className="bg-[#eef3f2]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={user?.email}
                            readOnly
                            className="bg-[#eef3f2]"
                          />
                        </div>
                      </div> */}

                {/* Submit */}
                <Button
                  type="submit"
                  className="bg-[#124e5d] mt-4 font-semibold hover:bg-[#0d3d49]"
                >
                  Save the Changes
                </Button>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditBooks;
