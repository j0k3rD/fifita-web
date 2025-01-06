import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const leagues = await prisma.league.findMany();
    return NextResponse.json(leagues);
  } catch (error) {
    console.error("Failed to fetch leagues:", error);
    return NextResponse.json(
      { error: "Failed to fetch leagues" },
      { status: 500 }
    );
  }
}
