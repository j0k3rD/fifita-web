import { motion, useMotionValue, useTransform } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface TiltCardProps {
  participant: string;
  assignment: {
    team: string;
    logo: string;
  };
  setHoveredCard: (participant: string | null) => void;
  hoveredCard: string | null;
}

export function TiltCard({
  participant,
  assignment,
  setHoveredCard,
  hoveredCard,
}: TiltCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  return (
    <motion.div
      style={{ x, y, rotateX, rotateY, z: 100 }}
      drag
      dragElastic={0.16}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      whileTap={{ cursor: "grabbing" }}
      className="cursor-grab"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <Card
        className="w-full overflow-hidden bg-white/10 backdrop-blur-lg text-white border-white/20"
        onMouseEnter={() => setHoveredCard(participant)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <CardContent className="p-6 relative h-48">
          <motion.div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage: `url(/images/teams/${assignment.logo})`,
            }}
            initial={{ opacity: 0.3, filter: "blur(4px)", scale: 1 }}
            animate={{
              opacity: hoveredCard === participant ? 0.7 : 0.3,
              filter: hoveredCard === participant ? "blur(0px)" : "blur(4px)",
              scale: hoveredCard === participant ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="relative z-10 h-full flex flex-col justify-between"
            initial={{ y: 0 }}
            animate={{ y: hoveredCard === participant ? -10 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="font-bold text-2xl mb-2">{participant}</h2>
            <p className="text-lg font-semibold">{assignment.team}</p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
