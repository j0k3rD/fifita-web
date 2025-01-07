"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const features = [
    {
      icon: <Trophy className="w-8 h-8 mb-4 text-yellow-500" />, // Más brillante
      title: "Torneos Emocionantes",
      description: "Organiza y participa en torneos competitivos de FIFA.",
    },
    // {
    //   icon: <Users className="w-8 h-8 mb-4 text-blue-500" />, // Más brillante
    //   title: "Comunidad Activa",
    //   description:
    //     "Conecta con otros jugadores y forma parte de nuestra comunidad.",
    // },
    // {
    //   icon: <Zap className="w-8 h-8 mb-4 text-green-500" />, // Más brillante
    //   title: "Estadísticas en Tiempo Real",
    //   description: "Sigue tus estadísticas y progreso en tiempo real.",
    // },
  ];

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-8 overflow-hidden bg-black text-white">
      <BackgroundAnimation />
      <motion.div
        className="z-10 flex flex-col items-center justify-center space-y-12 max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500" // Ajuste de gradiente
          variants={itemVariants}
        >
          Torneito de Fifita
        </motion.h1>
        <motion.p
          className="text-xl text-center text-gray-200" // Texto más claro
          variants={itemVariants}
        >
          Bienvenido a la mejor plataforma para organizar torneos de FIFA.
          ¡Prepárate para la acción!
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
          variants={itemVariants}
        >
          <Link href="/tournaments/new">
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
              Crear Nuevo Torneo
            </Button>
          </Link>
          <Link href="/tournaments">
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-transparent hover:bg-white hover:text-gray-900 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
              Ver Torneos Existentes
            </Button>
          </Link>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-1 gap-8 w-full"
          variants={itemVariants}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors duration-300"
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                {feature.icon}
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </motion.div>
      <motion.footer
        className="absolute bottom-0 w-full text-center py-4 text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        © 2024 Torneito de Fifita. Todos los derechos reservados.
      </motion.footer>
    </div>
  );
}
