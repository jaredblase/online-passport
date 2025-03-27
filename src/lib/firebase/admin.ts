import admin from 'firebase-admin'

if (!admin.apps.length) {
	const serviceAccount = process.env.FIREBASE_ADMIN_SDK
		? JSON.parse(process.env.FIREBASE_ADMIN_SDK)
		: null

	if (serviceAccount) {
		admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
		})
	} else {
		console.error('Firebase Admin SDK credentials are missing.')
		throw new Error(
			'Firebase Admin initialization failed: Missing credentials.'
		)
	}
}

const FIRESTORE_ADMIN = admin.firestore()
const AUTH_ADMIN = admin.auth()
const FIREBASE_ADMIN = admin
const FIREBASE_COOKIE_NAME = 'firebaseToken'

export { FIRESTORE_ADMIN, AUTH_ADMIN, FIREBASE_ADMIN, FIREBASE_COOKIE_NAME }
