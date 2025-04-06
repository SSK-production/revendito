"use client"

import { useState, useEffect } from "react"
import type { Offer } from "../components/admin/offers-data-table"

interface UseOffersProps {
  page?: number
  limit?: number
  category?: string
  validated?: boolean
}

export function useOffers({ page = 1, limit = 10, category, validated }: UseOffersProps = {}) {
  const [offers, setOffers] = useState<Offer[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [queryParams, setQueryParams] = useState<string>("")

  useEffect(() => {
    const params = new URLSearchParams()
    params.append("page", page.toString())
    params.append("limit", limit.toString())

    if (category) {
      params.append("category", category)
    }

    if (validated !== undefined) {
      params.append("validated", validated.toString())
    }

    setQueryParams(params.toString())
  }, [page, limit, category, validated])

  useEffect(() => {
    if (!queryParams) return

    const fetchOffers = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/allOffers?${queryParams}`)
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des offres")
        }
        const data = await response.json()
        setOffers(data)
        setError(null)
        console.log("Fetched offers:", data);
        
      } catch (error) {
        setError(error instanceof Error ? error : new Error("Une erreur est survenue"))
        setOffers(null)
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()
  }, [queryParams])

  const mutate = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/offers?${queryParams}`)
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des offres")
      }
      const data = await response.json()
      setOffers(data)
      setError(null)
    } catch (error) {
      setError(error instanceof Error ? error : new Error("Une erreur est survenue"))
    } finally {
      setLoading(false)
    }
  }

  return {
    offers,
    loading,
    error,
    mutate,
  }
}

