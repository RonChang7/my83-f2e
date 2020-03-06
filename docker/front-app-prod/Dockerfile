FROM node:10-alpine

ENV APP_ROOT /app
ENV HOST 0.0.0.0

WORKDIR ${APP_ROOT}
ADD . ${APP_ROOT}

CMD ["npm", "start"]