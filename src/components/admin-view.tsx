'use client'

import { FIRESTORE_CLIENT } from '@/lib/firebase/client'
import { doc, increment, updateDoc } from 'firebase/firestore'
import { useCallback, useEffect, useState } from 'react'
import { QRScanner } from './qr-scanner'
import {
	Html5QrcodeCameraScanConfig,
	QrcodeSuccessCallback,
} from 'html5-qrcode'

const config = {
	fps: 30,
	qrbox: 250,
	videoConstraints: { facingMode: 'environment' },
} satisfies Html5QrcodeCameraScanConfig

export function AdminView() {
	const [scanned, setScanned] = useState<string>()
	const [status, setStatus] = useState<string>()

	const onSuccess: QrcodeSuccessCallback = useCallback(
		(userId) => setScanned(userId),
		[]
	)

	useEffect(() => {
		if (!scanned) return

		setStatus('Updating...')
		updateDoc(doc(FIRESTORE_CLIENT, 'users', scanned), {
			times_scanned: increment(1),
		}).then(() => setStatus('Updated!'))
	}, [scanned])

	return (
		<>
			<p>Scanned: {scanned || '-'}</p>
			<p>{status}</p>
			<QRScanner config={config} onSuccess={onSuccess} />
		</>
	)
}
