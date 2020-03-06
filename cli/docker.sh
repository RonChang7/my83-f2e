#! /bin/bash

cd ../docker

# 是否啟用 docker-sync
ENABLE_DOCKER_SYNC=false
if [[ -n $(cat .env | grep COMPOSE_FILE | awk -F'=' '{print $2}' | grep :docker-compose.sync.yml) ]] ; then
    ENABLE_DOCKER_SYNC=true
fi

docker_start()
{
    if [ "$ENABLE_DOCKER_SYNC" = true ] ; then
        docker-sync start --no-logd
    fi;
    docker-compose up -d
}

docker_stop()
{
    docker-compose stop
    if [ "$ENABLE_DOCKER_SYNC" = true ] ; then
        docker-sync stop
    fi
}

docker_down()
{
    docker-compose down
    if [ "$ENABLE_DOCKER_SYNC" = true ] ; then
        docker-sync clean
    fi
}

docker_bash()
{
    docker-compose exec app bash
}


case $@ in
    start)
        docker_start
        ;;
    stop)
        docker_stop
        ;;
    down)
        docker_down
        ;;
    bash)
        docker_bash
        ;;
    *)
        echo "Usage:"
        echo "  start|stop|down|bash"

esac

exit 1
