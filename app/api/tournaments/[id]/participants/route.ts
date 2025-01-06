// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function POST(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const body = await request.json();
//     const { name } = body;

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
//         { error: "Cannot add participants after tournament has started" },
//         { status: 400 }
//       );
//     }

//     const participant = await prisma.participant.create({
//       data: {
//         name,
//         tournamentId: params.id,
//       },
//     });

//     return NextResponse.json(participant);
//   } catch (error) {
//     console.error("Failed to add participant:", error);
//     return NextResponse.json(
//       { error: "Failed to add participant" },
//       { status: 500 }
//     );
//   }
// }
