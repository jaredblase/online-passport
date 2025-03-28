'use server'

import { LoginForm } from '../components/login-form'
import { getUserToken, logoutSession } from '@/lib/session'
import { UserView } from '@/components/user-view'
import { Button } from '@/components/ui/button'
import { getUserById } from '@/lib/models/user/user'
import { AdminView } from '@/components/admin-view'
import { getItinerary } from '@/lib/models/itinerary'

export default async function Home() {
	const userToken = await getUserToken()

	if (!userToken) {
		return (
			<div className="container">
				<h1>Welcome to EConnect</h1>
				<p>Enter your ID to access your digital passport</p>
				<div className="mt-4 max-w-md">
					<LoginForm />
				</div>
			</div>
		)
	}

	getItinerary()
	const user = await getUserById(userToken.uid)

	// user does not exist
	if (!user) {
		return await logoutSession()
	}

	return (
		<div className="container">
			<p>Hi, {userToken.email}!</p>
			{user.admin ? (
				<AdminView itinerary={await getItinerary()} />
			) : (
				<UserView userId={userToken.uid} />
			)}
			<Button onClick={logoutSession}>Logout</Button>
		</div>
	)
}
