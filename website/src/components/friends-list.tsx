"use client"

import { motion } from "framer-motion"
import { getFriends } from "../lib/store"
import type { Friend } from "../types"

interface FriendsListProps {
  friends: Friend[]
  onFriendClick: (friend: Friend) => void
}

export function FriendsList({ onFriendClick }: FriendsListProps) {
  const friends = getFriends()

  return (
    <div className="space-y-3">
      {friends.map((friend, index) => (
        <motion.div
          key={friend.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ x: 4 }}
          onClick={() => onFriendClick(friend)}
          className="cursor-pointer"
        >
          <div
            className="
            bg-white
            hover:bg-gray-50
            transition-all
            p-4
            rounded-2xl
            border border-gray-200
            shadow-sm
            hover:shadow-md
            flex
            items-center
            gap-3
            group
          "
          >
            {/* Avatar */}
            <div
              className="
              w-12 h-12
              rounded-full
              bg-gradient-to-br from-blue-500 to-green-400
              flex
              items-center
              justify-center
              text-white
              font-bold
              text-lg
              shadow-md
              group-hover:scale-105
              transition-transform
            "
            >
              {friend.name.charAt(0)}
            </div>

            {/* Friend Info */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {friend.name}
              </h3>
              <p className="text-xs text-gray-500">
                {friend.upiId}
              </p>
            </div>

            {/* Arrow */}
            <motion.div
              className="text-blue-500 text-lg font-semibold"
              whileHover={{ x: 4 }}
            >
              →
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
