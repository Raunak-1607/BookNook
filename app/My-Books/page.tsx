
"use client";

import { useEffect, useState } from "react";
import MyBookCardPage from "@/components/MyBookCard";
import { authClient } from "@/lib/auth-client";
import { BookType } from "@/lib/Type/Type";

const MyBooksPage = () => {
  const { data: session, isPending } = authClient.useSession();
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);

  const email = session?.user?.email;

  useEffect(() => {
  const fetchBooks = async () => {
    if (!email) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/books/${encodeURIComponent(email)}`
      );

      const data = await res.json();

      setBooks(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  fetchBooks();
}, [email]);

  if (isPending || loading) {
    return <p className="py-16 text-center">Loading...</p>;
  }

  if (!session) {
    return <p className="py-16 text-center">Please log in to view your books.</p>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">

      <h1 className=" mb-2 text-4xl font-bold text-[#1a4852]">
        My Books
      </h1>
      <p className="text-gray-400 mb-6">Books you added</p>

      {books.length === 0 ? (
        <p className="rounded-xl border p-12 text-center text-gray-500">
          You have not added any books yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <div className="min-w-[900px]">

            <div className="grid grid-cols-5 bg-gray-50 px-4 py-3 font-semibold text-gray-600">
              <p>Image</p>
              <p>Title</p>
              <p>Category</p>
              <p>Added Date</p>
              <p>Actions</p>
            </div>

            {books.map((book) => (
              <MyBookCardPage key={book._id} book={book} />
            ))}

          </div>
        </div>
      )}

    </div>
  );
};

export default MyBooksPage;
