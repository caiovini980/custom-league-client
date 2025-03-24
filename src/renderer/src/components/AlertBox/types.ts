export type AlertType = 'info' | 'warning' | 'error'

export type AlignMessage = 'center' | 'flex-start' | 'flex-end'

export interface AlertBoxProps {
  type: AlertType
  message: string
  fullWidth?: boolean
  align?: AlignMessage
  isBlank?: boolean
}

export interface AlertBoxStyleProps {
  type: AlertType
  fullWidth?: boolean
  align: AlignMessage
  isBlank: boolean
}
