import { lookupModule } from '@valenced/modules/finders'
import { withProps } from '@valenced/modules/finders/filters'
import { Image, StyleSheet, Text, View } from 'react-native'
import { LOGO_URL } from '../constants'
import type { ComponentType, ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

const Colors = {
	primary: '#E146C6',
	secondary: '#14acc0',
	white: '#ffffff',
	lightGray: '#aaaaaa',
}

interface CountdownToastProps {
	days: number
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
	},
	headerText: {
		color: Colors.white,
		fontSize: 12,
		fontWeight: '500',
		opacity: 0.8,
	},
	countdownRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 4,
	},
	daysText: {
		color: Colors.primary,
		fontSize: 22,
		fontWeight: '900',
		textShadowColor: 'rgba(255, 0, 255, 0.7)',
		textShadowRadius: 12,
		marginRight: 4,
	},
	subText: {
		color: Colors.secondary,
		fontSize: 14,
		fontWeight: 'bold',
		textShadowColor: 'rgba(0, 213, 255, 0.7)',
		textShadowRadius: 10,
	},
	footerText: {
		color: Colors.lightGray,
		fontSize: 9,
	},
})

export default function CountdownToast({ days }: CountdownToastProps) {
	const Gradient = getLinearGradient()

	const content = (
		<View style={styles.container}>
			<Image source={{ uri: LOGO_URL }} style={styles.logo} />

			<View style={styles.separator} />

			<View style={styles.textContainer}>
				<Text style={styles.headerText}>GRAND THEFT AUTO VI</Text>

				<View style={styles.countdownRow}>
					<Text style={styles.daysText}>{days}</Text>
					<Text style={styles.subText}>DAYS LEFT</Text>
				</View>

				<Text style={styles.footerText}>Coming 19th Nov 2026</Text>
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
