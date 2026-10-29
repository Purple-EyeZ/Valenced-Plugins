import { getAssetIdByName } from '@valenced/assets'
import Page from '@valenced/components/Page'
import { Design } from '@valenced/discord/design'
import {
	Image,
	Linking,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native'
import {
	DefaultSettings,
	FREQUENCIES,
	IMAGE_URL,
	ROCKSTAR_VI_URL,
} from './constants'
import { showCountdownToast } from './utils'
import type { PluginSettingsComponent } from '@valenced/plugins/types'
import type { ComponentProps } from 'react'
import type { Frequency, Settings } from './constants'

const {
	Button,
	Slider,
	Stack,
	TableRadioGroup,
	TableRadioRow,
	TableRow,
	TableRowGroup,
	Text,
} = Design

type Props = ComponentProps<PluginSettingsComponent<{ jsonStorage: Settings }>>

const HeroBanner = () => (
	<TouchableOpacity
		onPress={() => Linking.openURL(ROCKSTAR_VI_URL)}
		activeOpacity={0.9}
		style={styles.heroContainer}
	>
		<Image
			source={{ uri: IMAGE_URL }}
			style={styles.heroImage}
			resizeMode="cover"
		/>
	</TouchableOpacity>
)

const styles = StyleSheet.create({
	heroContainer: {
		width: '100%',
		aspectRatio: 16 / 9,
		borderRadius: 16,
		overflow: 'hidden',
		backgroundColor: '#000',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.6,
		shadowRadius: 5.0,
		elevation: 8,
	},
	heroImage: {
		width: '100%',
		height: '100%',
	},
})

export default function SettingsComponent({
	api: { jsonStorage: storage },
}: Props) {
	const { frequency, displayDuration } = storage.use() ?? DefaultSettings

	return (
		<Page>
			<ScrollView style={{ flex: 1 }}>
				<Stack spacing={24}>
					<HeroBanner />

					<TableRadioGroup<Frequency>
						title="Frequency"
						defaultValue={frequency}
						onChange={(v: Frequency) => storage.set({ frequency: v })}
					>
						{FREQUENCIES.map(freq => (
							<TableRadioRow
								key={freq.value}
								label={freq.label}
								subLabel={freq.description}
								value={freq.value}
							/>
						))}
					</TableRadioGroup>

					<TableRowGroup title="Behavior">
						<TableRow
							label="Toast Duration"
							subLabel={
								<View>
									<Text
										variant="text-xs/medium"
										color="text-subtle"
										style={{ marginTop: 4 }}
									>
										The notification will stay on screen for{' '}
										<Text variant="text-xs/bold" color="text-normal">
											{displayDuration} seconds
										</Text>
										.
									</Text>

									<Slider
										value={displayDuration}
										minimumValue={1}
										maximumValue={20}
										step={1}
										onValueChange={(val: number) =>
											storage.set({ displayDuration: val })
										}
									/>
								</View>
							}
							arrow={false}
						/>
					</TableRowGroup>

					<View style={{ paddingHorizontal: 0 }}>
						<Button
							text="Preview Toast"
							variant="primary"
							size="md"
							onPress={() => showCountdownToast(displayDuration, true)}
							icon={getAssetIdByName('EyeIcon')}
							iconPosition="start"
						/>
					</View>
				</Stack>
			</ScrollView>
		</Page>
	)
}
