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
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { NewTransactionModal } from "./NewTransactionModal";
import { LoadingLink } from "./LoadingLink";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <NewTransactionModal isOpen={isOpen} onOpenChange={setIsOpen} />
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {data.navMain.map((item, index) => {
            const isActive = pathname === item.url;
            
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ x: isActive ? 0 : 5 }}
              >
                <SidebarMenuItem>
                  <LoadingLink 
                    href={item.url}
                    onNavigate={() => {
                      // Close mobile sidebar when navigating
                      if (isMobile) {
                        setOpenMobile(false);
                      }
                    }}
                  >
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={cn(
                        "transition-all duration-200 w-full relative",
                        isActive && [
                          "bg-gradient-to-r from-primary/20 to-primary-glow/20",
                          "border-l-2 border-primary",
                          "text-primary font-medium",
                          "shadow-sm"
                        ]
                      )}
                    >
                      <motion.div
                        whileHover={{ scale: isActive ? 1.1 : 1.2, rotate: isActive ? 0 : 5 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "relative",
                          isActive && "text-primary"
                        )}
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {isActive && (
                          <motion.div
                            className="absolute -inset-1 bg-primary/20 rounded-full -z-10"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </motion.div>
                      <span className={cn(isActive && "font-medium")}>{item.title}</span>
                      {isActive && (
                        <motion.div
                          className="absolute right-2 w-1.5 h-1.5 bg-primary rounded-full"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1, duration: 0.3 }}
                        />
                      )}
                    </SidebarMenuButton>
                  </LoadingLink>
                </SidebarMenuItem>
              </motion.div>
            );
          })}
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
