import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
        <div className="w-9 h-9 rounded-xl
        flex items-center justify-center 
        bg-orange-300 transition hover:bg-orange-500
        border border-white
        shadow-sm
        shadow-glow">

      <motion.div
        whileHover={{ rotate: 12 }}
        className="w-6 h-6 relative"
      >
        <Image 
          src="/cutlery.png" 
          alt="Platemates logo"
          fill
          className="object-contain drop-shadow-sm"
        />
      </motion.div>
        </div>
      <span className="font-bold text-xl  ">
        Platemates
      </span>
    </Link>
  );
}