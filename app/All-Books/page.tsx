import BookCard, { BookCardProps } from '@/components/BookCard';
import React from 'react';

// The books API is intentionally read at request time. This route may wait for
// the Express API, rather than requiring it to be part of Next's static shell.
export const instant = false;

const AllBooksPage = async () => {


    const res = await fetch("http://localhost:5000/books");
    const books = await res.json();
    return (

        <>
        <h1 className="text-2xl font-bold text-[#26383D]  container mx-auto px-4 py-8">All Books</h1>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 container mx-auto px-4 py-8'>
        
            {
                books.map((book : BookCardProps["book"], index:number)=> <BookCard key={index} book={book} />)
            }
        </div>
        </>
    );
};

export default AllBooksPage;
