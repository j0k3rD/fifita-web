import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { selectedLeagues, selectedTeams } = body;

    let teams;
    if (selectedTeams) {
      teams = await prisma.team.findMany({
        where: { id: { in: selectedTeams } },
      });
    } else {
      teams = await prisma.team.findMany({
        where: { leagueId: { in: selectedLeagues } },
      });
    }

    const participants = await prisma.participant.findMany({
      where: { tournamentId: params.id },
    });

    if (teams.length < participants.length) {
      return NextResponse.json(
        { error: "Not enough teams selected" },
        { status: 400 }
      );
    }

    // Shuffle teams
    const shuffledTeams = teams.sort(() => Math.random() - 0.5);

    // Assign teams to participants
    const updates = participants.map((participant, index) =>
      prisma.participant.update({
        where: { id: participant.id },
        data: { teamId: shuffledTeams[index].id },
      })
    );

    await prisma.$transaction(updates);

    return NextResponse.json({ message: "Teams assigned successfully" });
  } catch (error) {
    console.error("Failed to assign teams:", error);
    return NextResponse.json(
      { error: "Failed to assign teams" },
      { status: 500 }
    );
  }
}
