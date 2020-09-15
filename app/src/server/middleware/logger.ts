const morgan = require('morgan')
const logger = morgan(
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :response-time ms ":referrer" ":user-agent"'
)

export default function (req, res, next) {
  logger(req, res, next)
}
