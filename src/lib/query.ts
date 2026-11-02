export function listQuery(q?: string, page?: string | number) {
  const query = new URLSearchParams();

  if (q) query.set("q", q);
  if (Number(page) > 1) query.set("page", String(page));

  const value = query.toString();
  return value ? `?${value}` : "";
}
