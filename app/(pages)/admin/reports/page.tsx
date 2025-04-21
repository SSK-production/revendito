"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CheckCircle, XCircle, Trash2, ShieldAlert, MoreVertical } from "lucide-react"
import { useRef } from "react"

// Types
interface Report {
  id: number
  reason: string
  createdAt: string
  status: string
  vehicleOfferId: number | null
  realEstateOfferId: number | null
  commercialOfferId: number | null
  reporterUserId: string | null
  reporterCompanyId: string | null
  reporterType: string
}

interface ReportGroup {
  groupKey: number
  reports: Report[]
}

interface ApiResponse {
  currentPage: number
  totalPages: number
  totalGroups: number
  groups: ReportGroup[]
}


function getOfferType(report: Report): string {
  if (report.vehicleOfferId) return "Véhicule"
  if (report.realEstateOfferId) return "Immobilier"
  if (report.commercialOfferId) return "Commercial"
  return "Inconnu"
}

function getOfferId(report: Report): number | null {
  return report.vehicleOfferId || report.realEstateOfferId || report.commercialOfferId
}

function getOfferLink(report: Report): string {
  if (report.vehicleOfferId) return `/offer?category=vehicles&offerId=${report.vehicleOfferId}`
  if (report.realEstateOfferId) return `/offer?category=property&offerId=${report.realEstateOfferId}`
  if (report.commercialOfferId) return `/offer?category=commercial&offerId=${report.commercialOfferId}`
  return "#"
}

function getReporterLink(report: Report): string {
  if (report.reporterType === "USER" && report.reporterUserId) {
    return `/profile?user=${report.reporterUserId}&role=user`
    
  }
  if (report.reporterType === "COMPANY" && report.reporterCompanyId) {
    return `/profile?user=${report.reporterCompanyId}&role=company`
  }
  return "#"
}
function translateStatus(status: string): string {
  const statuses: Record<string, string> = {
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
  }
  return statuses[status] || status
}

function getStatusClass(status: string): string {
  switch (status) {
    case "PENDING":
      return "bg-gray-100 text-gray-800"
    case "APPROVED":
      return "bg-green-100 text-green-800"
    case "REJECTED":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function AdminReportsPage() {
  // States
  const [data, setData] = useState<ApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [dialogAction, setDialogAction] = useState<"approve" | "reject" | "delete" | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null)
  const [toast, setToast] = useState<{ visible: boolean; title: string; message: string; type: "success" | "error" }>({
    visible: false,
    title: "",
    message: "",
    type: "success",
  })

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Load data
  useEffect(() => {
    async function fetchReports() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/report?page=${page}`)

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`)
        }

        const responseData = await response.json()
        setData(responseData)
      } catch (err) {
        console.error("Error loading reports:", err)
        setError("Unable to load reports. Please try again later.")
        showToast("Error", "Unable to load reports", "error")
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [page])

  // Afficher un toast
  const showToast = (title: string, message: string, type: "success" | "error") => {
    setToast({ visible: true, title, message, type })
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }))
    }, 3000)
  }

  const openDialog = (report: Report, action: "approve" | "reject" | "delete") => {
    setSelectedReport(report)
    setDialogAction(action)
    setDialogOpen(true)
  }

  const toggleDropdown = (reportId: number) => {
    setDropdownOpen(dropdownOpen === reportId ? null : reportId)
  }

  const handleApproveReport = async (reportId: number) => {
    try {
      // API call to approve the report
      const response = await fetch(`/api/report/approve/?id=${reportId}`, {
        method: "PUT",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Error while approving the report")
      }

      // Update local state
      if (data) {
        setData({
          ...data,
          groups: data.groups.map((group) => ({
            ...group,
            reports: group.reports.map((report) =>
              report.id === reportId ? { ...report, status: "APPROVED" } : report,
            ),
          })),
        })
      }

      showToast("Report Approved", "The report has been successfully approved", "success")
    } catch (error) {
      console.error("Error while approving the report:", error)
      showToast("Error", "Unable to approve the report", "error")
    }
  }

  const handleRejectReport = async (reportId: number) => {
    try {
      // API call to reject the report
      const response = await fetch(`/api/report/reject/?id=${reportId}`, {
        method: "PUT",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Error while rejecting the report")
      }

      // Update local state
      if (data) {
        setData({
          ...data,
          groups: data.groups.map((group) => ({
            ...group,
            reports: group.reports.map((report) =>
              report.id === reportId ? { ...report, status: "REJECTED" } : report,
            ),
          })),
        })
      }

      showToast("Report Rejected", "The report has been successfully rejected", "success")
    } catch (error) {
      console.error("Error while rejecting the report:", error)
      showToast("Error", "Unable to reject the report", "error")
    }
  }

  const handleDeleteReport = async (reportId: number) => {
    try {
      // API call to delete the report
      const response = await fetch(`/api/report/delete/?id=${reportId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Error while deleting the report")
      }

      // Update local state
      if (data) {
        const updatedGroups = data.groups
          .map((group) => ({
            ...group,
            reports: group.reports.filter((report) => report.id !== reportId),
          }))
          .filter((group) => group.reports.length > 0)

        setData({
          ...data,
          groups: updatedGroups,
        })
      }

      showToast("Report Deleted", "The report has been successfully deleted", "success")
    } catch (error) {
      console.error("Error while deleting the report:", error)
      showToast("Error", "Unable to delete the report", "error")
    }
  }

  const handleConfirmAction = () => {
    if (!selectedReport || !dialogAction) return

    switch (dialogAction) {
      case "approve":
        handleApproveReport(selectedReport.id)
        break
      case "reject":
        handleRejectReport(selectedReport.id)
        break
      case "delete":
        handleDeleteReport(selectedReport.id)
        break
    }

    setDialogOpen(false)
  }

  const getDialogContent = () => {
    if (!selectedReport || !dialogAction) return null

    const actionTexts = {
      approve: {
      title: "Approve Report",
      description:
        "Are you sure you want to approve this report? The reported offer may be hidden or deleted.",
      },
      reject: {
      title: "Reject Report",
      description: "Are you sure you want to reject this report? The reported offer will remain visible.",
      },
      delete: {
      title: "Delete Report",
      description: "Are you sure you want to delete this report? This action is irreversible.",
      },
    }

    return {
      title: actionTexts[dialogAction].title,
      description: actionTexts[dialogAction].description,
    }
  }

  const dialogContent = getDialogContent()
  // Loading display
  if (isLoading && !data) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Report Management</h1>
        <div className="text-center py-12">
          <p className="text-gray-500">Loading reports...</p>
        </div>
      </div>
    )
  }

  // Error display
  if (error && !data) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Report Management</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => setPage(1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
      <ShieldAlert className="h-8 w-8 text-blue-600" />
      <div>
        <h1 className="text-3xl font-bold">Report Management</h1>
        <p className="text-gray-500">Review and process reports submitted by users</p>
      </div>
      </div>

      {/* Toast notification */}
      {toast.visible && (
      <div
        className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
        toast.type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
        }`}
      >
        <div className="flex items-start">
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${toast.type === "success" ? "text-green-800" : "text-red-800"}`}>
          {toast.title}
          </h3>
          <div className={`mt-1 text-sm ${toast.type === "success" ? "text-green-700" : "text-red-700"}`}>
          {toast.message}
          </div>
        </div>
        </div>
      </div>
      )}

      {/* Main content */}
      {data && data.groups.length === 0 ? (
      <div className="bg-white shadow rounded-lg">
        <div className="text-center py-12">
        <p className="text-gray-500">No reports to process</p>
        </div>
      </div>
      ) : (
      <div className="grid gap-6">
        {data &&
        data.groups.map((group) => (
          <div key={group.groupKey} className="bg-white shadow rounded-lg overflow-hidden">
          {/* Group header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold">Report Group #{group.groupKey}</h2>
            <p className="text-sm text-gray-500">
            {group.reports.length} report{group.reports.length !== 1 ? "s" : ""} for the same offer
            </p>
          </div>

          {/* Reports table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Reason
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Reported Offer
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Reported By
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {group.reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                {report.reason}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <Link href={getOfferLink(report)} className="text-blue-600 hover:underline">
                  {getOfferType(report)} #{getOfferId(report)}
                </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <Link href={getReporterLink(report)} className="text-blue-600 hover:underline">
                  <div className="flex flex-col">
                  <span className="text-xs text-gray-500">
                    {report.reporterType === "USER" ? "User" : "Company"}
                  </span>
                  <span
                    className="truncate max-w-[120px]"
                    title={report.reporterUserId || report.reporterCompanyId || ""}
                  >
                    {report.reporterUserId || report.reporterCompanyId || "Unknown"}
                  </span>
                  </div>
                </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(report.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(report.status)}`}
                >
                  {translateStatus(report.status)}
                </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {report.status === "PENDING" ? (
                  <div className="flex items-center gap-2">
                  <button
                    onClick={() => openDialog(report, "approve")}
                    title="Approve"
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </button>
                  <button
                    onClick={() => openDialog(report, "reject")}
                    title="Reject"
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <XCircle className="h-5 w-5 text-red-500" />
                  </button>
                  <div className="relative">
                    <button
                    onClick={() => {
                      openDialog(report, "delete")
                    }}
                    className="p-1 rounded-full hover:bg-gray-100"
                    title="Delete"
                    >
                    <Trash2 className="h-5 w-5 text-orange-600" />
                    </button>
                  </div>
                  </div>
                ) : (
                  <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => toggleDropdown(report.id)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <MoreVertical className="h-5 w-5 text-gray-400" />
                  </button>
                  {dropdownOpen === report.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="py-1">
                      <button
                      onClick={() => {
                        setDropdownOpen(null)
                        openDialog(report, "delete")
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                      Delete
                      </button>
                    </div>
                    </div>
                  )}
                  </div>
                )}
                </td>
              </tr>
              ))}
            </tbody>
            </table>
          </div>
          </div>
        ))}
      </div>
      )}

      {/* Confirmation Modal */}
      {dialogOpen && (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{dialogContent?.title}</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">{dialogContent?.description}</p>
            </div>
            </div>
          </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            onClick={handleConfirmAction}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={() => setDialogOpen(false)}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
          </div>
        </div>
        </div>
      </div>
      )}

      {/* Pagination */}
      {data && (
      <div className="flex justify-between items-center mt-6">
        <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={data.currentPage <= 1}
        className={`px-4 py-2 rounded-md text-sm font-medium ${
          data.currentPage <= 1
          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
        >
        Previous
        </button>
        <span className="text-sm text-gray-500">
        Page {data.currentPage} of {data.totalPages}
        </span>
        <button
        onClick={() => setPage((prev) => prev + 1)}
        disabled={data.currentPage >= data.totalPages}
        className={`px-4 py-2 rounded-md text-sm font-medium ${
          data.currentPage >= data.totalPages
          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
        >
        Next
        </button>
      </div>
      )}
    </div>
  )
}
