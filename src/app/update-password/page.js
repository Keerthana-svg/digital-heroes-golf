"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function UpdatePassword() {
  const [password, setPassword] = useState("")

  const handleUpdate = async () => {
    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) alert(error.message)
    else alert("Password updated successfully!")
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Update Password</h1>

      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-2"
      />

      <button onClick={handleUpdate} className="bg-black text-white px-4 py-2">
        Update Password
      </button>
    </div>
  )
}
