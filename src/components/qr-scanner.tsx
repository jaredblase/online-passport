import {
	Html5QrcodeCameraScanConfig,
	Html5QrcodeScanner,
	QrcodeErrorCallback,
	QrcodeSuccessCallback,
} from 'html5-qrcode'
import React from 'react'
import { useEffect, useId } from 'react'

type QRScannerProps = {
	config: Html5QrcodeCameraScanConfig
	onSuccess: QrcodeSuccessCallback
	onError?: QrcodeErrorCallback
	verbose?: boolean
}

export const QRScanner = React.memo(
	({ config, verbose, onError, onSuccess }: QRScannerProps) => {
		const id = useId()

		useEffect(() => {
			const scanner = new Html5QrcodeScanner(id, config, verbose)
			scanner.render(onSuccess, onError)

			return () => {
				scanner.clear().catch((error) => {
					console.error('Failed to clear html5QrcodeScanner. ', error)
				})
			}
		}, [])

		return <div id={id} />
	}
)
