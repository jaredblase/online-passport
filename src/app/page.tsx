import { LoginForm } from '../components/login-form'
import { getUser, logoutSession } from '@/lib/session'
import { UserView } from '@/components/user-view'
import qrcode from 'qrcode'
import { Button } from '@/components/ui/button'

export default async function Home() {
	const user = await getUser()

	if (!user) {
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

	const data = await qrcode.toDataURL(user.uid)

	return (
		<div className="container">
			<p>Hi, {user.email}!</p>
			<UserView userId={user.uid}>
				<img src={data} />
			</UserView>
			<Button onClick={logoutSession}>Logout</Button>
		</div>
	)
}
