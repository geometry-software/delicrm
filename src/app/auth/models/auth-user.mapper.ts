import { getCurrentUnixTime } from "../../shared/utils/format-unix-time";
import { AuthUser } from "./auth.model";

export const mapAuthAdmin = (user, name): AuthUser => ({
    displayName: name,
    email: user.email,
    createdAt: getCurrentUnixTime,
    authId: user.uid,
    providerId: 'firebase',
    status: 'requested',
    avatar: ''
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