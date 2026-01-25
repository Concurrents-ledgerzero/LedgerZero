import type { Friend } from "../types"
import { useState } from "react"
import { PaymentPage } from "./payment-page"
import { motion } from "motion/react"
import { BalanceCard } from "./balance-card"
import { QuickActions } from "./quick-actions"
import { FriendsList } from "./friends-list"
import { PaymentModal } from "./payment-modal"

export function Dashboard() {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [showPaymentPage, setShowPaymentPage] = useState(false)

  const handleFriendClick = (friend: Friend) => {
    setSelectedFriend(friend)
    setIsPaymentModalOpen(true)
  }

  const handleProceedToPayment = () => {
    setIsPaymentModalOpen(false)
    setShowPaymentPage(true)
  }

  const handleBackFromPayment = () => {
    setShowPaymentPage(false)
    setSelectedFriend(null)
  }

  if (showPaymentPage && selectedFriend) {
    return <PaymentPage friend={selectedFriend} onBack={handleBackFromPayment} />
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8fafc] pb-20">

      {/* Soft background gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-200/50 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-40 w-[500px] h-[500px] bg-cyan-200/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-200px] left-[20%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[140px]" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-white pt-10 pb-14 shadow-lg"
      >
        <div className="max-w-md mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2 tracking-wide">PayHub</h1>
          <p className="text-white/80">Secure Payment Platform</p>
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-md mx-auto px-4 -mt-12">
        <BalanceCard />
        <QuickActions />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-bold text-slate-800 mt-10 mb-4">
            Send Money To
          </h2>
          <FriendsList friends={[]} onFriendClick={handleFriendClick} />
        </motion.div>
      </div>

      {isPaymentModalOpen && selectedFriend && (
        <PaymentModal
          friend={selectedFriend}
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onProceed={handleProceedToPayment}
        />
      )}
    </div>
  )
}
