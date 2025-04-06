"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useOffers } from "@/app/hooks/use-offers"

// Mettre à jour l'interface Offer pour inclure un tableau de photos
export interface Offer {
  id: number
  title: string
  description: string
  price: number
  category: string
  validated: boolean
  photos?: string[] // Tableau de photos
}

export function OffersDataTable() {
  const router = useRouter()
  const [searchTitle, setSearchTitle] = useState("")
  const [category, setCategory] = useState<string>("all")
  const [validationStatus, setValidationStatus] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [offerToDelete, setOfferToDelete] = useState<number | null>(null)
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null)
  const [columnMenuOpen, setColumnMenuOpen] = useState(false)

  // États pour le carrousel d'images
  const [carouselOpen, setCarouselOpen] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    title: true,
    description: true,
    price: true,
    category: true,
    validated: true,
    actions: true,
  })
  const dropdownRef = useRef<HTMLDivElement>(null)
  const columnMenuRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Réinitialiser la page à 1 lors du changement de filtres
  useEffect(() => {
    setPage(1)
  }, [category, validationStatus])

  // Close dropdowns and carousel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(null)
      }
      if (columnMenuRef.current && !columnMenuRef.current.contains(event.target as Node)) {
        setColumnMenuOpen(false)
      }
      // Ne pas fermer le carrousel en cliquant à l'extérieur car il contient des contrôles de navigation
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Fermer le carrousel avec la touche Escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && carouselOpen) {
        setCarouselOpen(false)
      }

      // Navigation dans le carrousel avec les flèches gauche/droite
      if (carouselOpen && selectedOffer?.photos && selectedOffer.photos.length > 0) {
        if (event.key === "ArrowLeft") {
          navigateCarousel(-1)
        } else if (event.key === "ArrowRight") {
          navigateCarousel(1)
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [carouselOpen, selectedOffer, currentPhotoIndex])

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const { offers, loading, error, mutate } = useOffers({
    page,
    limit,
    category: category !== "all" ? category : undefined,
    validated: validationStatus !== "all" ? validationStatus === "validated" : undefined,
  })

  const showToast = (message: string, type: string) => {
    setToast({ message, type })
  }

  const handleDelete = async (id: number) => {
    setOfferToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!offerToDelete) return

    try {
      const response = await fetch(`/api/offers/${offerToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression")
      }

      showToast("L'offre a été supprimée avec succès", "success")
      mutate() // Refresh data
    } catch {
      showToast("Impossible de supprimer l'offre", "error")
    } finally {
      setDeleteDialogOpen(false)
      setOfferToDelete(null)
    }
  }

  const handleValidate = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/offers/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ validated: !currentStatus }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour")
      }

      showToast(`L'offre a été ${!currentStatus ? "validée" : "invalidée"}`, "success")
      mutate() // Refresh data
    } catch  {
      showToast("Impossible de mettre à jour le statut", "error")
    }
  }

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns({
      ...visibleColumns,
      [column]: !visibleColumns[column],
    })
  }

  // Ouvrir le carrousel d'images
  const openCarousel = (offer: Offer, initialIndex = 0) => {
    setSelectedOffer(offer)
    setCurrentPhotoIndex(initialIndex)
    setCarouselOpen(true)
  }

  // Naviguer dans le carrousel
  const navigateCarousel = (direction: number) => {
    if (!selectedOffer?.photos || selectedOffer.photos.length === 0) return

    const newIndex = currentPhotoIndex + direction
    if (newIndex >= 0 && newIndex < selectedOffer.photos.length) {
      setCurrentPhotoIndex(newIndex)
    } else if (newIndex < 0) {
      // Boucler vers la fin
      setCurrentPhotoIndex(selectedOffer.photos.length - 1)
    } else {
      // Boucler vers le début
      setCurrentPhotoIndex(0)
    }
  }

  // Mémoriser la fonction de filtrage pour éviter des recalculs inutiles
  const getFilteredOffers = useCallback(() => {
    if (!offers) return []

    // Vérifier les doublons (mesure de sécurité supplémentaire)
    const uniqueIds = new Set()
    const uniqueOffers = offers.filter((offer) => {
      if (uniqueIds.has(offer.id)) {
        return false
      }
      uniqueIds.add(offer.id)
      return true
    })

    return uniqueOffers.filter((offer) => offer.title.toLowerCase().includes(searchTitle.toLowerCase()))
  }, [offers, searchTitle])

  const filteredOffers = getFilteredOffers()

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium">Erreur de chargement</h3>
          <p className="text-gray-500">Impossible de charger les offres. Veuillez réessayer.</p>
          <button
            className="mt-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={() => mutate()}
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-md ${
            toast.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          <div className="flex items-center">
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-4 text-gray-500 hover:text-gray-700">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Filters and controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Filtrer par titre..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="all">Toutes les catégories</option>
            <option value="vehicle">Véhicule</option>
            <option value="property">Immobilier</option>
            <option value="service">Service</option>
          </select>

          <select
            value={validationStatus}
            onChange={(e) => setValidationStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="all">Tous les statuts</option>
            <option value="validated">Validé</option>
            <option value="pending">En attente</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/admin/offers/new")}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle offre
          </button>

          <div className="relative" ref={columnMenuRef}>
            <button
              onClick={() => setColumnMenuOpen(!columnMenuOpen)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Colonnes <ChevronDown className="ml-2 h-4 w-4" />
            </button>

            {columnMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="p-2">
                  <div className="text-sm font-medium text-gray-700 mb-2">Afficher les colonnes</div>
                  <div className="space-y-1">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={visibleColumns.id}
                        onChange={() => toggleColumn("id")}
                        className="rounded text-gray-900 focus:ring-gray-400"
                      />
                      <span>ID</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={visibleColumns.title}
                        onChange={() => toggleColumn("title")}
                        className="rounded text-gray-900 focus:ring-gray-400"
                      />
                      <span>Titre</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={visibleColumns.description}
                        onChange={() => toggleColumn("description")}
                        className="rounded text-gray-900 focus:ring-gray-400"
                      />
                      <span>Description</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={visibleColumns.price}
                        onChange={() => toggleColumn("price")}
                        className="rounded text-gray-900 focus:ring-gray-400"
                      />
                      <span>Prix</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={visibleColumns.category}
                        onChange={() => toggleColumn("category")}
                        className="rounded text-gray-900 focus:ring-gray-400"
                      />
                      <span>Catégorie</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={visibleColumns.validated}
                        onChange={() => toggleColumn("validated")}
                        className="rounded text-gray-900 focus:ring-gray-400"
                      />
                      <span>Statut</span>
                    </label>
                    {/* Option pour afficher/masquer la colonne d'image dans le menu des colonnes */}
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled={true}
                        className="rounded text-gray-400 focus:ring-gray-400 cursor-not-allowed"
                      />
                      <span className="text-gray-500">Image (toujours visible)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Debugging info - Optionnel, à supprimer en production */}
      {/* <div className="text-xs text-gray-500 mb-2">
        Nombre d'offres: {filteredOffers.length} | 
        IDs: {filteredOffers.map(o => o.id).join(', ')}
      </div> */}

      {/* Table */}
      <div className="overflow-x-auto rounded-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {visibleColumns.id && (
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
              )}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Image
              </th>
              {visibleColumns.title && (
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button className="flex items-center font-medium">
                    Titre
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </button>
                </th>
              )}
              {visibleColumns.description && (
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
              )}
              {visibleColumns.price && (
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button className="flex items-center font-medium">
                    Prix
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </button>
                </th>
              )}
              {visibleColumns.category && (
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Catégorie
                </th>
              )}
              {visibleColumns.validated && (
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Statut
                </th>
              )}
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {visibleColumns.id && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-16 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  {visibleColumns.title && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                    </td>
                  )}
                  {visibleColumns.description && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
                    </td>
                  )}
                  {visibleColumns.price && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                    </td>
                  )}
                  {visibleColumns.category && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                    </td>
                  )}
                  {visibleColumns.validated && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
                  </td>
                </tr>
              ))
            ) : filteredOffers && filteredOffers.length > 0 ? (
              filteredOffers.map((offer) => (
                <tr key={offer.id} className="hover:bg-gray-50">
                  {visibleColumns.id && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{offer.id}</div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex-shrink-0 h-16 w-16 relative">
                      {offer.photos && offer.photos.length > 0 ? (
                        <button
                          className="h-16 w-16 rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-gray-400"
                          onClick={() => openCarousel(offer, 0)}
                        >
                          <Image
                            className="h-16 w-16 object-cover"
                            src={offer.photos[0] || "/placeholder.svg"}
                            alt={`Image de ${offer.title}`}
                            width={64}
                            height={64}
                            onError={(e) => {
                              // Remplacer par une image par défaut en cas d'erreur
                              e.currentTarget.src = "/placeholder.svg?height=64&width=64"
                              e.currentTarget.onerror = null
                            }}
                          />
                        </button>
                      ) : (
                        <div className="h-16 w-16 rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                      {/* Indicateur de photos multiples */}
                      {offer.photos && offer.photos.length > 1 && (
                        <div className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {offer.photos.length}
                        </div>
                      )}
                    </div>
                  </td>
                  {visibleColumns.title && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{offer.title}</div>
                    </td>
                  )}
                  {visibleColumns.description && (
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-[300px] truncate" title={offer.description}>
                        {offer.description}
                      </div>
                    </td>
                  )}
                  {visibleColumns.price && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{offer.price} €</div>
                    </td>
                  )}
                  {visibleColumns.category && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{offer.category}</div>
                    </td>
                  )}
                  {visibleColumns.validated && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          offer.validated ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {offer.validated ? "Validé" : "En attente"}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative" ref={dropdownOpen === offer.id ? dropdownRef : null}>
                      <button
                        onClick={() => setDropdownOpen(dropdownOpen === offer.id ? null : offer.id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>

                      {dropdownOpen === offer.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                router.push(`/admin/offers/${offer.id}`)
                                setDropdownOpen(null)
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => {
                                handleValidate(offer.id, offer.validated)
                                setDropdownOpen(null)
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {offer.validated ? "Invalider" : "Valider"}
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(offer.id)
                                setDropdownOpen(null)
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  Aucune offre trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-gray-500">
          Affichage des offres {page} à {page * limit}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              if (page > 1) {
                setPage(page - 1)
              }
            }}
            disabled={page === 1 || loading}
            className={`px-3 py-1 border rounded-md ${
              page === 1 || loading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Précédent
          </button>
          <button
            onClick={() => {
              setPage(page + 1)
            }}
            disabled={!offers || offers.length < limit || loading}
            className={`px-3 py-1 border rounded-md ${
              !offers || offers.length < limit || loading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Suivant
          </button>
        </div>
      </div>

      {/* Carrousel modal pour afficher les images en grand */}
      {carouselOpen && selectedOffer && selectedOffer.photos && selectedOffer.photos.length > 0 && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-75 flex items-center justify-center">
          <div
            className="relative max-w-4xl w-full h-full flex flex-col items-center justify-center p-4"
            ref={carouselRef}
          >
            {/* Bouton de fermeture */}
            <button
              onClick={() => setCarouselOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Image principale */}
            <div className="relative w-full h-[70vh] flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={selectedOffer.photos[currentPhotoIndex] || "/placeholder.svg"}
                  alt={`Photo ${currentPhotoIndex + 1} de ${selectedOffer.title}`}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=600&width=800"
                    e.currentTarget.onerror = null
                  }}
                />
              </div>
            </div>

            {/* Contrôles de navigation */}
            <div className="flex items-center justify-between w-full mt-4">
              <button
                onClick={() => navigateCarousel(-1)}
                className="bg-gray-800 bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <div className="text-white text-center">
                <p className="text-lg font-medium">{selectedOffer.title}</p>
                <p className="text-sm">
                  Image {currentPhotoIndex + 1} sur {selectedOffer.photos.length}
                </p>
              </div>

              <button
                onClick={() => navigateCarousel(1)}
                className="bg-gray-800 bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Miniatures des images */}
            {selectedOffer.photos.length > 1 && (
              <div className="flex overflow-x-auto gap-2 mt-4 pb-2 max-w-full">
                {selectedOffer.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`flex-shrink-0 h-16 w-16 rounded-md overflow-hidden border-2 ${
                      currentPhotoIndex === index ? "border-white" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={photo || "/placeholder.svg"}
                      alt={`Miniature ${index + 1}`}
                      width={64}
                      height={64}
                      className="object-cover h-full w-full"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=64&width=64"
                        e.currentTarget.onerror = null
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteDialogOpen && (
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Êtes-vous sûr ?</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Cette action ne peut pas être annulée. Cette offre sera définitivement supprimée de nos
                        serveurs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Supprimer
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteDialogOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

