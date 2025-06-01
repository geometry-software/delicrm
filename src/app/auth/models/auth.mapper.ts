import { getCurrentUnixTime } from "../../shared/utils/format-unix-time"
import { Auth } from "./auth.model"

export const mapAuth = (authId: string, locale: string): Auth => ({
    authId,
    locale,
    createdAt: getCurrentUnixTime(),
    status: 'auth',
    name: null,
    email: null,
    avatar: null,
    address: null,
    phone: null,
    deliveries: [],
    createdByUserName: false
})

export const mapUser = (authId: string, email: string, name: string, avatar: string, locale: string): Auth => ({
    ...mapAuth(authId, locale),
    name,
    email,
    avatar,
    status: 'requested'
})