'use client'

import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { FIRESTORE_CLIENT } from '../firebase/client'
import { User } from './user'

export function useUser(userId: string) {
	const [user, setUser] = useState<User>()

	useEffect(
		() =>
			onSnapshot(doc(FIRESTORE_CLIENT, 'users', userId), (doc) => {
				setUser(doc.data() as User | undefined)
			}),
		[]
	)

	return user
}
