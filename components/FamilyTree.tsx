"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import * as d3 from "d3";
import { TreeNode, CrossEdge } from "@/lib/tree";
import { GeneticGroup } from "@/lib/types";

const GROUP_COLOR: Record<string, string> = {
  "Ethiopian Wild":      "#7c6f3e",
  "Ethiopian Landrace":  "#a07840",
  "Ethiopian Legacy":    "#8a6830",
  "Typica":              "#3b6b8a",
  "Bourbon":             "#6b3f1e",
  "Bourbon x Typica":    "#7a5030",
  "Catimor":             "#4a7a4a",
  "Sarchimor":           "#3a6a3a",
  "F1 Hybrid":           "#6a4a7a",
  "Timor Hybrid":        "#5a4a2a",
  "Unknown":             "#888888",
  "root":                "#999999",
};

const CERTAINTY_DASH: Record<string, string> = {
  "wcr-verified": "none",
  "classified":   "none",
  "pending":      "4,3",
  "insufficient": "4,3",
  "unknown":      "4,3",
};

interface Props {
  root: TreeNode;
  crossEdges: CrossEdge[];
}

export default function FamilyTree({ root, crossEdges }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const router = useRouter();

  const draw = useCallback(() => {
    if (!svgRef.current) return;
    const container = svgRef.current.parentElement!;
    const W = container.clientWidth || 900;
    const H = Math.max(container.clientHeight, 600);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", W).attr("height", H);

    const g = svg.append("g");

    // Zoom + pan
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 3])
      .on("zoom", (event) => g.attr("transform", event.transform));
    svg.call(zoom);

    // Build hierarchy and layout
    const hier = d3.hierarchy<TreeNode>(root);
    const nodeCount = hier.leaves().length;
    const nodeHeight = Math.max(28, Math.min(48, H / nodeCount));

    const treeLayout = d3.tree<TreeNode>()
      .nodeSize([nodeHeight, 220])
      .separation((a, b) => a.parent === b.parent ? 1 : 1.4);

    // treeLayout returns (and mutates) the hierarchy as HierarchyPointNode
    const pointRoot = treeLayout(hier);

    // Center vertically
    let minX = Infinity, maxX = -Infinity;
    pointRoot.each((d) => {
      minX = Math.min(minX, d.x);
      maxX = Math.max(maxX, d.x);
    });
    const offsetY = H / 2 - (minX + maxX) / 2;
    g.attr("transform", `translate(60, ${offsetY})`);

    // Build id → point map for cross edges
    const nodeMap = new Map<string, d3.HierarchyPointNode<TreeNode>>();
    pointRoot.each((d) => nodeMap.set(d.data.id, d));

    // Draw cross edges (dashed, secondary parent connections)
    crossEdges.forEach(({ sourceId, targetId }) => {
      const src = nodeMap.get(sourceId);
      const tgt = nodeMap.get(targetId);
      if (!src || !tgt) return;
      g.append("path")
        .attr("d", `M${src.y},${src.x} C${(src.y + tgt.y) / 2},${src.x} ${(src.y + tgt.y) / 2},${tgt.x} ${tgt.y},${tgt.x}`)
        .attr("fill", "none")
        .attr("stroke", "#c4855a")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "5,4")
        .attr("opacity", 0.6);
    });

    // Draw tree links
    g.selectAll(".link")
      .data(pointRoot.links())
      .join("path")
      .attr("class", "link")
      .attr("d", d3.linkHorizontal<d3.HierarchyPointLink<TreeNode>, d3.HierarchyPointNode<TreeNode>>()
        .x((d) => d.y)
        .y((d) => d.x))
      .attr("fill", "none")
      .attr("stroke", "#d5c9bc")
      .attr("stroke-width", 1.5);

    // Draw nodes
    const node = g.selectAll(".node")
      .data(pointRoot.descendants())
      .join("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.y},${d.x})`)
      .style("cursor", (d) => d.data.id.startsWith("cluster-") || d.data.id === "root" ? "default" : "pointer")
      .on("click", (_, d) => {
        if (!d.data.id.startsWith("cluster-") && d.data.id !== "root") {
          router.push(`/varieties/${d.data.id}`);
        }
      });

    // Circle
    node.append("circle")
      .attr("r", (d) => d.data.id === "root" ? 6 : d.data.id.startsWith("cluster-") ? 5 : 7)
      .attr("fill", (d) => GROUP_COLOR[d.data.geneticGroup] ?? "#888")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", (d) => CERTAINTY_DASH[d.data.certainty] ?? "none")
      .attr("opacity", (d) => d.data.id.startsWith("cluster-") ? 0.4 : 1);

    // WCR verified ring
    node.filter((d) => d.data.wcrSnpVerified)
      .append("circle")
      .attr("r", 11)
      .attr("fill", "none")
      .attr("stroke", "#16a34a")
      .attr("stroke-width", 1.5)
      .attr("opacity", 0.7);

    // Labels
    node.append("text")
      .attr("dy", "0.32em")
      .attr("x", (d) => d.children ? -12 : 12)
      .attr("text-anchor", (d) => d.children ? "end" : "start")
      .attr("font-size", (d) =>
        d.data.id === "root" ? 11 :
        d.data.id.startsWith("cluster-") ? 10 : 12)
      .attr("font-family", "Georgia, serif")
      .attr("fill", (d) =>
        d.data.id === "root" || d.data.id.startsWith("cluster-")
          ? "#8a7968"
          : "#1a1612")
      .attr("font-style", (d) =>
        d.data.id === "root" || d.data.id.startsWith("cluster-") ? "italic" : "normal")
      .text((d) => d.data.name);

    // Initial position
    svg.call(zoom.transform, d3.zoomIdentity.translate(80, 0));
  }, [root, crossEdges, router]);

  useEffect(() => {
    draw();
    const observer = new ResizeObserver(draw);
    if (svgRef.current?.parentElement) observer.observe(svgRef.current.parentElement);
    return () => observer.disconnect();
  }, [draw]);

  return (
    <div className="w-full h-full min-h-[600px] overflow-hidden bg-[#faf8f5]">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
