import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 space-y-8 animate-fade-in">
      <h1 className="text-4xl font-bold text-center">Torneito de Fifita</h1>
      <p className="text-center">
        Bienvenido a la mejor plataforma para organizar torneos de FIFA. xd
      </p>
      <div className="flex space-x-4">
        <Link href="/tournaments/new">
          <Button>Crear Nuevo Torneo</Button>
        </Link>
        <Link href="/tournaments">
          <Button variant="outline">Ver Torneos Existentes</Button>
        </Link>
      </div>
    </div>
  );
}
