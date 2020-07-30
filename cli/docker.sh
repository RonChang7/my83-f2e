#! /bin/bash

_get_user_in_app()
{
    echo $(_exec_in_app_contianer "getent passwd $APP_PUID | cut -d: -f1")
}

_get_group_in_app()
{
    echo $(_exec_in_app_contianer "getent group $APP_PGID | cut -d: -f1")
}

_mutagen_start()
{
    [ ! $IS_USE_MUTAGEN ] && return

    local APP_CONTIANER_ID=$(docker-compose ps -q app | awk '{print $1}')
    local APP_USERNAME="$(_get_user_in_app)"
    local APP_GROUPNAME="$(_get_group_in_app)"

    mutagen daemon start

    mutagen sync create \
        --label=$APP_CODE_MUTAGEN_LABEL \
        --default-file-mode=0644 \
        --default-directory-mode=0755 \
        --default-owner-beta=$APP_USERNAME \
        --default-group-beta=$APP_GROUPNAME \
        --sync-mode=two-way-resolved \
        --ignore=/node_modules \
        --ignore=/.nuxt \
        --ignore-vcs \
        $APP_CODE_PATH_HOST "docker://root@$APP_CONTIANER_ID$APP_CODE_PATH_CONTAINER"
}

_mutagen_stop()
{
    [ ! $IS_USE_MUTAGEN ] && return
    mutagen sync pause --label-selector=$APP_CODE_MUTAGEN_LABEL
}

_mutagen_down()
{
    [ ! $IS_USE_MUTAGEN ] && return
    mutagen sync terminate --label-selector=$APP_CODE_MUTAGEN_LABEL
    mutagen daemon stop
}

_exec_in_app_contianer()
{
    docker-compose exec --user=root -T app sh -c "$@"
}

_create_curr_user_in_app()
{
    if [ ! $(_get_group_in_app) ]; then
        _exec_in_app_contianer "groupadd -g $APP_PGID docker-host"
    fi
    if [ ! $(_get_user_in_app) ]; then
        _exec_in_app_contianer "useradd -u $APP_PUID -g $APP_PGID -m -s /bin/bash docker-host"
    fi
    _exec_in_app_contianer "chown $APP_PUID:$APP_PGID $APP_CODE_PATH_CONTAINER"
}

_docker_sync_start()
{
    [ ! $IS_USE_DOCKER_SYNC ] && return
    docker-sync start --no-logd
}

_docker_sync_stop()
{
    [ ! $IS_USE_DOCKER_SYNC ] && return
    docker-sync stop
}

_docker_sync_down()
{
    [ ! $IS_USE_DOCKER_SYNC ] && return
    docker-sync clean
}

_start()
{
    cd $PATH_DOCKER_DIR
    _docker_sync_start
    docker-compose up -d
    _create_curr_user_in_app
    _mutagen_start
}

_stop()
{
    cd $PATH_DOCKER_DIR
    _mutagen_stop
    docker-compose stop
    _docker_sync_stop
}

_down()
{
    cd $PATH_DOCKER_DIR
    _mutagen_down
    docker-compose down -v
    _docker_sync_down
}

_bash()
{
    cd $PATH_DOCKER_DIR
    docker-compose exec --user=$APP_PUID app bash
}

_opt()
{
    cd $PATH_DOCKER_DIR
    _create_curr_user_in_app
}

bootstrap()
{
    PATH_WORKSPACE="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
    PATH_DOCKER_DIR="$PATH_WORKSPACE/../docker"

    source "$PATH_DOCKER_DIR/.env"
    APP_CODE_MUTAGEN_LABEL="my83-f2e-app=code"
    IS_USE_MUTAGEN=$(echo $COMPOSE_FILE | grep "docker-compose.mutagen.yml")
    IS_USE_DOCKER_SYNC=$(echo $COMPOSE_FILE | grep "docker-compose.sync.yml")

    case $@ in
        start)
            _start
            exit 0
            ;;
        stop)
            _stop
            exit 0
            ;;
        down)
            _down
            exit 0
            ;;
        bash)
            _bash
            exit 0
            ;;
        opt)
            _opt
            exit 0
            ;;
        *)
            echo "Usage:"
            echo "  start|stop|down|bash"
            exit 1

    esac
}
bootstrap $@
