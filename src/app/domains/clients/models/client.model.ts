import { AuthStatus } from "../../../auth/models/auth.model"

export const clientsTabIndexByStatus: Record<AuthStatus, number> = {
  auth: 0,
  requested: 1,
  active: 2,
  blocked: 3
}