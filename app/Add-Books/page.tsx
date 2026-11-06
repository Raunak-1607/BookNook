"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { GetTokenFromClient } from "@/lib/GetTokenFromClient";
import { toast } from "react-toastify";
import { BACKEND_URL } from "@/lib/api";

const AddBookPage = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [isSubmitting, setIsSubmitting] = useState(false);

  
const handleAddBook = async (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  // Capture form and data before await
  const form = event.currentTarget;
  const formData = new FormData(form);

  setIsSubmitting(true);

  try {
    const jwtToken = await GetTokenFromClient();

    const rawData = Object.fromEntries(formData.entries());
    const copies = Number(rawData.copies);

    if (!Number.isInteger(copies) || copies < 1) {
      toast.error("Copies must be a whole number of at least 1.");
      return;
    }

    const data = {
      ...rawData,
      copies,
      totalCopies: copies,
      createdAt: new Date().toISOString(),
    };

    const response = await fetch(`${BACKEND_URL}/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Could not add this book.");
    }

    toast.success("Book added successfully.");

    form.reset();

    router.push("/All-Books");
    router.refresh();

  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Could not add this book."
    );
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-[#f5f8f7] px-4 py-8">
      <Card className="mx-auto max-w-xl rounded-2xl border border-gray-200 shadow-none">
        <CardContent className="p-6">
          <h1 className="mb-5 text-3xl font-bold text-[#124e5d]">Add a Book</h1>

          <form className="space-y-4" onSubmit={handleAddBook}>
            {/* Book Title */}
            <div className="space-y-1.5">
              <Label htmlFor="title">Book Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter the book title"
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
                required
              />
            </div>

            {/* Category and Copies */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Category</Label>

                <Select name="category" defaultValue="fiction">
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
                  defaultValue="1"
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
                className="min-h-24 resize-none"
              />
            </div>

            {/* User Information */}
            <div className="grid gap-3 sm:grid-cols-2">
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
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#124e5d] font-semibold hover:bg-[#0d3d49]"
            >
              {isSubmitting ? "Adding..." : "Add Book"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBookPage;
