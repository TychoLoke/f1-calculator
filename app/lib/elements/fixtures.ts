import fs from "fs";
import path from "path";

function exportRoot(): string {
  const p = process.env.ELEMENTS_EXPORT_PATH || "./data/elements-export";
  return path.isAbsolute(p) ? p : path.join(process.cwd(), p);
}

function readJson(relPath: string): any {
  const full = path.join(exportRoot(), relPath);
  const raw = fs.readFileSync(full, "utf-8");
  return JSON.parse(raw);
}

// Helpers to clean API values
export function naToNull(v: any) {
  if (v === "N/A") return null;
  return v;
}

export function parseNumber(v: any): number | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "number") return v;
  if (typeof v !== "string") return null;

  const s = v.trim();
  if (!s || s === "N/A") return null;

  // "20" -> 20
  if (/^\d+(\.\d+)?$/.test(s)) return Number(s);

  return null;
}

export function parseGB(v: any): number | null {
  // "1.42 GB" -> 1.42
  if (v === null || v === undefined) return null;
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s || s === "N/A") return null;

  const m = s.match(/^(\d+(\.\d+)?)\s*GB$/i);
  if (!m) return null;
  return Number(m[1]);
}

// Core exports
export function getCustomers() {
  return readJson("customers.batch.json");
}

export function getServices() {
  return readJson("services.batch.json");
}

export function getBaselines() {
  return readJson("baselines.batch.json");
}

export function getCustomerBackup(customerId: string) {
  return readJson(`customer_${customerId}/backup.overview.json`);
}

export function getCustomerJobs(customerId: string) {
  // Start with page1, you can expand later
  return readJson(`customer_${customerId}/jobs.page1.json`);
}
