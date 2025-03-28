'use server'

import { generateQrCode } from '@/lib/models/user/user'
import { Itinerary } from './itinerary'
import { getItinerary } from '@/lib/models/itinerary'

type DynamicDataProps = {
	userId: string
}

export async function UserView({ userId }: DynamicDataProps) {
	const [qrData, itinerary] = await Promise.all([
		generateQrCode(userId),
		getItinerary(),
	])

	return (
		<>
			<img src={qrData} alt="QR code for admins to scan" />
			<Itinerary userId={userId} itinerary={itinerary} />
		</>
	)
}
