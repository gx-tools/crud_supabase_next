"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { AuthRouteConstants, RouteConstants } from "@/helpers/string_const"
import { signIn, apiSignIn } from "@/utils/auth"
import { useRouter } from "next/navigation"
import { Loader2, Server, Database } from "lucide-react"
import { toast } from "react-toastify"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [useApi, setUseApi] = useState(false)
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      setIsLoading(true)
      
      if (useApi) {
        // Use the NestJS API endpoint
        console.log('Attempting API login...')
        const response = await apiSignIn({ email, password })
        console.log('API Response:', response)
        
        if (!response || response.error) {
          toast.error(response?.error?.message || "Failed to login. Please check your credentials.")
          return
        }
        
        toast.success("Logged in successfully!")
        console.log('Attempting to navigate to:', RouteConstants.HOME)
        router.replace(RouteConstants.HOME)
      } else {
        // Use Supabase direct authentication
        console.log('Attempting Supabase login...')
        const { data, error } = await signIn({ email, password })
        
        if (error) {
          toast.error(error.message || "Failed to login. Please check your credentials.")
          return
        }

        toast.success("Logged in successfully!")
        console.log('Attempting to navigate to:', RouteConstants.HOME)
        router.replace(RouteConstants.HOME)
      }
      
    } catch (error) {
      console.error("Login error:", error)
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
            <CardTitle className="text-2xl font-bold text-center text-primary">Login</CardTitle>
            <div className="flex items-center space-x-2 justify-center mt-2">
              <div className="flex items-center space-x-2">
                <Database className={`h-4 w-4 ${!useApi ? "text-primary" : "text-muted-foreground"}`} />
                <Switch 
                  id="api-toggle"
                  checked={useApi}
                  onCheckedChange={setUseApi}
                />
                <Server className={`h-4 w-4 ${useApi ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <Label htmlFor="api-toggle" className="text-xs">{useApi ? "Using API" : "Using Supabase"}</Label>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <Button 
                type="submit" 
                className="w-full transition-transform transition-colors duration-300 hover:scale-105 active:scale-95"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            <p>Don't have an account? <Link href={AuthRouteConstants.SIGNUP} className="text-primary hover:underline hover:underline-offset-2 transition-colors duration-200">Sign up</Link></p>
          </CardFooter>
        </Card>
      </motion.div>
    </main>
  )
}
