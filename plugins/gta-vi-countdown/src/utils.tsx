import { ToastActionCreators } from '@valenced/discord/actions'
import { lookupModule } from '@valenced/modules/finders'
import { withProps } from '@valenced/modules/finders/filters'
import { Image } from 'react-native'
import CountdownToast from './components/CountdownToast'
import { DEFAULT_DURATION, LOGO_URL, TARGET_DATE } from './constants'
import { storage } from './index'

interface ToastStore {
	getState(): {
		queuedToastsMap: Map<string, unknown[]>
	}
}

interface ToastUtils {
	useToastStore?: ToastStore
}

const getToastKey = () =>
	`gta-toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

const getDaysUntilRelease = () => {
	const now = new Date()
	const difference = TARGET_DATE.getTime() - now.getTime()
	return Math.ceil(difference / (1000 * 60 * 60 * 24))
}

export const showCountdownToast = async (
	duration?: number,
	forceReplace = false,
) => {
	try {
		const days = getDaysUntilRelease()
		const durationSec =
			duration ?? (Number(storage?.cache?.displayDuration) || DEFAULT_DURATION)

		await Image.prefetch(LOGO_URL).catch(() => null)

		if (forceReplace) {
			const [toastUtils] = lookupModule(withProps<ToastUtils>('useToastStore'))
			if (toastUtils?.useToastStore) {
				try {
					toastUtils.useToastStore.getState().queuedToastsMap?.delete('app')
				} catch {}
			}
			ToastActionCreators.close?.()
		}

		ToastActionCreators.open(getToastKey(), {
			content: <CountdownToast days={days} />,
			text: `GTA VI: ${days} days left`,
			duration: durationSec * 1000,
			position: 'top',
		} as any)
	} catch (error) {
		console.error('[GTAVICountdown] Failed to show countdown toast:', error)
	}
}
