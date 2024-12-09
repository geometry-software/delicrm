import { Auth } from "../../../auth/models/auth.model"
import { getCurrentUnixTime } from "../../../shared/utils/format-unix-time"
import { User, UserRole } from "./user.model"

export const mapAppUser = (auth: Auth, role: UserRole): User => ({
    auth,
    role,
    name: auth.displayName,
    createdAt: getCurrentUnixTime,
    locale: '',
    status: auth.status
})