import { deleteField } from "firebase/firestore";
import { getCurrentUnixTime } from "../../shared/utils/format-unix-time";
import { AuthConstants } from "./auth.constants";
import { AuthUser } from "./auth.model";

export const mapAuthAdmin = (user, name): AuthUser => ({
    displayName: name,
    email: user.email,
    createdAt: getCurrentUnixTime,
    authId: user.uid,
    providerId: 'firebase',
    status: 'requested',
    avatar: AuthConstants.adminAvatarPath
})

export const setRestaurantAuth = (email: string) => ({
    email,
    createdAt: new Date(),
    displayName: deleteField(),
    authId: deleteField(),
    providerId: deleteField(),
    status: deleteField(),
    avatar: deleteField(),
})

export const mapAuthUser = (user): AuthUser => ({
    authId: user.user.uid,
    email: user.user.email,
    displayName: user.user.displayName,
    createdAt: getCurrentUnixTime,
    avatar: user.user.photoURL,
    providerId: 'google',
    status: 'requested'
})