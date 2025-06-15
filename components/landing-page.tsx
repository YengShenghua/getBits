"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/providers/auth-provider"
import { Bitcoin, Shield, Users, Zap, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function LandingPage() {
  const { login, signup } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Form state for signup
  const [signupForm, setSignupForm] = useState({
    email: "",
    phone: "",
    password: "",
    referralCode: "",
  })

  // Form state for login
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })

  const handleSignupChange = (field: string, value: string) => {
    setSignupForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleLoginChange = (field: string, value: string) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login(loginForm.email, loginForm.password)
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to GetBits",
      })
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await signup(signupForm.email, signupForm.password, signupForm.phone, signupForm.referralCode)
      toast({
        title: "Welcome to GetBits! 🎉",
        description: "Account created! You've received 0.002 BTC as a welcome bonus!",
      })
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "Please try again",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gold-900/30 bg-black/90 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bitcoin className="h-8 w-8 text-[#FFD700]" />
            <span className="text-2xl font-bold text-white">
              Get<span className="text-[#FFD700]">Bits</span>
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-white/80">
            <a href="#features" className="hover:text-[#FFD700] transition-colors">
              Features
            </a>
            <a href="#security" className="hover:text-[#FFD700] transition-colors">
              Security
            </a>
            <a href="#trading" className="hover:text-[#FFD700] transition-colors">
              Trading
            </a>
            <Button className="btn-gold">Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#FFD700]/5 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#FFD700]/10 rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
            {/* Hero Content */}
            <div className="text-white space-y-8">
              <div className="inline-block px-3 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] text-sm font-medium mb-4">
                The Future of Crypto Trading
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Trade Crypto Like a <span className="gold-text-gradient">Professional</span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed">
                Join GetBits, the most advanced cryptocurrency exchange platform. Get 0.002 BTC welcome bonus and start
                trading with professional tools.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button className="btn-gold text-lg px-8 py-6">
                  Start Trading
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="btn-dark-gold text-lg px-8 py-6">
                  Learn More
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                <div>
                  <div className="text-3xl font-bold text-[#FFD700]">$2.4B+</div>
                  <div className="text-sm text-white/60">Daily Volume</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#FFD700]">120+</div>
                  <div className="text-sm text-white/60">Cryptocurrencies</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#FFD700]">2M+</div>
                  <div className="text-sm text-white/60">Active Users</div>
                </div>
              </div>
            </div>

            {/* Auth Forms */}
            <Card className="premium-card overflow-hidden">
              <CardHeader className="border-b border-[#FFD700]/10 pb-6">
                <CardTitle className="text-[#FFD700] text-center text-2xl">Get Started</CardTitle>
                <CardDescription className="text-white/70 text-center">
                  Create your account and claim your welcome bonus
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="signup" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-black/50 border border-[#FFD700]/20 mb-6">
                    <TabsTrigger
                      value="signup"
                      className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
                    >
                      Sign Up
                    </TabsTrigger>
                    <TabsTrigger
                      value="login"
                      className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
                    >
                      Login
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-white">
                          Email
                        </Label>
                        <Input
                          id="signup-email"
                          type="email"
                          required
                          value={signupForm.email}
                          onChange={(e) => handleSignupChange("email", e.target.value)}
                          className="bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-phone" className="text-white">
                          Phone (Optional)
                        </Label>
                        <Input
                          id="signup-phone"
                          type="tel"
                          value={signupForm.phone}
                          onChange={(e) => handleSignupChange("phone", e.target.value)}
                          className="bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-white">
                          Password
                        </Label>
                        <Input
                          id="signup-password"
                          type="password"
                          required
                          value={signupForm.password}
                          onChange={(e) => handleSignupChange("password", e.target.value)}
                          className="bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="referral-code" className="text-white">
                          Referral Code (Optional)
                        </Label>
                        <Input
                          id="referral-code"
                          value={signupForm.referralCode}
                          onChange={(e) => handleSignupChange("referralCode", e.target.value)}
                          className="bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                          placeholder="Enter referral code"
                        />
                      </div>
                      <Button type="submit" className="w-full btn-gold py-6 text-lg" disabled={isLoading}>
                        {isLoading ? "Creating Account..." : "Create Account & Get 0.002 BTC"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="login-email" className="text-white">
                          Email
                        </Label>
                        <Input
                          id="login-email"
                          type="email"
                          required
                          value={loginForm.email}
                          onChange={(e) => handleLoginChange("email", e.target.value)}
                          className="bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password" className="text-white">
                          Password
                        </Label>
                        <Input
                          id="login-password"
                          type="password"
                          required
                          value={loginForm.password}
                          onChange={(e) => handleLoginChange("password", e.target.value)}
                          className="bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                          placeholder="••••••••"
                        />
                      </div>
                      <Button type="submit" className="w-full btn-gold py-6 text-lg" disabled={isLoading}>
                        {isLoading ? "Signing In..." : "Sign In"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                {/* Admin Login Info */}
                <div className="mt-6 p-4 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-[#FFD700] font-medium mb-2">🔐 Admin Access</div>
                    <div className="text-xs text-white/70">
                      Email: <span className="font-mono">admin@getbits.com</span>
                    </div>
                    <div className="text-xs text-white/70">
                      Password: <span className="font-mono">admin123</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-24 bg-black relative">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent"></div>

        {/* Background Elements */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#FFD700]/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-[#FFD700]/5 rounded-full filter blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] text-sm font-medium mb-4">
              Premium Features
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose <span className="text-[#FFD700]">GetBits</span>?
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Professional trading platform with industry-leading features and unmatched security
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="premium-card border-[#FFD700]/10 hover:border-[#FFD700]/30 transition-all duration-300 hover:translate-y-[-5px]">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-[#FFD700]/10 flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-[#FFD700]" />
                </div>
                <CardTitle className="text-[#FFD700] text-2xl">Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 leading-relaxed">
                  Execute trades in milliseconds with our high-performance matching engine. Experience zero lag even
                  during peak market volatility.
                </p>
              </CardContent>
            </Card>

            <Card className="premium-card border-[#FFD700]/10 hover:border-[#FFD700]/30 transition-all duration-300 hover:translate-y-[-5px]">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-[#FFD700]/10 flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-[#FFD700]" />
                </div>
                <CardTitle className="text-[#FFD700] text-2xl">Ultra Secure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 leading-relaxed">
                  Bank-level security with 2FA, cold storage, and insurance protection. Your assets are always protected
                  with military-grade encryption.
                </p>
              </CardContent>
            </Card>

            <Card className="premium-card border-[#FFD700]/10 hover:border-[#FFD700]/30 transition-all duration-300 hover:translate-y-[-5px]">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-[#FFD700]/10 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-[#FFD700]" />
                </div>
                <CardTitle className="text-[#FFD700] text-2xl">Earn Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 leading-relaxed">
                  Get bonuses for referrals and enjoy competitive trading fees. Our loyalty program rewards active
                  traders with exclusive benefits.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Bonus Feature */}
          <div className="mt-16 p-8 premium-card border-[#FFD700]/20 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/10 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] text-sm font-medium mb-4">
                  Exclusive Offer
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  Get <span className="text-[#FFD700]">0.002 BTC</span> Welcome Bonus
                </h3>
                <p className="text-white/70 mb-6 leading-relaxed">
                  Start your crypto journey with a boost! Every new user receives 0.002 BTC as a welcome gift. Complete
                  your first deposit and trade to unlock withdrawal.
                </p>
                <Button className="btn-gold">Claim Your Bonus</Button>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <Bitcoin className="h-48 w-48 text-[#FFD700] animate-pulse-gold" />
                  <div className="absolute inset-0 bg-[#FFD700]/20 rounded-full filter blur-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials/Stats Section */}
      <section className="py-24 bg-gradient-to-b from-black via-black/95 to-black relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] text-sm font-medium mb-4">
              Trusted Worldwide
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Join the <span className="text-[#FFD700]">GetBits</span> Community
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Millions of traders choose GetBits for its security, speed, and professional tools
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 premium-card rounded-xl">
              <div className="text-4xl font-bold text-[#FFD700] mb-2">$24B+</div>
              <div className="text-white/70">Monthly Volume</div>
            </div>
            <div className="p-6 premium-card rounded-xl">
              <div className="text-4xl font-bold text-[#FFD700] mb-2">120+</div>
              <div className="text-white/70">Cryptocurrencies</div>
            </div>
            <div className="p-6 premium-card rounded-xl">
              <div className="text-4xl font-bold text-[#FFD700] mb-2">150+</div>
              <div className="text-white/70">Countries Supported</div>
            </div>
            <div className="p-6 premium-card rounded-xl">
              <div className="text-4xl font-bold text-[#FFD700] mb-2">99.9%</div>
              <div className="text-white/70">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-[#FFD700]/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bitcoin className="h-8 w-8 text-[#FFD700]" />
                <span className="text-2xl font-bold text-white">
                  Get<span className="text-[#FFD700]">Bits</span>
                </span>
              </div>
              <p className="text-white/60 mb-4">The next generation cryptocurrency exchange platform.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-white/60 hover:text-[#FFD700]">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-[#FFD700]">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-[#FFD700]">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Platform</h3>
              <ul className="space-y-2 text-white/60">
                <li>
                  <a href="#" className="hover:text-[#FFD700]">
                    Trading
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#FFD700]">
                    Spot Trading
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#FFD700]">
                    Futures
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#FFD700]">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Support</h3>
              <ul className="space-y-2 text-white/60">
                <li>
                  <a href="#" className="hover:text-[#FFD700]">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#FFD700]">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#FFD700]">
                    Bug Bounty
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#FFD700]">
                    Fees
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Legal</h3>
              <ul className="space-y-2 text-white/60">
                <li>
                  <a href="#" className="hover:text-[#FFD700]">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#FFD700]">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#FFD700]">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#FFD700]">
                    Risk Disclosure
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#FFD700]/10 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2024 GetBits. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
