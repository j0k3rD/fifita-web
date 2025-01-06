// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function POST(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const tournament = await prisma.tournament.findUnique({
//       where: { id: params.id },
//       include: { participants: true },
//     });

//     if (!tournament) {
//       return NextResponse.json(
//         { error: "Tournament not found" },
//         { status: 404 }
//       );
//     }

//     if (tournament.status !== "NOT_STARTED") {
//       return NextResponse.json(
//         { error: "Tournament has already started" },
//         { status: 400 }
//       );
//     }

//     if (tournament.participants.length < 2) {
//       return NextResponse.json(
//         { error: "Not enough participants" },
//         { status: 400 }
//       );
//     }

//     // Get all teams
//     const teams = await prisma.team.findMany();

//     // Shuffle teams
//     const shuffledTeams = teams.sort(() => Math.random() - 0.5);

//     // Assign teams to participants
//     const updatedParticipants = await Promise.all(
//       tournament.participants.map(async (participant, index) => {
//         return prisma.participant.update({
//           where: { id: participant.id },
//           data: { teamId: shuffledTeams[index].id },
//         });
//       })
//     );

//     // Shuffle participants for matchups
//     const shuffledParticipants = updatedParticipants.sort(
//       () => Math.random() - 0.5
//     );

//     // Create matches
//     const matches = [];
//     for (let i = 0; i < shuffledParticipants.length; i += 2) {
//       if (i + 1 < shuffledParticipants.length) {
//         matches.push({
//           tournamentId: tournament.id,
//           homeParticipantId: shuffledParticipants[i].id,
//           awayParticipantId: shuffledParticipants[i + 1].id,
//           round: 1,
//         });
//       }
//     }

//     await prisma.match.createMany({ data: matches });

//     // Update tournament status
//     await prisma.tournament.update({
//       where: { id: params.id },
//       data: { status: "IN_PROGRESS" },
//     });

//     return NextResponse.json({ message: "Tournament started successfully" });
//   } catch (error) {
//     console.error("Failed to start tournament:", error);
//     return NextResponse.json(
//       { error: "Failed to start tournament" },
//       { status: 500 }
//     );
//   }
// }
