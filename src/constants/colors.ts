export const White = (opacity = 1) => {
  return `rgba(255, 255, 255, ${opacity} )`
}
export const Black = opacity => {
  return `rgba(0, 0, 0, ${opacity} )`
}
export const BACKGROUND = '#F7F6F9;'
export const SECTION_BACKGROUND = White(0.08)
export const MODAL_BACKGROUND = Black(0.8)
export const MODAL_MAIN_BACKGROUND = White(1)
export const BORDER_DARK = White(0.1)
export const BORDER = '#ECE8EF'
export const TEXT = '#584B5A'
export const TEXT_ERROR = '#e6008d'
export const SUBTEXT = '#AA9AAA'
export const PRIMARY_BUTTON_TEXT = White(0.85)
export const AREA = '#2D2A2C'
export const PLACEHOLDER = '#DBD6DF'
export const ERROR = '#E93902'
export const WARNING = '#DA6901'
export const WARNING_BACK = 'rgba(230, 138, 0, 0.1)'

export const MAIN = '#00E6CC'
export const MAIN_DARK = '#06DBC3'
export const Main = (opacity = 1) => `rgba(0, 230, 204, ${opacity})`
