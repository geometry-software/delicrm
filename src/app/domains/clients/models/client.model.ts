import { AuthStatus } from "../../../auth/models/auth.model"

export const clientsTabIndexByStatus: Record<ClientStatus, number> = {
  active: 0,
  auth: 1,
  blocked: 2
}

export type ClientStatus = 'auth' | 'active' | 'blocked'