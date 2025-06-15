"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, DollarSign, TrendingUp, AlertTriangle, Activity, CreditCard, Shield, Globe } from "lucide-react"

const systemStats = [
  { title: "Total Users", value: "12,847", change: "+12%", icon: Users, color: "text-blue-400" },
  { title: "Daily Volume", value: "$2.4M", change: "+8.2%", icon: DollarSign, color: "text-green-400" },
  { title: "Active Trades", value: "1,234", change: "+15%", icon: TrendingUp, color: "text-[#FFD700]" },
  { title: "Pending KYC", value: "15", change: "-5%", icon: Shield, color: "text-orange-400" },
]

const recentActivities = [
  { type: "user", message: "New user registration: user@example.com", time: "2 minutes ago", severity: "info" },
  { type: "security", message: "Failed login attempt detected", time: "5 minutes ago", severity: "warning" },
  { type: "transaction", message: "Large withdrawal: $50,000 BTC", time: "10 minutes ago", severity: "info" },
  { type: "kyc", message: "KYC verification completed", time: "15 minutes ago", severity: "success" },
  { type: "system", message: "System backup completed", time: "1 hour ago", severity: "success" },
]

const criticalAlerts = [
  { title: "High Volume Alert", message: "Trading volume 300% above average", severity: "warning" },
  { title: "Security Alert", message: "Multiple failed login attempts", severity: "error" },
  { title: "System Alert", message: "Database connection latency high", severity: "warning" },
]

export function AdminOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="premium-card border-[#FFD700]/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className={`text-xs ${stat.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* System Status */}
        <Card className="premium-card border-[#FFD700]/20">
          <CardHeader>
            <CardTitle className="text-[#FFD700] flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">Trading Engine</span>
              <Badge className="bg-green-600 text-white">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Payment Gateway</span>
              <Badge className="bg-green-600 text-white">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">KYC Service</span>
              <Badge className="bg-green-600 text-white">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Email Service</span>
              <Badge className="bg-yellow-600 text-white">Degraded</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Database</span>
              <Badge className="bg-green-600 text-white">Online</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Critical Alerts */}
        <Card className="premium-card border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {criticalAlerts.map((alert, index) => (
              <div key={index} className="p-3 border border-red-500/20 rounded-lg bg-red-900/10">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-white text-sm">{alert.title}</div>
                    <div className="text-xs text-white/70">{alert.message}</div>
                  </div>
                  <Badge variant="destructive" className={alert.severity === "error" ? "bg-red-600" : "bg-orange-600"}>
                    {alert.severity}
                  </Badge>
                </div>
              </div>
            ))}
            <Button className="w-full btn-dark-gold text-sm">View All Alerts</Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="premium-card border-[#FFD700]/20">
          <CardHeader>
            <CardTitle className="text-[#FFD700]">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full btn-gold justify-start">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button className="w-full btn-dark-gold justify-start">
              <CreditCard className="h-4 w-4 mr-2" />
              Review Transactions
            </Button>
            <Button className="w-full btn-dark-gold justify-start">
              <Shield className="h-4 w-4 mr-2" />
              KYC Approvals
            </Button>
            <Button className="w-full btn-dark-gold justify-start">
              <Globe className="h-4 w-4 mr-2" />
              System Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="premium-card border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-[#FFD700]">Recent Activities</CardTitle>
          <CardDescription className="text-white/70">Latest system events and user activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-[#FFD700]/10 rounded-lg bg-black/30"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.severity === "success"
                        ? "bg-green-400"
                        : activity.severity === "warning"
                          ? "bg-orange-400"
                          : activity.severity === "error"
                            ? "bg-red-400"
                            : "bg-blue-400"
                    }`}
                  />
                  <div>
                    <div className="text-white text-sm">{activity.message}</div>
                    <div className="text-white/60 text-xs">{activity.time}</div>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={`text-xs ${
                    activity.severity === "success"
                      ? "bg-green-600 text-white"
                      : activity.severity === "warning"
                        ? "bg-orange-600 text-white"
                        : activity.severity === "error"
                          ? "bg-red-600 text-white"
                          : "bg-blue-600 text-white"
                  }`}
                >
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
