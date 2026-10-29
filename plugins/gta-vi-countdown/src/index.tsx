import { onFluxEventDispatched, Stores } from '@valenced/discord/flux'
import { getModules } from '@valenced/modules/finders'
import { withProps } from '@valenced/modules/finders/filters'
import { instead } from '@valenced/patcher'
import { DefaultSettings } from './constants'
import SettingsComponent from './Settings'
import { showCountdownToast } from './utils'
import type { JsonStorage } from '@valenced/json-storage'
import type { ReactNode } from 'react'
import type { Settings } from './constants'

export let storage: JsonStorage<Settings>

const ONE_HOUR = 60 * 60 * 1000
const ONE_DAY = 24 * ONE_HOUR

const checkAndShowToast = () => {
	const current = storage?.cache ?? DefaultSettings
	const now = Date.now()
	const lastShown = current.lastShownTime || 0
	const diff = now - lastShown

	let shouldShow = false

	switch (current.frequency) {
		case 'startup':
			shouldShow = true
			break
		case 'hourly':
			shouldShow = diff >= ONE_HOUR
			break
		case 'daily':
			shouldShow = diff >= ONE_DAY
			break
		case 'weekly':
			shouldShow = diff >= ONE_DAY * 7
			break
		default:
			shouldShow = diff >= ONE_DAY
	}

	if (shouldShow) {
		showCountdownToast()
		storage?.set({ lastShownTime: now })
	}
}

interface AuthenticationStore {
	getSessionId(): string | null | undefined
}

interface UserStore {
	getCurrentUser(): object | null | undefined
}

interface ToastProps {
	content?: ReactNode
	[key: string]: unknown
}

interface ToastModule {
	Toast(props: ToastProps): ReactNode
}

export default plugin<{ jsonStorage: Settings }>({
	jsonStorage: {
		load: true,
		default: DefaultSettings,
	},
	start({ cleanup, jsonStorage }) {
		storage = jsonStorage

		cleanup(
			getModules(withProps<ToastModule>('Toast'), ToastModule => {
				cleanup(
					instead(ToastModule, 'Toast', (args, orig) => {
						const [props] = args
						if (props?.content) return props.content
						return Reflect.apply(orig, this, args)
					}),
				)
			}),
		)

		const authStore = Stores.AuthenticationStore as unknown as
			| AuthenticationStore
			| undefined
		const userStore = Stores.UserStore as unknown as UserStore | undefined

		const isAlreadyConnected = Boolean(
			authStore?.getSessionId?.() || userStore?.getCurrentUser?.(),
		)

		if (isAlreadyConnected) {
			checkAndShowToast()
		} else {
			let unsubscribe: (() => void) | undefined
			let unsubscribed = false

			const removeListener = () => {
				if (unsubscribed) return
				unsubscribed = true
				unsubscribe?.()
			}

			unsubscribe = onFluxEventDispatched('POST_CONNECTION_OPEN', payload => {
				checkAndShowToast()
				removeListener()
				return payload
			})

			cleanup(removeListener)
		}
	},
	SettingsComponent,
})
