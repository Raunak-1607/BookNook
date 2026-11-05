export default function LoadingBookDetails() {
  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#f5f8f7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1100px] animate-pulse rounded-2xl border border-gray-200 bg-white p-8">
        <div className="h-6 w-40 rounded bg-gray-200" />
        <div className="mt-8 grid gap-8 md:grid-cols-[300px_1fr]">
          <div className="aspect-[3/4] rounded-xl bg-gray-200" />
          <div className="space-y-5 py-8">
            <div className="h-5 w-20 rounded bg-gray-200" />
            <div className="h-10 w-3/4 rounded bg-gray-200" />
            <div className="h-5 w-1/2 rounded bg-gray-200" />
            <div className="h-24 w-full rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
