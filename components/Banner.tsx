"use client";

import * as React from "react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";

type Book = {
    title: string;
    className: string;
};

type Slide = {
    badge: string;
    heading: string;
    description: string;
    books: [Book, Book, Book];
};

const SLIDES: Slide[] = [
    {
        badge: "Your small online library",
        heading: "Add a book. Borrow a book. Return a book.",
        description:
            "Find your next read and keep it for a few days. Simple, friendly and always open.",
        books: [
            {
                title: "The Quiet Orchard",
                className: "bg-[#c15a4a] text-white",
            },
            {
                title: "Atlas of Small Things",
                className: "bg-[#f0a33a] text-[#1a3a5c]",
            },
            {
                title: "Maps of Wind and Tide",
                className: "bg-[#7b5aa6] text-white",
            },
        ],
    },
    {
        badge: "Community powered",
        heading: "Discover new authors. Share your favorites.",
        description:
            "Reserve online, pick it up at the shelf, and pass the story on when you are done.",
        books: [
            {
                title: "The Last Lighthouse",
                className: "bg-[#4a6fa5] text-white",
            },
            {
                title: "Season of the Wren",
                className: "bg-[#6fae8f] text-[#1a3a5c]",
            },
            {
                title: "Letters from the Harbor",
                className: "bg-[#b85c7a] text-white",
            },
        ],
    },
];

function BookFan({ books }: { books: Slide["books"] }) {
    return (
        <div className="relative mx-auto h-80 w-full max-w-md">
            <div
                className={cn(
                    "absolute bottom-6 left-0 flex h-60 w-40 -rotate-12 items-end rounded-2xl p-4 shadow-lg",
                    books[0].className
                )}
            >
                <span className="text-lg font-bold leading-tight">
                    {books[0].title}
                </span>
            </div>
            <div
                className={cn(
                    "absolute bottom-6 right-0 flex h-60 w-40 rotate-12 items-end rounded-2xl p-4 shadow-lg",
                    books[2].className
                )}
            >
                <span className="text-lg font-bold leading-tight">
                    {books[2].title}
                </span>
            </div>
            <div
                className={cn(
                    "absolute bottom-0 left-1/2 z-10 flex h-72 w-48 -translate-x-1/2 items-end rounded-2xl p-4 shadow-xl",
                    books[1].className
                )}
            >
                <span className="text-xl font-bold leading-tight">
                    {books[1].title}
                </span>
            </div>
        </div>
    );
}

const Banner = () => {
    const [api, setApi] = React.useState<CarouselApi>();

    const subscribe = React.useCallback(
        (onStoreChange: () => void) => {
            if (!api) return () => {};

            api.on("select", onStoreChange);
            api.on("reInit", onStoreChange);

            return () => {
                api?.off("select", onStoreChange);
                api?.off("reInit", onStoreChange);
            };
        },
        [api]
    );

    const current = React.useSyncExternalStore(
        subscribe,
        () => api?.selectedScrollSnap() ?? 0,
        () => 0
    );
    const count = React.useSyncExternalStore(
        subscribe,
        () => api?.scrollSnapList().length ?? SLIDES.length,
        () => SLIDES.length
    );

    return (
        <section className="relative w-full overflow-hidden bg-[#d8ece1]">
            <Carousel setApi={setApi} opts={{ loop: true }}>
                <CarouselContent>
                    {SLIDES.map((slide) => (
                        <CarouselItem key={slide.heading}>
                            <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-14 sm:px-10 lg:grid-cols-2 lg:py-20">
                                <div className="flex flex-col items-start gap-5">
                                    <span className="rounded-full border border-[#1a3a5c]/15 bg-white px-3 py-1 text-xs font-medium text-[#1a3a5c]">
                                        {slide.badge}
                                    </span>
                                    <h1 className="max-w-xl text-4xl font-bold tracking-tight text-[#1a3a5c] sm:text-5xl">
                                        {slide.heading}
                                    </h1>
                                    <p className="max-w-md text-[#1a3a5c]/70">
                                        {slide.description}
                                    </p>
                                    <Button className="h-10 rounded-lg bg-[#1a3a5c] px-6 text-white hover:bg-[#1a3a5c]/90">
                                        Browse Books
                                    </Button>
                                </div>
                                <BookFan books={slide.books} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 z-10 border-[#1a3a5c]/20 bg-white/80 text-[#1a3a5c] hover:bg-white" />
                <CarouselNext className="right-4 z-10 border-[#1a3a5c]/20 bg-white/80 text-[#1a3a5c] hover:bg-white" />
            </Carousel>
            <div className="absolute inset-x-0 bottom-4">
                <div className="mx-auto flex max-w-7xl px-6 sm:px-10">
                    <div className="flex items-center gap-2 lg:w-1/2">
                        {Array.from({ length: count }).map((_, i) => (
                            <button
                                key={i}
                                aria-label={`Go to slide ${i + 1}`}
                                onClick={() => api?.scrollTo(i)}
                                className={cn(
                                    "h-2 rounded-full transition-all",
                                    i === current
                                        ? "w-5 bg-[#1a3a5c]"
                                        : "w-2 bg-[#1a3a5c]/25 hover:bg-[#1a3a5c]/40"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
