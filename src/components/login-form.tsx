'use client'

import { useActionState, useId } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { AUTH_CLIENT } from '@/lib/firebase/client'
import { createSession } from '@/lib/session'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const [state, action, pending] = useActionState(login, '')
  const textId = useId()
  const router = useRouter()

  async function login(_: string, formData: FormData) {
    const email = formData.get('email') as string

    if (!email) {
      return 'Email is required'
    }

    try {
      const methods = await fetchSignInMethodsForEmail(AUTH_CLIENT, email)

      if (methods.length === 0) {
        return 'The email provided is not registered'
      }

      const credentials = await signInWithEmailAndPassword(
        AUTH_CLIENT,
        email,
        process.env.NEXT_PUBLIC_TEMP_PASS!
      )
      const token = await credentials.user.getIdToken()
      await createSession(token)
    } catch (error) {
      return error instanceof Error ? error.message : 'Unknown error occurred'
    }

    router.refresh()
    return ''
  }

  return (
    <form action={action}>
      <Label htmlFor={textId}>Email</Label>
      <Input type="text" id={textId} name="email" />
      <p>{state}</p>
      <Button type="submit" disabled={pending}>
        Login
      </Button>
    </form>
  )
}
