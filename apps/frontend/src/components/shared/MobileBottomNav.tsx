"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Volume2, MessageCircle, User, Sparkles } from "lucide-react"

const navItems = [
  { id: "home", icon: Home, label: "Home",path: "/" },
  { id:"for you", icon: Sparkles, label : "For You" , path: "/for-you"},
  { id: "chat", icon: MessageCircle, label: "Chat", path: "/chat" },
  { id: "audio", icon: Volume2, label: "Audio", path: "/audio" },
  { id: "profile", icon: User, label: "Profile", path: "/profile" },
]

const BottomNavbar=()=> {
  const [activeTab, setActiveTab] = useState("home")

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 bg-card/80 sm:hidden backdrop-blur-lg border-t border-border/50 px-4 py-2 z-50"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center justify-center p-3 rounded-2xl transition-colors duration-200"
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Active background bubble */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeBackground"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                      duration: 0.3,
                    }}
                    className="absolute inset-0 bg-primary/10 rounded-2xl"
                  />
                )}
              </AnimatePresence>

              {/* Icon with bounce animation */}
              <motion.div
                animate={{
                  y: isActive ? -2 : 0,
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
                className="relative z-10"
              >
                <Icon
                  size={24}
                  className={`transition-colors duration-200 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                />
              </motion.div>

              {/* Label with slide animation */}
              <motion.span
                animate={{
                  opacity: isActive ? 1 : 0.7,
                  y: isActive ? 0 : 2,
                  scale: isActive ? 1 : 0.9,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
                className={`text-xs mt-1 font-medium transition-colors duration-200 relative z-10 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </motion.span>

              {/* Ripple effect on tap */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                initial={false}
                animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          )
        })}
      </div>

      {/* Floating indicator dot */}
      <motion.div
        className="absolute bottom-0 left-1/2 w-1 h-1 bg-primary rounded-full"
        animate={{
          x: `${(navItems.findIndex((item) => item.id === activeTab) - 1.5) * 25}%`,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
      />
    </motion.div>
  )
}

export default BottomNavbar;
