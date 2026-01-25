import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { updateUserBalance, getUser } from "../lib/store"
import type { Friend } from "../types"

interface PaymentPageProps {
  friend: Friend
  onBack: () => void
}

export function PaymentPage({ friend, onBack }: PaymentPageProps) {
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const user = getUser()
  const canPay =
    amount &&
    Number.parseFloat(amount) > 0 &&
    Number.parseFloat(amount) <= user.balance

  const handlePayment = async () => {
    if (!canPay) return
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    updateUserBalance(Number.parseFloat(amount))
    setIsProcessing(false)
    setShowSuccess(true)

    setTimeout(() => {
      onBack()
    }, 2000)
  }

  /* ---------------- Success Screen ---------------- */
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-400 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-4xl shadow-lg"
          >
            ✓
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful
          </h1>
          <p className="text-gray-600 mb-6">
            ₹{Number.parseFloat(amount).toLocaleString()} sent to {friend.name}
          </p>
          <p className="text-sm text-gray-500">Redirecting…</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white border-b border-gray-200 pt-6 pb-8"
      >
        <div className="max-w-md mx-auto px-4 flex items-center gap-4">
          <motion.button
            whileHover={{ x: -4 }}
            onClick={onBack}
            className="text-2xl text-gray-600 hover:text-gray-900"
          >
            ←
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Pay {friend.name}
            </h1>
            <p className="text-sm text-gray-500">{friend.upiId}</p>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Friend Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 text-center shadow-sm"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-green-400 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-md">
            {friend.name.charAt(0)}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {friend.name}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {friend.upiId}
          </p>
        </motion.div>

        {/* Amount Input */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-blue-600">
              ₹
            </span>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="pl-10 text-right text-3xl font-bold bg-white border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {amount && Number.parseFloat(amount) > user.balance && (
            <p className="text-red-500 text-sm mt-2">
              Insufficient balance
            </p>
          )}
        </motion.div>

        {/* Reason */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Note (optional)
          </label>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Lunch, gift, travel..."
            className="bg-white border-gray-300 focus:border-blue-500"
          />
        </div>

        {/* Summary */}
        {amount && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-xl p-4 mt-8 space-y-3 shadow-sm"
          >
            <div className="flex justify-between">
              <span className="text-gray-500">Amount</span>
              <span className="font-bold text-gray-900">
                ₹{Number.parseFloat(amount).toLocaleString()}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="text-gray-500">New Balance</span>
              <span className="font-bold text-gray-900">
                ₹{(user.balance - Number.parseFloat(amount)).toLocaleString()}
              </span>
            </div>
          </motion.div>
        )}

        {/* Pay Button */}
        <Button
          onClick={handlePayment}
          disabled={!canPay || isProcessing}
          className={`w-full mt-8 h-14 font-semibold rounded-xl transition-all ${
            canPay
              ? "bg-gradient-to-r from-blue-500 to-green-400 text-white hover:shadow-lg"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isProcessing ? "Processing..." : `Pay ₹${amount || "0"}`}
        </Button>

        <Button
          onClick={onBack}
          variant="ghost"
          className="w-full mt-3 text-gray-500 hover:text-gray-900"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
