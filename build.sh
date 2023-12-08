git add .
git commit -m "$(date +%Y-%m-%d_%H:%M:%S)"
git push
export SHORT_COMMIT=$(git log -1 --pretty="%H" | cut -b -8)
export DOCKER_IMAGE_VERSION="dev_${SHORT_COMMIT}"

docker build -t djmarret1992/codigobm-autoregistro-qr:${DOCKER_IMAGE_VERSION} -f Dockerfile .
docker login -u "djmarret1992" -p "Tumadre1@" docker.io
docker tag djmarret1992/codigobm-autoregistro-qr:${DOCKER_IMAGE_VERSION} djmarret1992/codigobm-autoregistro-qr:latest
docker push djmarret1992/codigobm-autoregistro-qr:${DOCKER_IMAGE_VERSION}
docker push djmarret1992/codigobm-autoregistro-qr:latest
echo "tag: ${DOCKER_IMAGE_VERSION}"