import { getCurrentUnixTime } from "../../../shared/utils/format-unix-time"
import { User, UserRole } from "../models/user.model"

export type UserInfo = {
    locale: string,
    avatar: string,
    name: string,
    email: string,
}

export const mapUserInfo = (info: UserInfo): UserInfo => ({
    locale: info.locale,
    name: info.name,
    email: info.email,
    avatar: info.avatar,
})

export const mapAdminUser = (userId: string, info: UserInfo): User => ({
    userId,
    role: 'admin',
    status: 'active',
    createdAt: getCurrentUnixTime(),
    ...mapUserInfo(info)
})

export const mapRequestedUser = (userId: string, role: UserRole, info: UserInfo): User => ({
    userId,
    role,
    status: 'requested',
    createdAt: getCurrentUnixTime(),
    ...mapUserInfo(info)
})