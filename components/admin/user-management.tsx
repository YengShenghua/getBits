"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, MoreHorizontal, Ban, AlertTriangle, Eye, Edit } from "lucide-react"

const mockUsers = [
  {
    id: "1",
    email: "john.doe@example.com",
    name: "John Doe",
    status: "active",
    kycStatus: "approved",
    balance: 1250.5,
    joinDate: "2024-01-15",
    lastLogin: "2024-01-20 14:30",
    country: "USA",
    riskLevel: "low",
  },
  {
    id: "2",
    email: "jane.smith@example.com",
    name: "Jane Smith",
    status: "suspended",
    kycStatus: "pending",
    balance: 0,
    joinDate: "2024-01-18",
    lastLogin: "2024-01-19 09:15",
    country: "UK",
    riskLevel: "medium",
  },
  {
    id: "3",
    email: "mike.wilson@example.com",
    name: "Mike Wilson",
    status: "active",
    kycStatus: "rejected",
    balance: 5420.75,
    joinDate: "2024-01-10",
    lastLogin: "2024-01-20 16:45",
    country: "Canada",
    riskLevel: "high",
  },
]

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [kycFilter, setKycFilter] = useState("all")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600 text-white">Active</Badge>
      case "suspended":
        return <Badge className="bg-red-600 text-white">Suspended</Badge>
      case "pending":
        return <Badge className="bg-orange-600 text-white">Pending</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getKYCBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-600 text-white">Approved</Badge>
      case "pending":
        return <Badge className="bg-orange-600 text-white">Pending</Badge>
      case "rejected":
        return <Badge className="bg-red-600 text-white">Rejected</Badge>
      default:
        return <Badge variant="secondary">Not Started</Badge>
    }
  }

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "low":
        return <Badge className="bg-green-600 text-white">Low</Badge>
      case "medium":
        return <Badge className="bg-orange-600 text-white">Medium</Badge>
      case "high":
        return <Badge className="bg-red-600 text-white">High</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card className="premium-card border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-[#FFD700]">User Management</CardTitle>
          <CardDescription className="text-white/70">
            Manage user accounts, KYC status, and account security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all-users" className="w-full">
            <TabsList className="bg-black/50 border border-[#FFD700]/20">
              <TabsTrigger
                value="all-users"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                All Users
              </TabsTrigger>
              <TabsTrigger
                value="kyc-pending"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                KYC Pending
              </TabsTrigger>
              <TabsTrigger
                value="high-risk"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                High Risk
              </TabsTrigger>
              <TabsTrigger
                value="suspended"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Suspended
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all-users" className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                    <Input
                      placeholder="Search users by email, name, or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px] bg-black/50 border-[#FFD700]/30 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-[#FFD700]/30">
                    <SelectItem value="all" className="text-white">
                      All Status
                    </SelectItem>
                    <SelectItem value="active" className="text-white">
                      Active
                    </SelectItem>
                    <SelectItem value="suspended" className="text-white">
                      Suspended
                    </SelectItem>
                    <SelectItem value="pending" className="text-white">
                      Pending
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select value={kycFilter} onValueChange={setKycFilter}>
                  <SelectTrigger className="w-[150px] bg-black/50 border-[#FFD700]/30 text-white">
                    <SelectValue placeholder="KYC Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-[#FFD700]/30">
                    <SelectItem value="all" className="text-white">
                      All KYC
                    </SelectItem>
                    <SelectItem value="approved" className="text-white">
                      Approved
                    </SelectItem>
                    <SelectItem value="pending" className="text-white">
                      Pending
                    </SelectItem>
                    <SelectItem value="rejected" className="text-white">
                      Rejected
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button className="btn-dark-gold">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>

              {/* Users Table */}
              <div className="border border-[#FFD700]/20 rounded-lg overflow-hidden">
                <div className="bg-[#FFD700]/10 px-6 py-3 border-b border-[#FFD700]/20">
                  <div className="grid grid-cols-8 gap-4 text-sm font-medium text-white">
                    <span>User</span>
                    <span>Status</span>
                    <span>KYC</span>
                    <span>Balance</span>
                    <span>Risk Level</span>
                    <span>Country</span>
                    <span>Last Login</span>
                    <span>Actions</span>
                  </div>
                </div>
                <div className="divide-y divide-[#FFD700]/10">
                  {mockUsers.map((user) => (
                    <div key={user.id} className="px-6 py-4 hover:bg-[#FFD700]/5">
                      <div className="grid grid-cols-8 gap-4 items-center">
                        <div>
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-sm text-white/60">{user.email}</div>
                        </div>
                        <div>{getStatusBadge(user.status)}</div>
                        <div>{getKYCBadge(user.kycStatus)}</div>
                        <div className="text-white">${user.balance.toLocaleString()}</div>
                        <div>{getRiskBadge(user.riskLevel)}</div>
                        <div className="text-white">{user.country}</div>
                        <div className="text-white/60 text-sm">{user.lastLogin}</div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="btn-dark-gold">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="btn-dark-gold">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="btn-dark-gold">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="kyc-pending" className="space-y-4">
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">KYC Pending Review</h3>
                <p className="text-white/60">15 users waiting for KYC verification</p>
                <Button className="mt-4 btn-gold">Review KYC Applications</Button>
              </div>
            </TabsContent>

            <TabsContent value="high-risk" className="space-y-4">
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">High Risk Users</h3>
                <p className="text-white/60">3 users flagged for suspicious activity</p>
                <Button className="mt-4 btn-gold">Review Risk Assessments</Button>
              </div>
            </TabsContent>

            <TabsContent value="suspended" className="space-y-4">
              <div className="text-center py-8">
                <Ban className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Suspended Accounts</h3>
                <p className="text-white/60">8 accounts currently suspended</p>
                <Button className="mt-4 btn-gold">Manage Suspensions</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
