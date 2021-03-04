FROM node:14

ARG HOST=0.0.0.0
ENV HOST ${HOST}

ARG PUID=1000
ENV PUID ${PUID}

ARG PGID=1000
ENV PGID ${PGID}

ARG TZ=UTC
ENV TZ ${TZ}

ARG APP_ROOT_PATH=/app
ENV APP_ROOT_PATH ${APP_ROOT_PATH}

USER root
RUN getent group ${PGID} || groupadd -g ${PGID} user
RUN getent passwd ${PUID} || useradd -u ${PUID} -g ${PGID} -p "*" -s /bin/bash -m user

USER ${PUID}
WORKDIR ${APP_ROOT_PATH}
