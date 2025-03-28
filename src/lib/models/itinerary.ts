'use server'

import { cache } from 'react'
import { FIRESTORE_ADMIN } from '../firebase/admin'

export type Itinerary = {
	id: string
	title: string
}

export const getItinerary = cache(async () => {
	const { docs } = await FIRESTORE_ADMIN.collection('itinerary').get()
	return docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Itinerary)
})
