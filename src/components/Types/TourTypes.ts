// schema.ts
import { z } from "zod"

export const tourFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  hobbies: z.array(z.string()).min(1, "At least one hobby is required"),
})

export type TourFormData = z.infer<typeof tourFormSchema>
