"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { AuthRouteConstants } from "@/helpers/string_const"
import { signUp } from "@/utils/auth"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      setIsLoading(true)
      const { data, error } = await signUp({ email, password })

      if (error) {
        toast.error(error.message || "Failed to create account. Please try again.")
        return
      }

      toast.success("Account created successfully! Please check your email to verify your account.")
      router.push(AuthRouteConstants.LOGIN)
    } catch (error) {
      console.error("Signup error:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
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
              {/* <div>
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
              </div> */}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                  className="transition-colors duration-200 focus:ring-primary focus:border-primary hover:border-secondary"
                />
              </div>
              {/* <div>
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
              </div> */}
              <Button 
                type="submit" 
                className="w-full transition-transform transition-colors duration-300 hover:scale-105 active:scale-95"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            <p>Already have an account? <Link href={AuthRouteConstants.LOGIN} className="text-primary hover:underline hover:underline-offset-2 transition-colors duration-200">Log in</Link></p>
          </CardFooter>
        </Card>
      </motion.div>
    </main>
  )
}
