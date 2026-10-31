import { z } from "zod"

export const RATING_VALUES = [1, 2, 3, 4, 5] as const
export type RatingValue = (typeof RATING_VALUES)[number]

export const ratingCreateSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Please pick a rating from 1 to 5 stars.")
    .max(5, "Rating cannot exceed 5 stars."),
  feedback: z
    .string()
    .max(4000, "Feedback is too long")
    .optional(),
})

export type RatingCreateInput = z.infer<typeof ratingCreateSchema>
