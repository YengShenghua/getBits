"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Shield, DollarSign, Mail } from "lucide-react"

export function SystemSettings() {
  const [tradingEnabled, setTradingEnabled] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [newRegistrations, setNewRegistrations] = useState(true)
  const [kycRequired, setKycRequired] = useState(true)

  return (
    <div className="space-y-6">
      <Card className="premium-card border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-[#FFD700]">System Settings</CardTitle>
          <CardDescription className="text-white/70">
            Configure platform settings and operational parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="bg-black/50 border border-[#FFD700]/20">
              <TabsTrigger
                value="general"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                General
              </TabsTrigger>
              <TabsTrigger
                value="trading"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Trading
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Security
              </TabsTrigger>
              <TabsTrigger
                value="fees"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Fees
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card className="premium-card border-[#FFD700]/20">
                <CardHeader>
                  <CardTitle className="text-[#FFD700] flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Platform Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Maintenance Mode</Label>
                      <p className="text-sm text-white/60">Disable all trading and user access</p>
                    </div>
                    <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">New User Registrations</Label>
                      <p className="text-sm text-white/60">Allow new users to create accounts</p>
                    </div>
                    <Switch checked={newRegistrations} onCheckedChange={setNewRegistrations} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">KYC Required</Label>
                      <p className="text-sm text-white/60">Require KYC verification for withdrawals</p>
                    </div>
                    <Switch checked={kycRequired} onCheckedChange={setKycRequired} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="platform-name" className="text-white">
                      Platform Name
                    </Label>
                    <Input
                      id="platform-name"
                      defaultValue="GetBits"
                      className="bg-black/50 border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="support-email" className="text-white">
                      Support Email
                    </Label>
                    <Input
                      id="support-email"
                      defaultValue="support@getbits.com"
                      className="bg-black/50 border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                    />
                  </div>

                  <Button className="btn-gold">Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trading" className="space-y-6">
              <Card className="premium-card border-[#FFD700]/20">
                <CardHeader>
                  <CardTitle className="text-[#FFD700] flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Trading Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Trading Enabled</Label>
                      <p className="text-sm text-white/60">Enable/disable all trading activities</p>
                    </div>
                    <Switch checked={tradingEnabled} onCheckedChange={setTradingEnabled} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min-trade" className="text-white">
                        Minimum Trade Amount (USD)
                      </Label>
                      <Input
                        id="min-trade"
                        defaultValue="10"
                        className="bg-black/50 border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-trade" className="text-white">
                        Maximum Trade Amount (USD)
                      </Label>
                      <Input
                        id="max-trade"
                        defaultValue="1000000"
                        className="bg-black/50 border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="daily-limit" className="text-white">
                        Daily Trading Limit (USD)
                      </Label>
                      <Input
                        id="daily-limit"
                        defaultValue="100000"
                        className="bg-black/50 border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="order-timeout" className="text-white">
                        Order Timeout (minutes)
                      </Label>
                      <Input
                        id="order-timeout"
                        defaultValue="30"
                        className="bg-black/50 border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                      />
                    </div>
                  </div>

                  <Button className="btn-gold">Save Trading Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card className="premium-card border-[#FFD700]/20">
                <CardHeader>
                  <CardTitle className="text-[#FFD700] flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Security Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="max-login-attempts" className="text-white">
                        Max Login Attempts
                      </Label>
                      <Input
                        id="max-login-attempts"
                        defaultValue="5"
                        className="bg-black/50 border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lockout-duration" className="text-white">
                        Lockout Duration (minutes)
                      </Label>
                      <Input
                        id="lockout-duration"
                        defaultValue="30"
                        className="bg-black/50 border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout" className="text-white">
                        Session Timeout (hours)
                      </Label>
                      <Input
                        id="session-timeout"
                        defaultValue="24"
                        className="bg-black/50 border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="withdrawal-limit" className="text-white">
                        Daily Withdrawal Limit (USD)
                      </Label>
                      <Input
                        id="withdrawal-limit"
                        defaultValue="50000"
                        className="bg-black/50 border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                      />
                    </div>
                  </div>

                  <Button className="btn-gold">Save Security Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fees" className="space-y-6">
              <Card className="premium-card border-[#FFD700]/20">
                <CardHeader>
                  <CardTitle className="text-[#FFD700] flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Fee Structure
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="trading-fee" className="text-white">
                        Trading Fee (%)
                      </Label>
                      <Input
                        id="trading-fee"
                        defaultValue="0.1"
                        className="bg-black/50 border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="withdrawal-fee" className="text-white">
                        Withdrawal Fee (%)
                      </Label>
                      <Input
                        id="withdrawal-fee"
                        defaultValue="0.5"
                        className="bg-black/50 border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="deposit-fee" className="text-white">
                        Deposit Fee (%)
                      </Label>
                      <Input
                        id="deposit-fee"
                        defaultValue="0"
                        className="bg-black/50 border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="referral-bonus" className="text-white">
                        Referral Bonus (USD)
                      </Label>
                      <Input
                        id="referral-bonus"
                        defaultValue="5"
                        className="bg-black/50 border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                      />
                    </div>
                  </div>

                  <Button className="btn-gold">Save Fee Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="premium-card border-[#FFD700]/20">
                <CardHeader>
                  <CardTitle className="text-[#FFD700] flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-server" className="text-white">
                      SMTP Server
                    </Label>
                    <Input
                      id="smtp-server"
                      defaultValue="smtp.getbits.com"
                      className="bg-black/50 border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-port" className="text-white">
                        SMTP Port
                      </Label>
                      <Input
                        id="smtp-port"
                        defaultValue="587"
                        className="bg-black/50 border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="from-email" className="text-white">
                        From Email
                      </Label>
                      <Input
                        id="from-email"
                        defaultValue="noreply@getbits.com"
                        className="bg-black/50 border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                      />
                    </div>
                  </div>

                  <Button className="btn-gold">Save Notification Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
