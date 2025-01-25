import { getCurrentUnixTime } from "../../shared/utils/format-unix-time"
import { Auth } from "./auth.model"
import { AuthConstants } from "./auth.constants"

export const mapAuth = (authId: string): Auth => ({
    authId,
    createdAt: getCurrentUnixTime(),
    locale: AuthConstants.defaultLocale,
    status: 'auth',
    name: null,
    email: null,
    avatar: null,
    address: null,
    phone: null,
    deliveries: []
})

export const mapRequested = (authId: string, email: string, name: string, avatar: string, locale: string): Auth => ({
    ...mapAuth(authId),
    status: 'requested',
    name,
    email,
    locale,
    avatar
})