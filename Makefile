IMG=quay.io/mohamedf0/form-agent
TAG=latest

docker-build:
	docker build --platform linux/amd64,linux/arm64 -t ${IMG}:${TAG} .

docker-push:
	docker push ${IMG}:${TAG}