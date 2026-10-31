"use client"

import { apiClient, ENDPOINTS, extractErrorMessage } from "@/lib/api"
import type { AgentRatingStats, Rating, TicketRatingStatus } from "@/lib/types"
import type { RatingCreateInput } from "@/lib/schemas"

export async function fetchTicketRating(
  ticketId: number,
): Promise<TicketRatingStatus> {
  try {
    const { data } = await apiClient.get<{ data: TicketRatingStatus }>(
      ENDPOINTS.ratings.byTicket(ticketId),
    )
    return data.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to load rating status"))
  }
}

export async function submitRating(
  ticketId: number,
  input: RatingCreateInput,
): Promise<Rating> {
  try {
    const { data } = await apiClient.post<{ data: Rating }>(
      ENDPOINTS.ratings.submit(ticketId),
      input,
    )
    return data.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to submit rating"))
  }
}

export async function fetchAgentRatingStats(
  agentId: number,
): Promise<AgentRatingStats> {
  try {
    const { data } = await apiClient.get<{ data: AgentRatingStats }>(
      ENDPOINTS.ratings.byAgent(agentId),
    )
    return data.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to load agent rating stats"))
  }
}
