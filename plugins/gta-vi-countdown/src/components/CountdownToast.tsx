import { lookupModule } from '@valenced/modules/finders'
import { withProps } from '@valenced/modules/finders/filters'
import { Fragment, type ComponentType, type ReactNode } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { LOGO_URL } from '../constants'
import type { TimeRemaining } from '../utils'
import type { StyleProp, ViewStyle } from 'react-native'

const Colors = {
	primary: '#E146C6',
	secondary: '#14acc0',
	white: '#ffffff',
	lightGray: '#aaaaaa',
}

interface CountdownToastProps {
	timeRemaining?: TimeRemaining
	days?: number
}

interface LinearGradientProps {
	colors: string[]
	start?: { x: number; y: number }
	end?: { x: number; y: number }
	style?: StyleProp<ViewStyle>
	children?: ReactNode
}

interface LinearGradientModule {
	LinearGradientNativeComponent: unknown
	default?: ComponentType<LinearGradientProps>
	LinearGradient?: ComponentType<LinearGradientProps>
}

let LinearGradient: ComponentType<LinearGradientProps> | undefined

function getLinearGradient(): ComponentType<LinearGradientProps> | undefined {
	if (!LinearGradient) {
		const [mod] = lookupModule(
			withProps<LinearGradientModule>('LinearGradientNativeComponent'),
		)
		LinearGradient = mod?.default ?? mod?.LinearGradient
	}
	return LinearGradient
}

const styles = StyleSheet.create({
	gradientBorder: {
		borderRadius: 8,
		padding: 1,
		overflow: 'hidden',
		backgroundColor: Colors.primary,
	},
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#000000e6',
		borderRadius: 7,
		padding: 8,
	},
	logo: {
		width: 60,
		height: 60,
		resizeMode: 'contain',
	},
	separator: {
		width: 1,
		height: '80%',
		backgroundColor: Colors.secondary,
		marginHorizontal: 10,
		opacity: 0.6,
	},
	textContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		flexShrink: 1,
	},
	headerText: {
		color: Colors.white,
		fontSize: 12,
		fontWeight: '500',
		opacity: 0.8,
		textAlign: 'center',
	},
	countdownRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: 4,
	},
	daysText: {
		color: Colors.primary,
		fontSize: 22,
		fontWeight: '900',
		textShadowColor: 'rgba(255, 0, 255, 0.7)',
		textShadowRadius: 12,
	},
	unitText: {
		color: Colors.secondary,
		fontSize: 16,
		fontWeight: 'bold',
		textShadowColor: 'rgba(0, 213, 255, 0.7)',
		textShadowRadius: 10,
	},
	footerText: {
		color: Colors.lightGray,
		fontSize: 9,
		textAlign: 'center',
	},
})

const getSegments = ({ days, hours, minutes }: TimeRemaining) => {
	const segments: { value: number | string; unit: string }[] = []
	if (days > 0) segments.push({ value: days, unit: 'd' })
	segments.push({ value: hours, unit: 'h' })
	segments.push({
		value: days === 0 && hours === 0 && minutes === 0 ? '< 1' : minutes,
		unit: 'm',
	})
	return segments
}

export default function CountdownToast({
	timeRemaining,
	days,
}: CountdownToastProps) {
	const Gradient = getLinearGradient()

	const remaining: TimeRemaining = timeRemaining ?? {
		isReleased: (days ?? 0) <= 0,
		days: Math.max(0, days ?? 0),
		hours: 0,
		minutes: 0,
	}

	const content = (
		<View style={styles.container}>
			<Image source={{ uri: LOGO_URL }} style={styles.logo} />

			<View style={styles.separator} />

			<View style={styles.textContainer}>
				<Text style={styles.headerText}>GRAND THEFT AUTO VI</Text>

				<View style={styles.countdownRow}>
					{remaining.isReleased ? (
						<Text style={styles.daysText}>OUT NOW!</Text>
					) : (
						<Text style={styles.daysText}>
							{getSegments(remaining).map(({ value, unit }, index, array) => (
								<Fragment key={unit}>
									{value}
									<Text style={styles.unitText}>
										{unit}
										{index < array.length - 1 ? ' ' : ''}
									</Text>
								</Fragment>
							))}
						</Text>
					)}
				</View>

				<Text style={styles.footerText}>
					{remaining.isReleased
						? 'Released 19th Nov 2026'
						: 'Coming 19th Nov 2026'}
				</Text>
			</View>
		</View>
	)

	return (
		<View style={styles.gradientBorder}>
			{Gradient ? (
				<Gradient
					colors={[Colors.primary, Colors.secondary]}
					start={{ x: 0, y: 0.5 }}
					end={{ x: 1, y: 0.5 }}
					style={StyleSheet.absoluteFill}
				/>
			) : null}
			{content}
		</View>
	)
}
