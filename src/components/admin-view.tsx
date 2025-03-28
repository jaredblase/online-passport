'use client'

import { FIRESTORE_CLIENT } from '@/lib/firebase/client'
import { doc, serverTimestamp, updateDoc, getDoc } from 'firebase/firestore'
import { useCallback, useEffect, useId, useState } from 'react'
import { QRScanner } from './qr-scanner'
import {
	Html5QrcodeCameraScanConfig,
	QrcodeSuccessCallback,
} from 'html5-qrcode'
import { Itinerary } from '@/lib/models/itinerary'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Label } from './ui/label'
import { User } from '@/lib/models/user/user'

const config = {
	fps: 30,
	qrbox: 250,
	videoConstraints: { facingMode: 'environment' },
} satisfies Html5QrcodeCameraScanConfig

type AdminViewProps = {
	itinerary: Itinerary[]
}

export function AdminView({ itinerary }: AdminViewProps) {
	const [scannedId, setScannedId] = useState<string>()
	const [updateStatus, setUpdateStatus] = useState<string>()
	const [selectedItinerary, setSelectedItinerary] = useState<string>('')
	const selectId = useId()

	const onSuccess: QrcodeSuccessCallback = useCallback(
		(userId) => setScannedId(userId),
		[]
	)

	async function updateDb(userId: string, itinerary: string) {
		const userRef = doc(FIRESTORE_CLIENT, 'users', userId)

		setUpdateStatus('Retrieving information...')

		const user = (await getDoc(userRef)).data() as User

		if (user.admin) return setUpdateStatus('Invalid. User is an admin!')
		if (user.completed[itinerary])
			return setUpdateStatus('Invalid. User is already done with this.')

		setUpdateStatus('Updating...')

		await updateDoc(userRef, {
			completed: {
				[selectedItinerary]: serverTimestamp(),
			},
		})

		setUpdateStatus('Updated!')
	}

	useEffect(() => {
		if (scannedId && selectedItinerary) {
			updateDb(scannedId, selectedItinerary)
		}
	}, [scannedId, selectedItinerary])

	return (
		<div className="mt-8 mb-4">
			<Label htmlFor={selectId}>Itinerary item to mark:</Label>
			<Select onValueChange={setSelectedItinerary}>
				<SelectTrigger id={selectId} className="w-[180px]">
					<SelectValue placeholder="Choose..." />
				</SelectTrigger>
				<SelectContent>
					{itinerary.map((it) => (
						<SelectItem value={it.id} key={it.title}>
							{it.title}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{selectedItinerary && (
				<>
					<p className="mt-8">Scanned ID: {scannedId || '-'}</p>
					<p>Update status: {updateStatus ?? '-'}</p>
					<QRScanner config={config} onSuccess={onSuccess} />
				</>
			)}
		</div>
	)
}
