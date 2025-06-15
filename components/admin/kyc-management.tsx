"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Clock, Eye, Download, FileText } from "lucide-react"

const mockKYCApplications = [
  {
    id: "KYC001",
    user: "john.doe@example.com",
    name: "John Doe",
    country: "USA",
    documentType: "Passport",
    submittedAt: "2024-01-20 10:30:00",
    status: "pending",
    riskScore: "low",
    documents: ["passport_front.jpg", "passport_back.jpg", "selfie.jpg"],
    notes: "",
  },
  {
    id: "KYC002",
    user: "jane.smith@example.com",
    name: "Jane Smith",
    country: "UK",
    documentType: "Driver's License",
    submittedAt: "2024-01-19 15:45:00",
    status: "under_review",
    riskScore: "medium",
    documents: ["license_front.jpg", "license_back.jpg", "selfie.jpg"],
    notes: "Additional verification required",
  },
  {
    id: "KYC003",
    user: "mike.wilson@example.com",
    name: "Mike Wilson",
    country: "Canada",
    documentType: "National ID",
    submittedAt: "2024-01-18 09:15:00",
    status: "approved",
    riskScore: "low",
    documents: ["id_front.jpg", "id_back.jpg", "selfie.jpg"],
    notes: "Approved after manual review",
  },
]

export function KYCManagement() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-600 text-white">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-600 text-white">Rejected</Badge>
      case "pending":
        return <Badge className="bg-orange-600 text-white">Pending</Badge>
      case "under_review":
        return <Badge className="bg-blue-600 text-white">Under Review</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
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
          <CardTitle className="text-[#FFD700]">KYC Management</CardTitle>
          <CardDescription className="text-white/70">
            Review and manage user identity verification applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="bg-black/50 border border-[#FFD700]/20">
              <TabsTrigger
                value="pending"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Pending Review
              </TabsTrigger>
              <TabsTrigger
                value="under-review"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Under Review
              </TabsTrigger>
              <TabsTrigger
                value="approved"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Approved
              </TabsTrigger>
              <TabsTrigger
                value="rejected"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Rejected
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {/* KYC Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="premium-card border-[#FFD700]/20">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-orange-400">15</div>
                    <div className="text-sm text-white/60">Pending Review</div>
                  </CardContent>
                </Card>
                <Card className="premium-card border-[#FFD700]/20">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-400">8</div>
                    <div className="text-sm text-white/60">Under Review</div>
                  </CardContent>
                </Card>
                <Card className="premium-card border-[#FFD700]/20">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-400">1,247</div>
                    <div className="text-sm text-white/60">Approved</div>
                  </CardContent>
                </Card>
                <Card className="premium-card border-[#FFD700]/20">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-red-400">23</div>
                    <div className="text-sm text-white/60">Rejected</div>
                  </CardContent>
                </Card>
              </div>

              {/* KYC Applications */}
              <div className="space-y-4">
                {mockKYCApplications
                  .filter((app) => app.status === "pending")
                  .map((application) => (
                    <Card key={application.id} className="premium-card border-[#FFD700]/20">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-4">
                              <div>
                                <h3 className="text-lg font-medium text-white">{application.name}</h3>
                                <p className="text-white/60">{application.user}</p>
                              </div>
                              <div className="flex space-x-2">
                                {getStatusBadge(application.status)}
                                {getRiskBadge(application.riskScore)}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <div className="text-sm text-white/60">Country</div>
                                <div className="text-white">{application.country}</div>
                              </div>
                              <div>
                                <div className="text-sm text-white/60">Document Type</div>
                                <div className="text-white">{application.documentType}</div>
                              </div>
                              <div>
                                <div className="text-sm text-white/60">Submitted</div>
                                <div className="text-white">{application.submittedAt}</div>
                              </div>
                              <div>
                                <div className="text-sm text-white/60">Documents</div>
                                <div className="text-white">{application.documents.length} files</div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {application.documents.map((doc, index) => (
                                <Badge key={index} variant="outline" className="border-[#FFD700]/30 text-white">
                                  <FileText className="h-3 w-3 mr-1" />
                                  {doc}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col space-y-2 ml-4">
                            <Button className="btn-gold">
                              <Eye className="h-4 w-4 mr-2" />
                              Review
                            </Button>
                            <Button className="btn-dark-gold">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="under-review" className="space-y-4">
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Under Review</h3>
                <p className="text-white/60">8 applications currently being reviewed</p>
                <Button className="mt-4 btn-gold">Continue Reviews</Button>
              </div>
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Approved Applications</h3>
                <p className="text-white/60">1,247 users have been verified</p>
                <Button className="mt-4 btn-gold">View Approved</Button>
              </div>
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              <div className="text-center py-8">
                <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Rejected Applications</h3>
                <p className="text-white/60">23 applications have been rejected</p>
                <Button className="mt-4 btn-gold">Review Rejections</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
