'use client'

import { AdminView } from './admin-view'
import { useUser } from '@/lib/user/use-user'

type DynamicDataProps = {
	userId: string
	children?: React.ReactNode
}

export function UserView({ userId, children }: DynamicDataProps) {
	const user = useUser(userId)

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
