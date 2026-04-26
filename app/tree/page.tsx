import { getAllVarieties } from "@/lib/varieties";
import { buildTree } from "@/lib/tree";
import { TreeClientWrapper } from "@/components/TreeClientWrapper";

export default function TreePage() {
  const varieties = getAllVarieties();
  const { root, crossEdges } = buildTree(varieties);

  return (
    <div className="flex flex-col h-[calc(100vh-57px)]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)] bg-white shrink-0">
        <div>
          <h1 className="text-base font-semibold">Family Tree</h1>
          <p className="text-xs text-[var(--muted)]">
            Click any variety to open its detail page. Dashed orange lines show cross-breeding. Green rings indicate WCR DNA-verified varieties.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-[#6b3f1e]" /> Bourbon
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-[#3b6b8a]" /> Typica
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-[#7c6f3e]" /> Ethiopian Wild
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-[#a07840]" /> Ethiopian Landrace
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" className="shrink-0">
              <circle cx="7" cy="7" r="5" fill="none" stroke="#16a34a" strokeWidth="1.5" />
            </svg>
            WCR Verified
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="18" height="10">
              <line x1="0" y1="5" x2="18" y2="5" stroke="#c4855a" strokeWidth="1.5" strokeDasharray="5,3" />
            </svg>
            Cross-bred
          </span>
        </div>
      </div>

      {/* Tree canvas — fills remaining height */}
      <div className="flex-1 overflow-hidden">
        <TreeClientWrapper root={root} crossEdges={crossEdges} />
      </div>
    </div>
  );
}
