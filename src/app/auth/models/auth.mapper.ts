import { deleteField } from "firebase/firestore"
import { getCurrentUnixTime } from "../../shared/utils/format-unix-time"
import { Auth, ExtraData } from "./auth.model"
import { AuthConstants } from "./auth.constants"

export const setRestaurantAuth = () => ({
    createdAt: new Date(),
    displayName: deleteField(),
    authId: deleteField(),
    providerId: deleteField(),
    status: deleteField(),
    avatar: deleteField(),
})

export const mapAuth = (user, extra: ExtraData = null): Auth => ({
    authId: user.uid,
    createdAt: getCurrentUnixTime(),
    providerId: 'anonymous',
    status: 'requested',
    name: null,
    deliveryInfo: {
        phone: '',
        address: ''
    },
    extra
})

export const mapExtraData = (user): ExtraData => ({
    email: user.email,
    avatar: user.photoURL,
    locale: AuthConstants.defaultLocale
})
