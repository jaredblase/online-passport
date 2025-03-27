'use client'

import { FIRESTORE_CLIENT } from '@/lib/firebase/client'
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { AdminView } from './admin-view'

type DynamicDataProps = {
	userId: string
	children?: React.ReactNode
}

type User = {
	times_scanned?: number
	admin?: boolean
}

export function UserView({ userId, children }: DynamicDataProps) {
	const [user, setUser] = useState<User>()

	useEffect(
		() =>
			onSnapshot(doc(FIRESTORE_CLIENT, 'users', userId), (doc) => {
				setUser(doc.data() as User | undefined)
			}),
		[]
	)

	if (!user) {
		return <p>Loading...</p>
	}

	if (user.admin) {
		return <AdminView />
	}

	return (
		<>
			{children}
			<p>Times scanned : {user.times_scanned}</p>
		</>
	)
}
