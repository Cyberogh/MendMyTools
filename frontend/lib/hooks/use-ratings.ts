"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  fetchAgentRatingStats,
  fetchTicketRating,
  submitRating,
} from "@/lib/services/rating.service"
import type { RatingCreateInput } from "@/lib/schemas"

const ratingKey = (ticketId: number) => ["rating", ticketId] as const
const agentRatingKey = (agentId: number | null) =>
  ["rating", "agent", agentId] as const

export function useTicketRating(ticketId: number, enabled = true) {
  return useQuery({
    queryKey: ratingKey(ticketId),
    queryFn: () => fetchTicketRating(ticketId),
    enabled: enabled && Number.isFinite(ticketId) && ticketId > 0,
  })
}

export function useSubmitRating(ticketId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: RatingCreateInput) => submitRating(ticketId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ratingKey(ticketId) })
      qc.invalidateQueries({ queryKey: ["tickets", ticketId] })
      qc.invalidateQueries({ queryKey: ["tickets"] })
    },
  })
}

export function useAgentRatingStats(agentId: number | null, enabled = true) {
  return useQuery({
    queryKey: agentRatingKey(agentId),
    queryFn: () => fetchAgentRatingStats(agentId as number),
    enabled: enabled && agentId !== null && Number.isFinite(agentId) && agentId > 0,
  })
}
