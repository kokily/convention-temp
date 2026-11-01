export function todayKST() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
  }).format(new Date());
}

export function parseMonth(value: unknown) {
  return typeof value === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(value) ? value : todayKST().slice(0, 7);
}

export function shiftMonth(month: string, diff: number) {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1 + diff, 1)).toISOString().slice(0, 7);
}

// 앞뒤 빈칸은 null, 날짜 칸은 YYYY-MM-DD
export function buildCells(month: string) {
  const [y, m] = month.split("-").map(Number);
  const firstDay = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const lastDate = new Date(Date.UTC(y, m, 0)).getUTCDate();

  const cells: (string | null)[] = Array(firstDay).fill(null);

  for (let d = 1; d <= lastDate; d++) {
    cells.push(`${month}-${String(d).padStart(2, "0")}`);
  }

  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
