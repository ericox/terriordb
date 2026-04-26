import { CoffeeVariety, GeneticGroup } from "./types";

export interface TreeNode {
  id: string;
  name: string;
  geneticGroup: GeneticGroup | "root";
  certainty: string;
  wcrSnpVerified: boolean;
  // Secondary parent ID for cross-bred varieties (shown as dashed edge)
  crossParentId?: string;
  children?: TreeNode[];
}

// Cross edges to render as dashed lines separately from the main tree
export interface CrossEdge {
  sourceId: string; // the variety
  targetId: string; // the secondary parent
}

// For multi-parent varieties, pick the primary parent for the tree position.
// The secondary becomes a cross edge.
const PRIMARY_PARENT: Record<string, string> = {
  catuai: "caturra",
  "mundo-novo": "bourbon",
  pacamara: "maragogype",
};

export function buildTree(varieties: CoffeeVariety[]): {
  root: TreeNode;
  crossEdges: CrossEdge[];
} {
  const byId = new Map(varieties.map((v) => [v.id, v]));
  const crossEdges: CrossEdge[] = [];

  // Determine which varieties are roots (no parents, or parents not in our dataset)
  const hasParentInSet = new Set(
    varieties
      .filter((v) => v.parentIds.some((pid) => byId.has(pid)))
      .map((v) => v.id)
  );

  function makeNode(variety: CoffeeVariety): TreeNode {
    const directChildren = varieties.filter((v) => {
      const primary = PRIMARY_PARENT[v.id];
      if (primary) return primary === variety.id;
      return v.parentIds.length === 1 && v.parentIds[0] === variety.id;
    });

    // Collect cross edges for this variety's secondary parents
    if (PRIMARY_PARENT[variety.id]) {
      const secondary = variety.parentIds.find(
        (pid) => pid !== PRIMARY_PARENT[variety.id]
      );
      if (secondary) {
        crossEdges.push({ sourceId: variety.id, targetId: secondary });
      }
    }

    return {
      id: variety.id,
      name: variety.name,
      geneticGroup: variety.geneticGroup,
      certainty: variety.certainty,
      wcrSnpVerified: variety.wcrSnpVerified,
      children: directChildren.length > 0
        ? directChildren.map(makeNode)
        : undefined,
    };
  }

  // Group root varieties under logical origin clusters
  const clusters: { id: string; label: string; group: GeneticGroup | "root"; ids: string[] }[] = [
    {
      id: "cluster-ethiopian-wild",
      label: "Ethiopian Wild",
      group: "Ethiopian Wild",
      ids: varieties.filter((v) => v.geneticGroup === "Ethiopian Wild" && !hasParentInSet.has(v.id)).map((v) => v.id),
    },
    {
      id: "cluster-ethiopian-landrace",
      label: "Ethiopian Landrace",
      group: "Ethiopian Landrace",
      ids: varieties.filter((v) => v.geneticGroup === "Ethiopian Landrace" && !hasParentInSet.has(v.id)).map((v) => v.id),
    },
    {
      id: "cluster-ethiopian-legacy",
      label: "Ethiopian Legacy",
      group: "Ethiopian Legacy",
      ids: varieties.filter((v) => v.geneticGroup === "Ethiopian Legacy" && !hasParentInSet.has(v.id)).map((v) => v.id),
    },
    {
      id: "cluster-typica",
      label: "Typica Lineage",
      group: "Typica",
      ids: varieties.filter((v) => v.geneticGroup === "Typica" && !hasParentInSet.has(v.id)).map((v) => v.id),
    },
    {
      id: "cluster-bourbon",
      label: "Bourbon Lineage",
      group: "Bourbon",
      ids: varieties.filter((v) => v.geneticGroup === "Bourbon" && !hasParentInSet.has(v.id)).map((v) => v.id),
    },
  ];

  const root: TreeNode = {
    id: "root",
    name: "Coffea arabica",
    geneticGroup: "root",
    certainty: "classified",
    wcrSnpVerified: false,
    children: clusters
      .filter((c) => c.ids.length > 0)
      .map((cluster) => ({
        id: cluster.id,
        name: cluster.label,
        geneticGroup: cluster.group,
        certainty: "classified",
        wcrSnpVerified: false,
        children: cluster.ids.map((id) => makeNode(byId.get(id)!)),
      })),
  };

  return { root, crossEdges };
}
