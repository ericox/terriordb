import { CoffeeVariety } from "./types";
import fs from "fs";
import path from "path";

const VARIETIES_DIR = path.join(process.cwd(), "data", "varieties");

export function getAllVarieties(): CoffeeVariety[] {
  const files = fs.readdirSync(VARIETIES_DIR).filter((f) => f.endsWith(".json"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(VARIETIES_DIR, file), "utf-8");
    return JSON.parse(raw) as CoffeeVariety;
  });
}

export function getVarietyById(id: string): CoffeeVariety | undefined {
  const filePath = path.join(VARIETIES_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return undefined;
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as CoffeeVariety;
}

// Resolve all parent IDs for a variety into full CoffeeVariety objects
export function getParents(variety: CoffeeVariety, all: CoffeeVariety[]): CoffeeVariety[] {
  return variety.parentIds
    .map((id) => all.find((v) => v.id === id))
    .filter((v): v is CoffeeVariety => v !== undefined);
}

// Return all varieties that list this variety as a parent
export function getChildren(variety: CoffeeVariety, all: CoffeeVariety[]): CoffeeVariety[] {
  return all.filter((v) => v.parentIds.includes(variety.id));
}

// Lookup by any alias or primary name (case-insensitive)
export function findByName(query: string, all: CoffeeVariety[]): CoffeeVariety | undefined {
  const q = query.toLowerCase().trim();
  return all.find(
    (v) =>
      v.name.toLowerCase() === q ||
      v.aliases.some((a) => a.toLowerCase() === q)
  );
}
