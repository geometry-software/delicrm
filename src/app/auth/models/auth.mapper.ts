import { getCurrentUnixTime } from "../../shared/utils/format-unix-time"
import { Auth } from "./auth.model"
import { AuthConstants } from "./auth.constants"

export const mapAuth = (authId: string): Auth => ({
    authId,
    createdAt: getCurrentUnixTime(),
    locale: AuthConstants.defaultLocale,
    status: 'auth',
    name: null,
    phone: null,
    address: null,
    email: null,
    avatar: null,
    deliveries: []
})

export const mapRequested = (authId: string, locale: string, avatar: string): Auth => ({
    ...mapAuth(authId),
    status: 'requested',
    locale,
    avatar
})