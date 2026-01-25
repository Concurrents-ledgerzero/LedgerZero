import { motion } from "framer-motion"
import { getUser } from "../lib/store"

export function BalanceCard() {
  const user = getUser()

  if (user == null) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className="
        relative
        rounded-2xl
        p-8
        overflow-hidden
        bg-white
        shadow-[0_20px_40px_-20px_rgba(0,0,0,0.15)]
        border border-gray-200
        backdrop-blur-xl
        text-gray-900
      "
      >
        {/* Soft pastel glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-200/40 via-green-200/40 to-purple-200/40 blur-3xl"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100/60 rounded-full -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-100/60 rounded-full -ml-16 -mb-16" />

        <div className="relative z-10">
          {/* Card Header */}
          <div className="flex justify-between items-start mb-16">
            <div>
              <p className="text-gray-500 text-sm font-medium">Balance</p>
              <h2 className="text-4xl font-bold mt-2 tracking-wide text-gray-900">
                ₹{user.balance.toLocaleString()}
              </h2>
            </div>

            <div className="text-right">
              <p className="text-gray-500 text-xs">UPI ID</p>
              <p className="text-blue-600 font-semibold mt-1">
                {user.upiId}
              </p>
            </div>
          </div>

          {/* Card Bottom */}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-gray-500 text-xs">Cardholder</p>
              <p className="text-gray-900 font-semibold mt-1">
                {user.name}
              </p>
            </div>

            <div className="text-right">
              <p className="text-gray-500 text-xs">Account</p>
              <p className="text-blue-600 font-mono text-sm mt-1">
                {user.accountNumber
                  .slice(-4)
                  .padStart(user.accountNumber.length, "*")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
