'use client'

import { Itinerary as It } from '@/lib/models/itinerary'
import { useUser } from '@/lib/models/user/use-user'

type ItineraryProps = {
	userId: string
	itinerary: It[]
}

export function Itinerary({ userId, itinerary }: ItineraryProps) {
	const user = useUser(userId)

	if (!user) {
		return <p>Loading...</p>
	}

	if (user.admin) {
		return <p>You are an admin. Please log out and try again.</p>
	}

	return (
		<>
			<p>Times scanned : {user.times_scanned}</p>
			{itinerary.map((it) => (
				<p key={it.id}>{it.title}</p>
			))}
		</>
	)
}
