export default function OpenSourceLoading() {
  return (
    <div className="p-8 text-white animate-pulse">
      <div className="h-9 w-64 rounded bg-white/15 mb-6" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="rounded border border-white/15 p-5 space-y-3">
            <div className="h-6 w-2/3 rounded bg-white/15" />
            <div className="h-4 w-full rounded bg-white/10" />
            <div className="h-4 w-5/6 rounded bg-white/10" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-16 rounded-full bg-white/15" />
              <div className="h-6 w-20 rounded-full bg-white/15" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}