import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: import.meta.env.BASEURL
})

export const { signIn, signUp, useSession } = createAuthClient()