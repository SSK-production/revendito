import type { Metadata } from "next"
import { OffersDataTable } from "@/app/components/admin/offers-data-table"
export const metadata: Metadata = {
  title: "Gestion des Offres | Admin",
  description: "Gérez les offres de votre plateforme",
}

export default function AdminOffersPage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Gérer les Offres</h1>
      <OffersDataTable />
    </div>
  )
}

