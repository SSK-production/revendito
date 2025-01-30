"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Car, Building, Briefcase } from "lucide-react"

const categories = [
  { name: "Vehicle", icon: Car, href: "/offers/vehicle", color: "blue" },
  { name: "Property", icon: Building, href: "/offers/property", color: "green" },
  { name: "Commercial", icon: Briefcase, href: "/offers/commercial", color: "orange" },
]

export default function CategorieLink() {
  const { category } = useParams()

  return (
    <section className="fixed top-12  z-40  bg-gray-50 ">
      <div className="max-w-3xl mx-auto px-4 py-2">
        <div className="flex justify-center gap-2">
          {categories.map((item) => (
            <Link key={item.name} href={item.href} className="flex-1">
              <div
                className={`
                  flex items-center gap-2 px-4 py-1 rounded-md transition-all duration-200
                  hover:bg-gray-100
                  ${category === item.name.toLowerCase() ? `bg-${item.color}-50 text-${item.color}-600` : "text-gray-600"}
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-s font-medium">{item.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

