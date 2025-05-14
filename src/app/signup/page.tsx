"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      // TODO: handle error for password mismatch
      return
    }
    // TODO: Integrate signup logic
    console.log({ name, email, password })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 transition-colors duration-300">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} className="w-full max-w-md mx-auto">
        <Card className="transform transition-all duration-300 shadow-lg border-muted bg-card hover:shadow-xl hover:scale-105 hover:border-primary hover:ring-1 hover:ring-primary/30">
          <CardHeader className="pb-3 relative">
            <div className="absolute right-4 top-4">
              <ThemeToggle />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-primary">Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 text-sm font-medium text-foreground">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="transition-colors duration-200 focus:ring-primary focus:border-primary hover:border-secondary"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-colors duration-200 focus:ring-primary focus:border-primary hover:border-secondary"
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-1 text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="transition-colors duration-200 focus:ring-primary focus:border-primary hover:border-secondary"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="transition-colors duration-200 focus:ring-primary focus:border-primary hover:border-secondary"
                />
              </div>
              <Button type="submit" className="w-full transition-transform transition-colors duration-300 hover:scale-105 active:scale-95">Sign Up</Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            <p>Already have an account? <Link href="/login" className="text-primary hover:underline hover:underline-offset-2 transition-colors duration-200">Log in</Link></p>
          </CardFooter>
        </Card>
      </motion.div>
    </main>
  )
} 