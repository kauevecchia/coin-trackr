"use client";

import {
  CirclePlus,
  TrendingUp,
  Wallet,
  BarChart3,
  PieChart,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { NewTransactionModal } from "./NewTransactionModal";
import { LoadingLink } from "./LoadingLink";
import { motion } from "framer-motion";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
    },
    {
      title: "Portfolio",
      url: "/portfolio",
      icon: Wallet,
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: TrendingUp,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: PieChart,
    },
  ],
};

export function NavMain() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarGroup>
      <NewTransactionModal isOpen={isOpen} onOpenChange={setIsOpen} />
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {data.navMain.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ x: 5 }}
            >
              <SidebarMenuItem>
                <LoadingLink href={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="transition-colors duration-200 w-full"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                    </motion.div>
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </LoadingLink>
              </SidebarMenuItem>
            </motion.div>
          ))}
        </SidebarMenu>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <Separator />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-gradient-to-r from-primary to-primary-glow text-muted dark:text-foreground hover:text-muted hover:scale-[1.03] transition-all cursor-pointer min-w-8 duration-200 ease-linear"
              onClick={() => setIsOpen(true)}
            >
              <CirclePlus />
              <span className="font-medium">New Transaction</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </motion.div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
