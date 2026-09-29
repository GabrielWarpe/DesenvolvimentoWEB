export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-5xl animate-pulse px-5 py-10 sm:py-14">
      <div className="h-4 w-32 rounded bg-line" />
      <div className="mt-2 h-8 w-64 rounded bg-line" />
      <div className="mt-8 h-32 rounded-lg bg-line/60" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[5fr_7fr]">
        <div className="h-80 rounded-lg bg-line/60" />
        <div className="h-80 rounded-lg bg-line/60" />
      </div>
    </main>
  );
}
