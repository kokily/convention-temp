export function PageHeader({ title }: { title: string }) {
  return (
    <header className="bg-gray-50 py-8 text-center sm:py-10">
      <h1 className="text-3xl font-bold text-heading">{title}</h1>
      <p className="mt-3 text-xs">
        홈 <span className="mx-2 text-gray-400">›</span> <strong>{title}</strong>
      </p>
    </header>
  );
}
