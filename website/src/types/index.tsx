// Types for the payment app

export interface User {
  id: string
  name: string
  phone: string
  upiId: string
  accountNumber: string
  ifscCode: string
  bankName: string
  balance: number
  avatar: string
}

export interface Friend {
  id: string
  name: string
  upiId: string
  avatar: string
  recentlyUsed?: boolean
}

export interface Transaction {
  id: string
  fromUserId: string
  toUserId: string
  amount: number
  reason: string
  timestamp: Date
  status: "pending" | "completed" | "failed"
}
