"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Shield, Eye, Ban, Activity, Lock } from "lucide-react"

const securityAlerts = [
  {
    id: "SEC001",
    type: "login_attempt",
    severity: "high",
    message: "Multiple failed login attempts from IP 192.168.1.100",
    user: "john.doe@example.com",
    timestamp: "2024-01-20 15:30:00",
    status: "active",
    location: "Unknown Location",
  },
  {
    id: "SEC002",
    type: "suspicious_transaction",
    severity: "medium",
    message: "Large withdrawal attempt without KYC verification",
    user: "jane.smith@example.com",
    timestamp: "2024-01-20 14:15:00",
    status: "investigating",
    location: "London, UK",
  },
  {
    id: "SEC003",
    type: "api_abuse",
    severity: "low",
    message: "High frequency API calls detected",
    user: "api_user_123",
    timestamp: "2024-01-20 13:45:00",
    status: "resolved",
    location: "New York, USA",
  },
]

const blockedIPs = [
  { ip: "192.168.1.100", reason: "Brute force attack", blockedAt: "2024-01-20 15:30:00", attempts: 25 },
  { ip: "10.0.0.50", reason: "Suspicious activity", blockedAt: "2024-01-20 12:15:00", attempts: 15 },
  { ip: "172.16.0.25", reason: "API abuse", blockedAt: "2024-01-19 18:30:00", attempts: 100 },
]

export function SecurityCenter() {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge className="bg-red-600 text-white">High</Badge>
      case "medium":
        return <Badge className="bg-orange-600 text-white">Medium</Badge>
      case "low":
        return <Badge className="bg-yellow-600 text-white">Low</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-red-600 text-white">Active</Badge>
      case "investigating":
        return <Badge className="bg-orange-600 text-white">Investigating</Badge>
      case "resolved":
        return <Badge className="bg-green-600 text-white">Resolved</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="premium-card border-red-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Active Threats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">3</div>
            <p className="text-xs text-white/60">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Blocked IPs</CardTitle>
            <Ban className="h-4 w-4 text-[#FFD700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">127</div>
            <p className="text-xs text-white/60">Currently blocked</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-[#FFD700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">98.5%</div>
            <p className="text-xs text-white/60">System security rating</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Uptime</CardTitle>
            <Activity className="h-4 w-4 text-[#FFD700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">99.9%</div>
            <p className="text-xs text-white/60">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Card className="premium-card border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-[#FFD700]">Security Center</CardTitle>
          <CardDescription className="text-white/70">
            Monitor and manage platform security threats and incidents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="alerts" className="w-full">
            <TabsList className="bg-black/50 border border-[#FFD700]/20">
              <TabsTrigger
                value="alerts"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Security Alerts
              </TabsTrigger>
              <TabsTrigger
                value="blocked-ips"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Blocked IPs
              </TabsTrigger>
              <TabsTrigger
                value="audit-log"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Audit Log
              </TabsTrigger>
              <TabsTrigger
                value="firewall"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Firewall Rules
              </TabsTrigger>
            </TabsList>

            <TabsContent value="alerts" className="space-y-4">
              <div className="space-y-4">
                {securityAlerts.map((alert) => (
                  <Card key={alert.id} className="premium-card border-[#FFD700]/20">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <AlertTriangle
                              className={`h-5 w-5 ${
                                alert.severity === "high"
                                  ? "text-red-400"
                                  : alert.severity === "medium"
                                    ? "text-orange-400"
                                    : "text-yellow-400"
                              }`}
                            />
                            <div className="flex space-x-2">
                              {getSeverityBadge(alert.severity)}
                              {getStatusBadge(alert.status)}
                            </div>
                          </div>

                          <h3 className="text-lg font-medium text-white mb-2">{alert.message}</h3>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-white/60">Alert ID</div>
                              <div className="text-white font-mono">{alert.id}</div>
                            </div>
                            <div>
                              <div className="text-white/60">User</div>
                              <div className="text-white">{alert.user}</div>
                            </div>
                            <div>
                              <div className="text-white/60">Location</div>
                              <div className="text-white">{alert.location}</div>
                            </div>
                            <div>
                              <div className="text-white/60">Time</div>
                              <div className="text-white">{alert.timestamp}</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <Button className="btn-gold">
                            <Eye className="h-4 w-4 mr-2" />
                            Investigate
                          </Button>
                          <Button className="btn-dark-gold">
                            <Ban className="h-4 w-4 mr-2" />
                            Block
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="blocked-ips" className="space-y-4">
              <div className="border border-[#FFD700]/20 rounded-lg overflow-hidden">
                <div className="bg-[#FFD700]/10 px-6 py-3 border-b border-[#FFD700]/20">
                  <div className="grid grid-cols-5 gap-4 text-sm font-medium text-white">
                    <span>IP Address</span>
                    <span>Reason</span>
                    <span>Blocked At</span>
                    <span>Attempts</span>
                    <span>Actions</span>
                  </div>
                </div>
                <div className="divide-y divide-[#FFD700]/10">
                  {blockedIPs.map((ip, index) => (
                    <div key={index} className="px-6 py-4 hover:bg-[#FFD700]/5">
                      <div className="grid grid-cols-5 gap-4 items-center">
                        <div className="font-mono text-white">{ip.ip}</div>
                        <div className="text-white">{ip.reason}</div>
                        <div className="text-white">{ip.blockedAt}</div>
                        <div className="text-red-400">{ip.attempts}</div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="btn-dark-gold">
                            Unblock
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="audit-log" className="space-y-4">
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-[#FFD700] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Audit Log</h3>
                <p className="text-white/60">System activity and admin actions log</p>
                <Button className="mt-4 btn-gold">View Full Log</Button>
              </div>
            </TabsContent>

            <TabsContent value="firewall" className="space-y-4">
              <div className="text-center py-8">
                <Lock className="h-12 w-12 text-[#FFD700] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Firewall Configuration</h3>
                <p className="text-white/60">Manage firewall rules and access controls</p>
                <Button className="mt-4 btn-gold">Configure Firewall</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
