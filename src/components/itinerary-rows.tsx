'use client'

import { Itinerary as It } from '@/lib/models/itinerary'
import { useUser } from '@/lib/models/user/use-user'
import { TableCell, TableRow } from '@/components/ui/table'
import { Loading } from './ui/loading'
import { cn } from '@/lib/utils'

type ItineraryProps = {
	userId: string
	itinerary: It[]
}

export function ItineraryRows({ userId, itinerary }: ItineraryProps) {
	const user = useUser(userId)

	if (!user) {
		return (
			<TableRow>
				<TableCell colSpan={2}>
					<Loading className="w-full py-4" />
				</TableCell>
			</TableRow>
		)
	}

	if (user.admin) {
		return (
			<TableRow>
				<TableCell colSpan={2}>
					<p className="text-red-600">
						You are an admin. Please log out and try logging in again.
					</p>
				</TableCell>
			</TableRow>
		)
	}

	return (
		<>
			{itinerary.map((it) => (
				<TableRow key={it.id}>
					<TableCell
						className={cn(
							'font-medium',
							it.id in user.completed && 'text-gray-400 line-through'
						)}
					>
						{it.title}
					</TableCell>
					<TableCell>
						{user.completed[it.id]?.toDate().toLocaleString()}
					</TableCell>
				</TableRow>
			))}
		</>
	)
}
