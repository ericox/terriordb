"use client";

import dynamic from "next/dynamic";
import { TreeNode, CrossEdge } from "@/lib/tree";

const FamilyTree = dynamic(() => import("@/components/FamilyTree"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full text-sm text-[var(--muted)]">
      Loading tree…
    </div>
  ),
});

export function TreeClientWrapper({ root, crossEdges }: { root: TreeNode; crossEdges: CrossEdge[] }) {
  return <FamilyTree root={root} crossEdges={crossEdges} />;
}
