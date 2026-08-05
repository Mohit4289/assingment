interface PaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

function pageWindow(page: number, totalPages: number): number[] {
  const size = 5;
  let start = Math.max(1, page - Math.floor(size / 2));
  const end = Math.min(totalPages, start + size - 1);
  start = Math.max(1, end - size + 1);
  const pages: number[] = [];
  for (let p = start; p <= end; p++) pages.push(p);
  return pages;
}

export function Pagination({ page, totalPages, totalCount, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = pageWindow(page, totalPages);

  const buttonClass = (active: boolean) =>
    `min-w-[2.25rem] rounded-lg px-3 py-1.5 text-sm font-medium transition ${
      active
        ? "bg-amber-400 text-slate-900"
        : "bg-slate-800 text-slate-200 hover:bg-slate-700"
    }`;

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-2 pt-2"
    >
      <button
        type="button"
        className={buttonClass(false)}
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        Prev
      </button>

      {pages[0] > 1 && <span className="px-1 text-slate-500">…</span>}

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          className={buttonClass(p === page)}
          aria-current={p === page ? "page" : undefined}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <span className="px-1 text-slate-500">…</span>
      )}

      <button
        type="button"
        className={buttonClass(false)}
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        Next
      </button>

      <span className="ml-3 text-xs text-slate-400">
        Page {page} of {totalPages} · {totalCount} characters
      </span>
    </nav>
  );
}
