export const TARGET_DATE = new Date('2026-11-19T00:00:00')

// export const LOGO_URL = 'https://i.imgur.com/x91idXI.png' (Old Logo)
// export const LOGO_URL = 'https://i.imgur.com/CbcIKuB.png' (imgur is blocked in some regions)
// export const IMAGE_URL = 'https://i.imgur.com/M5K8i6m.jpeg' (imgur is blocked in some regions)

export const LOGO_URL = 'https://raw.githubusercontent.com/Purple-EyeZ/Valenced-Plugins/refs/heads/main/assets/GTA_VI/GTA_VI_Logo.png'
export const IMAGE_URL = 'https://raw.githubusercontent.com/Purple-EyeZ/Valenced-Plugins/refs/heads/main/assets/GTA_VI/GTA_VI_Banner.jpeg'
export const ROCKSTAR_VI_URL = 'https://www.rockstargames.com/VI'

export const DEFAULT_DURATION = 3
export const DEFAULT_FREQUENCY: Frequency = 'daily'

export type Frequency = 'startup' | 'hourly' | 'daily' | 'weekly'

export interface FrequencyOption {
	label: string
	value: Frequency
	description: string
}

export const FREQUENCIES: FrequencyOption[] = [
	{
		label: 'Always on Startup',
		value: 'startup',
		description: 'Shows every time you open the app.',
	},
	{
		label: 'Every Hour',
		value: 'hourly',
		description: 'Shows at most once per hour.',
	},
	{
		label: 'Daily',
		value: 'daily',
		description: 'Shows once every 24 hours.',
	},
	{
		label: 'Weekly',
		value: 'weekly',
		description: 'Shows once every 7 days.',
	},
]

export interface Settings {
	frequency: Frequency
	displayDuration: number
	lastShownTime: number
}

export const DefaultSettings: Settings = {
	frequency: DEFAULT_FREQUENCY,
	displayDuration: DEFAULT_DURATION,
	lastShownTime: 0,
}
