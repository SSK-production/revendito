"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Search, Users, AlertCircle, Loader2 } from "lucide-react"
import Modal from "@/app/components/profile/Modal"
import BanUserForm from "@/app/components/shared/BanUserForm"
import axios from "axios"
import { useNotifications } from "@/components/notifications"
interface User {
  id: string
  username: string
  companyName: string
  email: string
  role: string
  isBanned: boolean
  banReason: string[]
  bannTitle: string[]
  banEndDate: string | null
  vehicleOfferCount: number
  realEstateOfferCount: number
  commercialOfferCount: number
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalEntities: number
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [noUsers, setNoUsers] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [bannedUser, setBannedUser] = useState<boolean | null>(false)
  const [userBanData, setUserBanData] = useState<User | null>(null)
  const { NotificationsComponent, addNotification } = useNotifications();
  

  // Pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 0,
    totalEntities: 0,
  })
  const itemsPerPage = 10

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/user?page=${pagination.currentPage}&limit=${itemsPerPage}&name=${searchTerm}`)

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()

      if (!data.users || !Array.isArray(data.users)) {
        throw new Error("Invalid data format: expected an array of users")
      }

      setUsers(data.users)
      setPagination({
        currentPage: data.pagination.currentPage || pagination.currentPage,
        totalPages: data.pagination.totalPages || 0,
        totalEntities: data.pagination.totalEntities || 0,
      })
      setNoUsers(data.users.length === 0)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unknown error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [pagination.currentPage, searchTerm])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/user/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        throw new Error("Failed to update user role")
      }

      // Update the user in the local state
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
    } catch (error) {
      console.error("Error updating role:", error)
    } finally {
      setIsSubmitting(false)
    }
  }


  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }))
  }

  const renderPagination = () => {
    const { currentPage, totalPages } = pagination

    // Calculate which page numbers to show
    let pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are fewer than maxVisiblePages
      pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    } else {
      // Always include first page, last page, current page, and pages adjacent to current
     
      const lastPage = totalPages

      if (currentPage <= 3) {
        // Near the start
        pages = [1, 2, 3, 4, 5, "...", lastPage]
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages = [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
      } else {
        // Somewhere in the middle
        pages = [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", lastPage]
      }
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-4">
        <button
          className={`w-24 px-3 py-1 text-sm rounded-md border ${
            currentPage === 1 || loading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
        >
          Previous
        </button>

        {pages.map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              className={`w-10 px-3 py-1 text-sm rounded-md ${
                currentPage === page ? "bg-blue-500 text-white" : "bg-white text-gray-700 border hover:bg-gray-50"
              }`}
              onClick={() => handlePageChange(page)}
              disabled={loading}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-2">
              {page}
            </span>
          ),
        )}

        <button
          className={`w-24 px-3 py-1 text-sm rounded-md border ${
            currentPage === totalPages || loading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
        >
          Next
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <NotificationsComponent />
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">User Management</h2>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border">
            <Users className="h-4 w-4" />
            {pagination.totalEntities} Users
          </span>
        </div>
        <div className="p-4">
          <div className="flex items-center mb-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by username..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8 text-red-500">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          ) : noUsers ? (
            <div className="text-center text-gray-500 py-8">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                    <th className="p-2">Username/CompanyName</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">Status</th>
                    <th className="p-2 text-center">Vehicle</th>
                    <th className="p-2 text-center">Real Estate</th>
                    <th className="p-2 text-center">Commercial</th>
                    <th className="p-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="p-2 font-medium text-gray-900 max-w-[120px] truncate">{user.username ? user.username : user.companyName}</td>
                      <td className="p-2 text-gray-500 max-w-[150px] truncate">{user.email}</td>
                      <td className="p-2 text-gray-500">
                        <select
                          className="w-[100px] pl-2 pr-6 py-1 text-sm border-gray-300 rounded-md"
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={isSubmitting}
                        >
                          <option value="USER">User</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isBanned ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.isBanned ? "Banned" : "Active"}
                        </span>
                      </td>
                      <td className="p-2 text-center text-gray-500">{user.vehicleOfferCount}</td>
                      <td className="p-2 text-center text-gray-500">{user.realEstateOfferCount}</td>
                      <td className="p-2 text-center text-gray-500">{user.commercialOfferCount}</td>
                      <td className="p-2 text-right">
                        <button
                          className={`w-24 px-3 py-1 text-sm rounded-md ${
                          user.isBanned
                            ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                            : "bg-red-500 text-white hover:bg-red-600"
                          }`}
                          onClick={() => {
                          setShowModal(true);
                          setBannedUser(user.isBanned ? true : false);
                          setUserBanData(user);
                          console.log(user);
                          
                          }}
                          disabled={isSubmitting}
                        >
                          {user.isBanned ? "Unban" : "Ban"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
          )}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Ban User">
            <BanUserForm
              initialData={{
              id: userBanData?.id || "",
              username: userBanData?.username || userBanData?.companyName || "",
              type: userBanData?.role || "",
              bannTitle: "",
              reason: "",
              duration: "",
              isBanned: userBanData?.isBanned || false,
              }}
              onSave={async (updateData) => {
              try {
                const payload = {
                id: updateData.id,
                username: updateData.username,
                type: updateData.type.toLowerCase(),
                bannTitle: [updateData.bannTitle],
                reason: [updateData.reason],
                duration: parseInt(updateData.duration, 10),
                banned: bannedUser,
                };
                console.log("Payload to send:", payload);
                
                const response = await axios.patch("/api/bans", payload);
                if (response.status === 200) {
                  console.log("Response from server:", response.data);
                  addNotification({
                  message: "User banned successfully",
                  variant: "success",
                  duration: 7000,
                  });
                  setShowModal(false);
                  fetchUsers();
                } else {
                console.error("Failed to ban user");
                }
              } catch (error:unknown) {
                const errorMessage =
                  axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : "Error banning user";

                addNotification({
                  message: errorMessage,
                  variant: "error",
                  duration: 7000,
                });
                setShowModal(false);
                console.error("Error banning user:", error);
              }
              }}
              onCancel={() => setShowModal(false)}
              onUnban={ async () => {
                try {
                  const payload = {
                  id: userBanData?.id,
                  username: userBanData?.username || userBanData?.companyName || "",
                  type: userBanData?.role.toLowerCase() || "",
                  banned: bannedUser,
                  };
    
                  const response = await axios.patch("/api/bans", payload);
                  console.log("Response from server:", response.data);
    
                  addNotification({
                  message: response.data.message,
                  variant: "success",
                  duration: 7000,
                  });
                   // Close the modal after success
                  
                    setShowModal(false);
                    fetchUsers();
                  
                } catch (error) {
                  console.error("Error while unbanning the user:", error);
                  addNotification({
                  message: "An error occurred while unbanning the user. Please try again.",
                  variant: "error",
                  duration: 7000,
                  });
                }
              }}
            />
            </Modal>
            


          {!loading && !error && !noUsers && renderPagination()}
        </div>
      </div>
    </div>
  )
}

