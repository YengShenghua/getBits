import { CheckCircle, Clock, AlertTriangle, XCircle, Loader2 } from "lucide-react"

type TransactionStatusProps = {
  status: "completed" | "pending" | "processing" | "failed" | "waiting" | "rejected"
}

export function TransactionStatus({ status }: TransactionStatusProps) {
  const getStatusUI = () => {
    switch (status) {
      case "completed":
        return (
          <div className="flex items-center justify-center space-x-2 text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Completed</span>
          </div>
        )
      case "pending":
        return (
          <div className="flex items-center justify-center space-x-2 text-orange-400">
            <Clock className="h-5 w-5" />
            <span className="font-medium">Pending Approval</span>
          </div>
        )
      case "processing":
        return (
          <div className="flex items-center justify-center space-x-2 text-blue-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="font-medium">Processing</span>
          </div>
        )
      case "waiting":
        return (
          <div className="flex items-center justify-center space-x-2 text-[#FFD700]">
            <Clock className="h-5 w-5" />
            <span className="font-medium">Waiting for Deposit</span>
          </div>
        )
      case "failed":
        return (
          <div className="flex items-center justify-center space-x-2 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Failed</span>
          </div>
        )
      case "rejected":
        return (
          <div className="flex items-center justify-center space-x-2 text-red-400">
            <XCircle className="h-5 w-5" />
            <span className="font-medium">Rejected</span>
          </div>
        )
      default:
        return null
    }
  }

  return <div className="p-3 bg-black/50 border border-[#FFD700]/20 rounded-lg">{getStatusUI()}</div>
}
