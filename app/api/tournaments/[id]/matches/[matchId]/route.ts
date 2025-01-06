import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string; matchId: string } }
) {
  try {
    const body = await request.json();
    const { homeScore, awayScore } = body;

    const updatedMatch = await prisma.match.update({
      where: { id: params.matchId },
      data: { homeScore, awayScore },
    });

    // Check if all matches in the current round are completed
    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id },
      include: {
        matches: {
          where: { round: updatedMatch.round },
        },
        participants: {
          include: {
            team: true,
          },
        },
      },
    });

    if (!tournament) {
      throw new Error("Tournament not found");
    }

    if (
      tournament.matches.every(
        (m) => m.homeScore !== null && m.awayScore !== null
      )
    ) {
      // Determine winners and create next round matches
      const winners = tournament.matches.map((match) => {
        if (match.homeScore! > match.awayScore!) return match.homeParticipantId;
        if (match.homeScore! < match.awayScore!) return match.awayParticipantId;
        // In case of a tie, use team rating as tie-breaker
        const homeParticipant = tournament.participants.find(
          (p) => p.id === match.homeParticipantId
        );
        const awayParticipant = tournament.participants.find(
          (p) => p.id === match.awayParticipantId
        );
        return homeParticipant!.team.overallRating >
          awayParticipant!.team.overallRating
          ? match.homeParticipantId
          : match.awayParticipantId;
      });

      const nextRoundMatches = [];
      for (let i = 0; i < winners.length; i += 2) {
        if (i + 1 < winners.length) {
          nextRoundMatches.push({
            tournamentId: params.id,
            homeParticipantId: winners[i],
            awayParticipantId: winners[i + 1],
            round: updatedMatch.round + 1,
          });
        }
      }

      if (nextRoundMatches.length > 0) {
        await prisma.match.createMany({ data: nextRoundMatches });

        if (tournament.changeTeamsEachRound) {
          // Reassign teams for the next round
          const availableTeams = await prisma.team.findMany({
            where: {
              NOT: {
                id: {
                  in: tournament.participants.map((p) => p.teamId),
                },
              },
            },
            orderBy: { overallRating: "desc" },
          });

          const shuffledTeams = availableTeams.sort(() => Math.random() - 0.5);

          await Promise.all(
            winners.map(async (winnerId, index) => {
              await prisma.participant.update({
                where: { id: winnerId },
                data: { teamId: shuffledTeams[index].id },
              });
            })
          );
        }
      } else {
        // Tournament is finished
        await prisma.tournament.update({
          where: { id: params.id },
          data: { status: "COMPLETED" },
        });
      }
    }

    return NextResponse.json(updatedMatch);
  } catch (error) {
    console.error("Failed to update match:", error);
    return NextResponse.json(
      { error: "Failed to update match" },
      { status: 500 }
    );
  }
}
