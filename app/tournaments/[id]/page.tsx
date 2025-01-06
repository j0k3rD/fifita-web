"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddParticipants() {
  const router = useRouter();
  const [participants, setParticipants] = useState([""]);

  const addParticipant = () => {
    setParticipants([...participants, ""]);
  };

  const updateParticipant = (index: number, value: string) => {
    const newParticipants = [...participants];
    newParticipants[index] = value;
    setParticipants(newParticipants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar los participantes en la base de datos
    console.log(participants);
    localStorage.setItem("participants", JSON.stringify(participants)); // Guardamos temporalmente en localStorage
    router.push("/tournaments/start-tournament");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Agregar Participantes</h1>
      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
        {participants.map((participant, index) => (
          <div key={index} className="space-y-2">
            <Label htmlFor={`participant-${index}`}>
              Participante {index + 1}
            </Label>
            <Input
              id={`participant-${index}`}
              value={participant}
              onChange={(e) => updateParticipant(index, e.target.value)}
              required
            />
          </div>
        ))}
        <Button
          type="button"
          onClick={addParticipant}
          variant="outline"
          className="w-full"
        >
          Agregar Participante
        </Button>
        <Button type="submit" className="w-full">
          Iniciar Torneo
        </Button>
      </form>
    </div>
  );
}
