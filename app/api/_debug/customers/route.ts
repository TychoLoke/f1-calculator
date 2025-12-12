import { NextResponse } from "next/server";
import { getCustomers } from "@/lib/elements/fixtures";

export async function GET() {
  const data = getCustomers();
  return NextResponse.json(data);
}
