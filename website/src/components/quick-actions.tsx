"use client"

import { motion } from "framer-motion"
import { Button } from "../components/ui/button"

export function QuickActions() {
  const actions = [
    { icon: "📱", label: "Send Money", action: "send" },
    { icon: "📱", label: "Receive Money", action: "receive" },
    { icon: "📱", label: "Check Balance", action: "balance" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 20 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-3 gap-3 mt-6"
    >
      {actions.map((action, index) => (
        <motion.div key={action.action} whileHover={{ y: -4 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            className="w-full h-20 flex flex-col items-center justify-center bg-card hover:bg-secondary border-border rounded-xl"
          >
            <span className="text-2xl mb-1">{action.icon}</span>
            <span className="text-xs font-medium text-foreground">{action.label}</span>
          </Button>
        </motion.div>
      ))}
    </motion.div>
  )
}
