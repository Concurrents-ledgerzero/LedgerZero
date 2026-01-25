import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../components/ui/button"
import type { Friend } from "../types"
import { QRCode } from 'react-qrcode-logo';
interface PaymentModalProps {
  friend: Friend
  isOpen: boolean
  onClose: () => void
  onProceed: () => void
}

const QRCodeDisplay = ({ upiId, name }: { upiId: string; name: string }) => {
  
  const qrUrl = `devanchauhan012@okhdfc`

  return (
    <QRCode value={qrUrl} size={240} bgColor="#ffffff" fgColor="#000000" />
  )
}

export function PaymentModal({ friend, isOpen, onClose, onProceed }: PaymentModalProps) {
  const [showQR, setShowQR] = useState(false)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center"
        >
          <motion.div
            initial={{ y: 200 }}
            animate={{ y: 0 }}
            exit={{ y: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full md:max-w-md rounded-t-3xl md:rounded-2xl p-6 shadow-xl border border-gray-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Pay {friend.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {friend.upiId}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
              >
                ✕
              </motion.button>
            </div>

            {!showQR ? (
              <motion.div
                key="options"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {/* Friend Card */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-green-400 flex items-center justify-center text-white text-2xl font-bold shadow">
                    {friend.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{friend.name}</h3>
                    <p className="text-sm text-gray-500">{friend.upiId}</p>
                  </div>
                </div>

                {/* Scan QR */}
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Button
                    onClick={() => setShowQR(true)}
                    className="w-full h-16 bg-gradient-to-r from-blue-500 to-green-400 text-white font-semibold rounded-xl flex flex-col items-center justify-center gap-1 shadow-md"
                  >
                    <span className="text-xl">📱</span>
                    Scan QR
                  </Button>
                </motion.div>

                {/* Transfer */}
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Button
                    onClick={onProceed}
                    variant="outline"
                    className="w-full h-16 border-2 border-blue-500 text-blue-600 rounded-xl flex flex-col items-center justify-center gap-1"
                  >
                    <span className="text-xl">💳</span>
                    Transfer Money
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="qr"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <QRCodeDisplay upiId={friend.upiId} name={friend.name} />

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Ask {friend.name} to scan
                  </p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {friend.upiId}
                  </p>
                </div>

                <Button
                  onClick={() => setShowQR(false)}
                  variant="outline"
                  className="w-full border-blue-500 text-blue-600"
                >
                  Back
                </Button>
              </motion.div>
            )}

            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full mt-4 text-gray-500 hover:text-gray-900"
            >
              Cancel
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
