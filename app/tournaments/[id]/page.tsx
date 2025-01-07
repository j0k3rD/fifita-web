"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Trash2, UserPlus, Trophy } from "lucide-react";

export default function AddParticipants() {
  const router = useRouter();
  const [participants, setParticipants] = useState([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedParticipants = localStorage.getItem("participants");
    if (storedParticipants) {
      setParticipants(JSON.parse(storedParticipants));
    }
  }, []);

  const addParticipant = () => {
    setParticipants([...participants, ""]);
  };

  const updateParticipant = (index: number, value: string) => {
    const newParticipants = [...participants];
    newParticipants[index] = value;
    setParticipants(newParticipants);
  };

  const removeParticipant = (index: number) => {
    const newParticipants = participants.filter((_, i) => i !== index);
    setParticipants(newParticipants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const filledParticipants = participants.filter((p) => p.trim() !== "");

    if (filledParticipants.length < 2) {
      toast({
        title: "Error",
        description:
          "Se requieren al menos 2 participantes para iniciar el torneo.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Aquí iría la lógica para guardar los participantes en la base de datos
      console.log(filledParticipants);
      localStorage.setItem("participants", JSON.stringify(filledParticipants));
      toast({
        title: "Éxito",
        description: "Participantes guardados correctamente.",
      });
      router.push("/tournaments/start-tournament");
    } catch (error) {
      console.error("Error al guardar participantes:", error);
      toast({
        title: "Error",
        description:
          "Hubo un problema al guardar los participantes. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 animate-fade-in bg-black text-white">
      <motion.h1
        className="text-3xl sm:text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Agregar Participantes
      </motion.h1>
      <Card className="w-full max-w-md bg-gray-800/50 border-gray-700">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <AnimatePresence>
              {participants.map((participant, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <Label
                    htmlFor={`participant-${index}`}
                    className="text-white"
                  >
                    Participante {index + 1}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id={`participant-${index}`}
                      value={participant}
                      onChange={(e) => updateParticipant(index, e.target.value)}
                      className="bg-gray-700 text-white border-gray-600"
                      placeholder="Nombre del participante"
                    />
                    {participants.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeParticipant(index)}
                        variant="destructive"
                        size="icon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                type="button"
                onClick={addParticipant}
                variant="outline"
                className="w-full bg-gray-700 text-white hover:bg-gray-600"
              >
                <UserPlus className="mr-2 h-4 w-4" /> Agregar Participante
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Guardando..."
                ) : (
                  <>
                    <Trophy className="mr-2 h-4 w-4" /> Iniciar Torneo
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
