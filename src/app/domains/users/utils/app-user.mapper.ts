import { Auth } from "../../../auth/models/auth.model"
import { getCurrentUnixTime } from "../../../shared/utils/format-unix-time"
import { User, UserRole } from "../models/user.model"

export const mapAppUser = (auth: Auth, role: UserRole): User => ({
    auth,
    role,
    locale: auth.extra.locale,
    name: auth.extra.name,
    avatar: auth.extra.avatar,
    status: auth.status,
    email: auth.extra.email,
    createdAt: getCurrentUnixTime(),
})