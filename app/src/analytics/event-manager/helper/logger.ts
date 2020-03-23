export const logger = (message: string, payload: any = null) => {
  const tagStyle =
    'background: #7bd6ff; border-radius: 1em; color: #fff; padding: 2px 6px; font-weight: bold;'
  const contentStyle = 'padding: 2px 6px;'

  // eslint-disable-next-line no-console
  console.log(`%cTrigger:%c${message} ${payload}`, tagStyle, contentStyle)
}
