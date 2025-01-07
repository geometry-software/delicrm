import { AuthStatus } from "../../../auth/models/auth.model"

export interface ClientStatusResponse {
  requested: number
  active: number
  blocked: number
}

export const clientsTabIndexByStatus: Record<AuthStatus, number> = {
  active: 0,
  requested: 1,
  blocked: 2
}