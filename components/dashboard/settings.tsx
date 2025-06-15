"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/providers/auth-provider"
import { Shield, Upload, CheckCircle, AlertCircle, Smartphone } from "lucide-react"

export function Settings() {
  const { user } = useAuth()

  // Form states
  const [profileForm, setProfileForm] = useState({
    phone: user?.phone || "",
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleProfileChange = (field: string, value: string) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <Card className="premium-card border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-[#FFD700]">Account Settings</CardTitle>
          <CardDescription className="text-white/70">Manage your account security and verification</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="bg-black/50 border border-[#FFD700]/20">
              <TabsTrigger
                value="profile"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Security
              </TabsTrigger>
              <TabsTrigger
                value="kyc"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                KYC Verification
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    readOnly
                    className="bg-black/50 border-[#FFD700]/30 text-white/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={profileForm.phone}
                    onChange={(e) => handleProfileChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referral-code" className="text-white">
                    Your Referral Code
                  </Label>
                  <Input
                    id="referral-code"
                    value={user?.referralCode || ""}
                    readOnly
                    className="bg-black/50 border-[#FFD700]/30 text-[#FFD700] font-mono"
                  />
                </div>
                <Button className="btn-gold">Update Profile</Button>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-[#FFD700]/20 rounded-lg bg-black/30">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-[#FFD700]" />
                    <div>
                      <div className="font-medium text-white">Two-Factor Authentication</div>
                      <div className="text-sm text-white/60">Add an extra layer of security to your account</div>
                    </div>
                  </div>
                  <Button className="btn-dark-gold">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Enable 2FA
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-white">Change Password</h4>
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-white">
                      Current Password
                    </Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                      placeholder="••••••••"
                      className="bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-white">
                      New Password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                      placeholder="••••••••"
                      className="bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-white">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                      placeholder="••••••••"
                      className="bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                    />
                  </div>
                  <Button className="btn-gold">Update Password</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="kyc" className="space-y-4">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-[#FFD700]/20 rounded-lg bg-black/30">
                  <div className="flex items-center space-x-3">
                    {user?.kycStatus === "approved" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                    )}
                    <div>
                      <div className="font-medium text-white">KYC Verification Status</div>
                      <div className="text-sm text-white/60">
                        {user?.kycStatus === "approved"
                          ? "Your identity has been verified"
                          : "Complete KYC to unlock withdrawals"}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={user?.kycStatus === "approved" ? "default" : "secondary"}
                    className={user?.kycStatus === "approved" ? "bg-green-600 text-white" : "bg-orange-600 text-white"}
                  >
                    {user?.kycStatus === "approved" ? "Verified" : "Pending"}
                  </Badge>
                </div>

                {user?.kycStatus !== "approved" && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-white">Upload Documents</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Government ID (Front)</Label>
                        <div className="border-2 border-dashed border-[#FFD700]/30 rounded-lg p-8 text-center bg-black/30">
                          <Upload className="h-8 w-8 mx-auto text-[#FFD700] mb-2" />
                          <p className="text-sm text-white/60">Click to upload or drag and drop</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Government ID (Back)</Label>
                        <div className="border-2 border-dashed border-[#FFD700]/30 rounded-lg p-8 text-center bg-black/30">
                          <Upload className="h-8 w-8 mx-auto text-[#FFD700] mb-2" />
                          <p className="text-sm text-white/60">Click to upload or drag and drop</p>
                        </div>
                      </div>
                    </div>
                    <Button className="btn-gold">Submit for Verification</Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium text-white">Email Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-[#FFD700]/20 rounded-lg bg-black/30">
                    <div>
                      <div className="font-medium text-white">Trade Confirmations</div>
                      <div className="text-sm text-white/60">Get notified when your trades are executed</div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded accent-[#FFD700]" />
                  </div>
                  <div className="flex items-center justify-between p-3 border border-[#FFD700]/20 rounded-lg bg-black/30">
                    <div>
                      <div className="font-medium text-white">Deposit/Withdrawal Updates</div>
                      <div className="text-sm text-white/60">Status updates for your transactions</div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded accent-[#FFD700]" />
                  </div>
                  <div className="flex items-center justify-between p-3 border border-[#FFD700]/20 rounded-lg bg-black/30">
                    <div>
                      <div className="font-medium text-white">Security Alerts</div>
                      <div className="text-sm text-white/60">Important security notifications</div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded accent-[#FFD700]" />
                  </div>
                  <div className="flex items-center justify-between p-3 border border-[#FFD700]/20 rounded-lg bg-black/30">
                    <div>
                      <div className="font-medium text-white">Marketing Updates</div>
                      <div className="text-sm text-white/60">News and promotional offers</div>
                    </div>
                    <input type="checkbox" className="rounded accent-[#FFD700]" />
                  </div>
                </div>
                <Button className="btn-gold">Save Preferences</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
