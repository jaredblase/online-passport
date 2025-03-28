'use server'

import { FIRESTORE_ADMIN } from '../../firebase/admin'
import qrcode from 'qrcode'

type Member = {
	completed: boolean
	times_scanned: number
	admin: false
}

type Admin = {
	admin: true
}

export type User = Member | Admin

export async function getUserById(userId: string) {
	const d = await FIRESTORE_ADMIN.collection('users').doc(userId).get()
	return d.data() as User | undefined
}

export const generateQrCode = async (userId: string) => {
	return qrcode.toDataURL(userId)
}
