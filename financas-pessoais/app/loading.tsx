export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl animate-pulse space-y-6 px-4 py-8 sm:px-6 sm:py-12">
      <div className="space-y-2">
        <div className="h-4 w-40 rounded-lg bg-white/5" />
        <div className="h-9 w-72 rounded-lg bg-white/5" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-36 rounded-2xl bg-white/5 first:sm:col-span-2 first:lg:col-span-1" />
        ))}
        <div className="h-24 rounded-2xl bg-white/5 sm:col-span-2 lg:col-span-3" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
        <div className="h-96 rounded-2xl bg-white/5" />
        <div className="h-96 rounded-2xl bg-white/5" />
      </div>
    </main>
  );
}
