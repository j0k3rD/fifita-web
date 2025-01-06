import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, changeTeamsEachRound } = body;

    const tournament = await prisma.tournament.create({
      data: {
        name,
        changeTeamsEachRound,
      },
    });

    return NextResponse.json(tournament);
  } catch (error) {
    console.error("Failed to create tournament:", error);
    return NextResponse.json(
      { error: "Failed to create tournament" },
      { status: 500 }
    );
  }
}
