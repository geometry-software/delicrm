import { AuthUser } from "../../../auth/models/auth.model"
import { getCurrentUnixTime } from "../../../shared/utils/format-unix-time"
import { AppUser, UserRole } from "./user.model"

export const mapAppUser = (auth: AuthUser, role: UserRole): AppUser => ({
    auth,
    role,
    name: auth.displayName,
    createdAt: getCurrentUnixTime,
    locale: ''
})