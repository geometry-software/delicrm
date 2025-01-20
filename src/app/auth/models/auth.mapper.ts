import { deleteField } from "firebase/firestore"
import { getCurrentUnixTime } from "../../shared/utils/format-unix-time"
import { Auth, UserRequest } from "./auth.model"
import { AuthConstants } from "./auth.constants"

export const setRestaurantAuth = () => ({
    createdAt: new Date(),
    displayName: deleteField(),
    authId: deleteField(),
    providerId: deleteField(),
    status: deleteField(),
    avatar: deleteField(),
})

export const mapAuth = (user, userRequest: UserRequest = null): Auth => ({
    authId: user.uid,
    createdAt: getCurrentUnixTime(),
    providerId: 'anonymous',
    status: 'requested',
    name: null,
    authDelivery: {
        phone: '',
        address: ''
    },
    locale: AuthConstants.defaultLocale,
    userRequest
})

export const mapUserRequest = (user): UserRequest => ({
    email: user.email,
    avatar: user.photoURL
})
