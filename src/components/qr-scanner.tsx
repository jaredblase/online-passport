'use client'

import {
	Html5QrcodeCameraScanConfig,
	Html5QrcodeScanner,
	QrcodeErrorCallback,
	QrcodeSuccessCallback,
} from 'html5-qrcode'
import React, { useRef } from 'react'
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
		const ref = useRef<Html5QrcodeScanner | null>(null)

		useEffect(() => {
			if (!ref.current) {
				ref.current = new Html5QrcodeScanner(id, config, verbose)
			}

			const scanner = ref.current

			setTimeout(() => {
				const container = document.getElementById(id)
				if (scanner && container?.innerHTML == '') {
					scanner.render(onSuccess, onError)
				}
			})

			return () => {
				scanner.clear().catch((error) => {
					console.error('Failed to clear html5QrcodeScanner. ', error)
				})
			}
		}, [])

		return <div id={id} />
	}
)

QRScanner.displayName = 'QRScanner'
