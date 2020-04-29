import linkifyStr from 'linkifyjs/string'

export const textToUrl = (content: string) => {
  const string = linkifyStr(content, {
    attributes: {
      rel: 'noopener nofollow',
    },
    className: '',
    nl2br: true,
    validate: {
      url: (value) => /^https?:\/\//.test(value),
      email: () => false,
    },
  })
  return string.replace(/&amp;/g, '&')
}

export const nl2br = (content: string) => content.replace(/\n|\r\n?/g, '<br />')

export const br2nl = (content: string) =>
  content.replace(/<\s*\/?br\s*[/]?>/gi, '\n')
