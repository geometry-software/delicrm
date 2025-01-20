import { Auth } from "../../../auth/models/auth.model"
import { getCurrentUnixTime } from "../../../shared/utils/format-unix-time"
import { User, UserRole } from "../models/user.model"

export const mapAppUser = (auth: Auth, role: UserRole): User => ({
    auth,
    role,
    locale: auth.locale,
    name: auth.name,
    avatar: auth.userRequest.avatar,
    status: auth.status,
    email: auth.userRequest.email,
    createdAt: getCurrentUnixTime(),
})