"use client";

import { motion } from "framer-motion";
import { Bitcoin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeaderProps {
  showAuthButtons?: boolean;
}

const Header = ({ showAuthButtons = true }: HeaderProps) => {
  return (
    <motion.header 
      className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <motion.div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="bg-gradient-to-br from-gradient-amber via-gradient-sky to-gradient-indigo rounded-lg p-1.5 sm:p-2"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Bitcoin className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
            </motion.div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-br from-gradient-amber via-gradient-sky to-gradient-indigo text-transparent bg-clip-text">
              CoinTrackr
            </h1>
          </motion.div>
        </Link>
        
        {showAuthButtons && (
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hover:bg-accent text-sm sm:text-base px-3 sm:px-4">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-gradient-sky to-gradient-indigo hover:from-gradient-sky/90 hover:to-gradient-indigo/90 text-white text-sm sm:text-base px-3 sm:px-4">
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;