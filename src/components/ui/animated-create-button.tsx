"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkle } from "lucide-react";
import { DrawerTrigger } from "@/components/ui/drawer";

export function AnimatedCreateButton() {
  return (
    <DrawerTrigger asChild>
      <motion.div
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="inline-block p-[2px] rounded-md bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 bg-[length:200%_auto] hover:scale-105 transition-transform duration-300"
      >
        <Button
          variant="ghost"
          size="lg"
          className="bg-background text-foreground shadow-lg transition-all duration-300 ease-in-out transform hover:bg-background/95 relative overflow-hidden group"
        >
          <motion.div
            animate={{
              x: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <Sparkle className="mr-2 h-5 w-5 relative z-10" />
          <span className="relative z-10">Create Your First App</span>
        </Button>
      </motion.div>
    </DrawerTrigger>
  );
}
