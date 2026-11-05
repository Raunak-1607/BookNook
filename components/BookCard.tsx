import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface BookCardProps {
  book: {
    _id: string;
    title: string;
    author: string;
    category: string;
    image?: string | null;
  };
}

export default function BookCard({ book }: BookCardProps) {
  const imageSrc = book.image?.trim();

  return (
    <Card className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md">

      {/* Book Image */}
      <div className="relative h-44 w-full overflow-hidden rounded-lg bg-[#125361]">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={book.title}
            fill
            className="object-cover"
          />
        )}

        {/* Title Overlay */}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-3">
          <h2 className="text-xl font-bold text-white">
            {book.title}
          </h2>
        </div>
      </div>

      <CardContent className="px-0 pb-0 pt-2">

        {/* Book Information */}
        <h3 className="text-lg font-bold text-[#26383D]">
          {book.title}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {book.author}
        </p>

        {/* Category */}
        <span className="mt-2 inline-block rounded-full bg-[#E4F1EF] px-3 py-1 text-xs font-semibold capitalize text-[#125361]">
          {book.category}
        </span>

        {/* Details Button */}
        <Button
            variant="default"
          className="mt-3 h-11 w-full rounded-lg bg-[#125361] text-base font-semibold text-white hover:bg-[#0D424D]"
        >
          <Link href={`/All-Books/${book._id}`}>
            View Details
          </Link>
        </Button>

      </CardContent>
    </Card>
  );
}
