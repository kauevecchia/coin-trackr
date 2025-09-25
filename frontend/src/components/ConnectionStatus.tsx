"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ConnectionStatusProps {
  isConnected: boolean;
  connectionError: string | null;
  lastUpdateTime: Date | null;
  className?: string;
}

const ConnectionStatus = ({
  isConnected,
  connectionError,
  lastUpdateTime,
  className,
}: ConnectionStatusProps) => {
  const [timeAgo, setTimeAgo] = useState<string | null>(null);

  useEffect(() => {
    if (lastUpdateTime) {
      const updateTimeAgo = () => {
        const now = new Date();
        const seconds = Math.floor((now.getTime() - lastUpdateTime.getTime()) / 1000);

        if (seconds < 60) {
          setTimeAgo(`${seconds}s ago`);
        } else if (seconds < 3600) {
          setTimeAgo(`${Math.floor(seconds / 60)}m ${seconds % 60}s ago`);
        } else if (seconds < 86400) {
          setTimeAgo(`${Math.floor(seconds / 3600)}h ${seconds % 3600}m ago`);
        } else {
          setTimeAgo(`${Math.floor(seconds / 86400)}d ${seconds % 86400}h ago`);
        }
      };

      updateTimeAgo();
      const interval = setInterval(updateTimeAgo, 1000); // update every second
      return () => clearInterval(interval);
    }
    setTimeAgo(null);
  }, [lastUpdateTime]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      className={cn(
        "flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full",
        isConnected
          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
          : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
        className
      )}
    >
      <span
        className={cn(
          "w-2 h-2 rounded-full",
          isConnected ? "bg-green-500" : "bg-red-500"
        )}
      />
      <span>
        {isConnected ? "Live updates" : "Offline"}
        {lastUpdateTime && isConnected && timeAgo && ` (${timeAgo})`}
      </span>
      {connectionError && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-red-600 dark:text-red-300 ml-2"
        >
          ({connectionError})
        </motion.span>
      )}
    </motion.div>
  );
};

export default ConnectionStatus;