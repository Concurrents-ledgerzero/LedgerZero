import type { Friend, User } from "../types"


const defaultFriends: Friend[] = [
  {
    id: "2",
    name: "Priya Gupta",
    upiId: "priya.gupta@upi",
    avatar: "/woman-avatar.png",
    recentlyUsed: true,
  },
  {
    id: "3",
    name: "Rajesh Kumar",
    upiId: "rajesh.kumar@upi",
    avatar: "/man-avatar.png",
    recentlyUsed: true,
  },
  {
    id: "4",
    name: "Sophia Patel",
    upiId: "sophia.patel@upi",
    avatar: "/woman-profile.jpg",
    recentlyUsed: false,
  },
  {
    id: "5",
    name: "Arjun Singh",
    upiId: "arjun.singh@upi",
    avatar: "/man-profile.jpg",
    recentlyUsed: false,
  },
]

export function getUser(): User | null {
  if (typeof window === "undefined") return null

  const savedUser = localStorage.getItem("payHub_user")
  return savedUser ? JSON.parse(savedUser) : null
}

export function createUserAccount(userData: Omit<User, "id" | "avatar" | "upiId" | "balance">): User {
  const upiId = `${userData.name.toLowerCase().replace(/\s+/g, ".")}@upi`

  const newUser: User = {
    id: Date.now().toString(),
    ...userData,
    upiId,
    avatar: "/profile-avatar.png",
    balance: 50000, // Starting balance
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("payHub_user", JSON.stringify(newUser))
  }

  return newUser
}

export function hasUserAccount(): boolean {
  if (typeof window === "undefined") return false
  return !!localStorage.getItem("payHub_user")
}

export function getFriends(): Friend[] {
  return defaultFriends
}

export function updateUserBalance(amount: number): User | null {
  const user = getUser()
  if (!user) return null

  user.balance = Math.max(0, user.balance - amount)

  if (typeof window !== "undefined") {
    localStorage.setItem("payHub_user", JSON.stringify(user))
  }

  return user
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("payHub_user")
  }
}
