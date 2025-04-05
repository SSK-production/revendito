"use client"
import type React from "react"
import { Users, ShoppingBag, Settings, BarChart3, ArrowRight, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

const AdminHomePage: React.FC = () => {
    const [totalUserAndCompanyCount, setTotalUserAndCompanyCount] = useState<number>(0)
    const [pendingReportCount, setPendingReportCount] = useState<number>(0)
    const [offerCount, setOfferCount] = useState<number>(0)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch("/api/stats", {
                    method: "GET",
                    credentials: "include", // Inclure les cookies
                })
                if (!response.ok) {
                    throw new Error("Network response was not ok")
                }
                const data = await response.json()
                if (data.success) {
                    setTotalUserAndCompanyCount(data.data.totalUserAndCompanyCount)
                    setPendingReportCount(data.data.pendingReportCount)
                    setOfferCount(data.data.offerCount)
                } else {
                    console.error("Failed to fetch stats:", data.message)
                }
            } catch (error) {
                console.error("Error fetching stats:", error)
            }
        }
        fetchStats()
    }, []);
    
    // Sample data for statistics - replace with real data in production
    const stats = [
        {
            title: "Total Users",
            value: totalUserAndCompanyCount,
            icon: <Users className="h-8 w-8 text-blue-500" />,
        },
        {
            title: "Active Offers",
            value: offerCount,
            icon: <ShoppingBag className="h-8 w-8 text-green-500" />,
        },
        {
            title: "Pending Reports",
            value: pendingReportCount,
            icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
        },
    ]

    // Quick action cards
    const actions = [
        {
            title: "Manage Users",
            description: "View, edit, and manage user accounts and permissions",
            icon: <Users className="h-6 w-6" />,
            href: "/admin/users",
            color: "bg-blue-50 text-blue-700 border-blue-200",
        },
        {
            title: "Manage Offers",
            description: "Review, approve, and moderate all platform offers",
            icon: <ShoppingBag className="h-6 w-6" />,
            href: "/admin/offers",
            color: "bg-green-50 text-green-700 border-green-200",
        },
        {
            title: "Application Settings",
            description: "Configure system settings and application parameters",
            icon: <Settings className="h-6 w-6" />,
            href: "/admin/settings",
            color: "bg-purple-50 text-purple-700 border-purple-200",
        },
        {
            title: "View Reports",
            description: "Access analytics, statistics and generate reports",
            icon: <BarChart3 className="h-6 w-6" />,
            href: "/admin/reports",
            color: "bg-amber-50 text-amber-700 border-amber-200",
        },
    ]

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="mt-2 text-lg text-gray-600">Welcome back! Here's an overview of your platform.</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                    <p className="text-2xl font-bold mt-1 text-gray-900">{stat.value}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-gray-50">{stat.icon}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {actions.map((action, index) => (
                        <Link
                            href={action.href}
                            key={index}
                            className={`block rounded-xl border p-6 ${action.color} transition-all duration-200 hover:shadow-md group`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-white/60 backdrop-blur-sm">{action.icon}</div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg flex items-center">
                                        {action.title}
                                        <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                                    </h3>
                                    <p className="mt-1 text-sm opacity-90">{action.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AdminHomePage
