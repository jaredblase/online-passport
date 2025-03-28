'use server'

import { LoginForm } from '../components/login-form'
import { getUserToken, logoutSession } from '@/lib/session'
import { UserView } from '@/components/user-view'
import qrcode from 'qrcode'
import { Button } from '@/components/ui/button'
import { getUserById } from '@/lib/user/user'

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

	const user = await getUserById(userToken.uid)
	console.log(user)

	// user does not exist
	if (!user) {
		return await logoutSession()
	}

	const data = await qrcode.toDataURL(userToken.uid)

	return (
		<div className="container">
			<p>Hi, {userToken.email}!</p>
			<UserView userId={userToken.uid}>
				<img src={data} alt="QR code displaying user for admins to scan" />
			</UserView>
			<Button onClick={logoutSession}>Logout</Button>
		</div>
	)
}
