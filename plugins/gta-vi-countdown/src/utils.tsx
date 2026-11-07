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

export interface TimeRemaining {
	isReleased: boolean
	days: number
	hours: number
	minutes: number
}

export const getTimeRemaining = (): TimeRemaining => {
	const diff = TARGET_DATE.getTime() - Date.now()

	if (diff <= 0) {
		return { isReleased: true, days: 0, hours: 0, minutes: 0 }
	}

	const totalSeconds = Math.floor(diff / 1000)
	const minutes = Math.floor(totalSeconds / 60) % 60
	const hours = Math.floor(totalSeconds / 3600) % 24
	const days = Math.floor(totalSeconds / 86400)

	return { isReleased: false, days, hours, minutes }
}

export const formatCountdown = (time: TimeRemaining): string => {
	if (time.isReleased) return 'OUT NOW!'
	if (time.days > 0) {
		return `${time.days}d ${time.hours}h ${time.minutes}m`
	}
	const minStr =
		time.days === 0 && time.hours === 0 && time.minutes === 0
			? '< 1m'
			: `${time.minutes}m`
	return `${time.hours}h ${minStr}`
}

export const showCountdownToast = async (
	duration?: number,
	forceReplace = false,
) => {
	try {
		const timeRemaining = getTimeRemaining()
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

		const fallbackText = timeRemaining.isReleased
			? 'GTA VI: Out Now!'
			: `GTA VI: ${formatCountdown(timeRemaining)} left`

		ToastActionCreators.open(getToastKey(), {
			content: <CountdownToast timeRemaining={timeRemaining} />,
			text: fallbackText,
			duration: durationSec * 1000,
			position: 'top',
		} as any)
	} catch (error) {
		console.error('[GTAVICountdown] Failed to show countdown toast:', error)
	}
}
