import { AuthUser } from './auth.model'

export const formatAuthUser = (profile, uid, provider): AuthUser => ({
  name: profile.name,
  provider: provider,
  providerId: profile.id,
  uid: uid,
  email: profile.email,
  avatar: profile.picture,
  locale: profile?.locale,
  timestamp: new Date(),
  status: 'requested',
  role: 'requested',
})
