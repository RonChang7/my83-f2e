import linkifyStr from 'linkifyjs/string'
import { Options } from 'linkifyjs'

export const textToUrl = (
  content: string,
  customValidate?: Options['validate']
) => {
  const validate = customValidate || {
    url: (value) => /^https?:\/\//.test(value),
    email: () => false,
  }

  const string = linkifyStr(content, {
    attributes: {
      rel: 'noopener nofollow',
    },
    className: '',
    nl2br: true,
    validate,
  })
  return string.replace(/&amp;/g, '&')
}

export const nl2br = (content: string) => content.replace(/\n|\r\n?/g, '<br />')

export const br2nl = (content: string) =>
  content.replace(/<\s*\/?br\s*[/]?>/gi, '\n')

export const htmlStrip = (content: string) =>
  content.replace(/(<([^>]+)>)/gi, '')
