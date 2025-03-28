'use server'

import { generateQrCode } from '@/lib/models/user/user'
import { ItineraryRows } from './itinerary-rows'
import { getItinerary } from '@/lib/models/itinerary'
import {
	Table,
	TableBody,
	TableCaption,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'

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
			<Table>
				<TableCaption>A list of transactions.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[200px]">Invoice</TableHead>
						<TableHead>Timestamp</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<ItineraryRows userId={userId} itinerary={itinerary} />
				</TableBody>
			</Table>
		</>
	)
}
