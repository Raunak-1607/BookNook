import BookCard, { BookCardProps } from "@/components/BookCard";
import { GetTokenFromServer } from "@/lib/GetTokenFromServer";
import { BACKEND_URL } from "@/lib/api";
import { connection } from "next/server";

// The books API is intentionally read at request time. This route may wait for
// the Express API, rather than requiring it to be part of Next's static shell.
export const instant = false;

const AllBooksPage = async () => {
  // This separate Express API is read only when a user requests this page.
  await connection();
 
  const token = await GetTokenFromServer();
  const res = await fetch(`${BACKEND_URL}/books`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const books = await res.json();
  const bookList: BookCardProps["book"][] = Array.isArray(books) ? books : [];
  return (
    <>
      <h1 className="text-2xl font-bold text-[#26383D]  container mx-auto px-4 py-8">
        All Books
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 container mx-auto px-4 py-8">
        {bookList.map((book: BookCardProps["book"], index: number) => (
          <BookCard key={index} book={book} />
        ))}
      </div>
    </>
  );
};

export default AllBooksPage;
