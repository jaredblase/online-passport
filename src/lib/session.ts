'use server'

import { cookies } from 'next/headers'
import { AUTH_ADMIN, FIREBASE_COOKIE_NAME } from './firebase/admin'
import { redirect } from 'next/navigation'
import { DecodedIdToken } from 'firebase-admin/auth'

export async function createSession(token: string) {
	if (!token) return null

	try {
		const decodedToken = await AUTH_ADMIN.verifyIdToken(token)
		if (!decodedToken) return { success: false, error: 'Invalid token.' }

		const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days
		const sessionCookie = await AUTH_ADMIN.createSessionCookie(token, {
			expiresIn,
		})

		await setCookie(FIREBASE_COOKIE_NAME, sessionCookie, {
			maxAge: expiresIn / 1000,
		})
		console.log('Session created for UID:', decodedToken.uid)

		return { success: true, uid: decodedToken.uid }
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error creating session:', error.message)
			return { success: false, error: error.message }
		}

		console.error('Error creating session:', error)
	}
}

/**
 * Retrieve and deocde user information from cookies
 * @returns Decoeded user token
 */
export async function getUserToken(): Promise<DecodedIdToken | null> {
	const token = await getCookie(FIREBASE_COOKIE_NAME)
	if (!token) return null
	const data = await AUTH_ADMIN.verifySessionCookie(token)
	return data.uid ? data : null
}

export async function logoutSession() {
	try {
		const token = await getCookie(FIREBASE_COOKIE_NAME)

		if (token) {
			await revokeAllSessions(token)
			await deleteCookie(FIREBASE_COOKIE_NAME)
			redirect('/')
		}
	} catch (error) {
		console.error(
			'Error during logout:',
			error instanceof Error ? error.message : error
		)
	}
}

export async function revokeAllSessions(token: string) {
	const decodedIdToken = await AUTH_ADMIN.verifySessionCookie(token)
	await AUTH_ADMIN.revokeRefreshTokens(decodedIdToken.sub)
}

export async function setCookie(key: string, value: string, options = {}) {
	const cookieStore = await cookies()
	cookieStore.set(key, value, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		path: '/',
		maxAge: 60 * 60 * 24 * 5, // Default: 5 days
		...options,
	})
}

export async function getCookie(key: string) {
	const cookieStore = await cookies()
	const cookie = cookieStore.get(key)
	return cookie ? cookie.value : null
}

export async function deleteCookie(key: string) {
	const cookieStore = await cookies()
	cookieStore.delete(key)
}
