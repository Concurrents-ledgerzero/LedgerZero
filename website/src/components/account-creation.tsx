import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { createUserAccount } from "../lib/store"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

interface AccountCreationProps {
  onAccountCreated: () => void
}

export default function AccountCreation({ onAccountCreated }: AccountCreationProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
  })

  const [step, setStep] = useState(1)
  const [isCreating, setIsCreating] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = async () => {
    if (step === 1 && formData.fullName && formData.phone) {
      setStep(2)
    } else if (step === 2 && formData.accountNumber && formData.ifscCode && formData.bankName) {
      setIsCreating(true)
      await new Promise((resolve) => setTimeout(resolve, 500))
      createUserAccount({
        name: formData.fullName,
        phone: formData.phone,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        bankName: formData.bankName,
      })
      onAccountCreated()
    }
  }

  const upiId = `${formData.fullName.toLowerCase().replace(/\s+/g, ".")}@upi`

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-400 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
              ₹
            </div>
            <h1 className="text-3xl font-bold text-gray-900">PayHub</h1>
            <p className="text-gray-500 mt-2">Create your account</p>
          </div>

          {/* Progress */}
          <div className="flex gap-2 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-blue-500" : "bg-gray-200"}`} />
            ))}
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700">Full name</label>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="bg-white border-gray-300 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">Phone number</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit phone"
                  type="tel"
                  className="bg-white border-gray-300 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700">Bank</label>
                <select
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select bank</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>SBI</option>
                  <option>Axis Bank</option>
                  <option>Kotak Bank</option>
                </select>
              </div>

              <Input
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Account number"
                className="bg-white border-gray-300 focus:border-blue-500"
              />

              <Input
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                placeholder="IFSC code"
                className="bg-white border-gray-300 focus:border-blue-500"
              />

              {formData.fullName && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Your UPI ID</p>
                  <p className="text-lg font-bold text-blue-600">{upiId}</p>
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-8">
            {step === 2 && (
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={isCreating}
              className="flex-1 bg-gradient-to-r from-blue-500 to-green-400 text-white"
            >
              {isCreating ? "Creating..." : step === 1 ? "Next" : "Create Account"}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
