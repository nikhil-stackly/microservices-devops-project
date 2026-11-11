pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {
        stage('Source Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Repository Validation') {
            steps {
                sh '''
                    pwd
                    ls -la
                    git status
                '''
            }
        }

        stage('Docker Compose Validation') {
            steps {
                sh 'docker compose -f docker-compose.yml config -q'
                echo 'Docker Compose configuration is valid'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                    set -e

                    docker build -t user-service:${BUILD_NUMBER} ./user-service
                    docker build -t product-service:${BUILD_NUMBER} ./product-service
                    docker build -t order-service:${BUILD_NUMBER} ./order-service
                '''
            }
        }

        stage('Test Microservices') {
            steps {
                sh '''
                    set -eu

                    cleanup() {
                        docker rm -f ci-user-${BUILD_NUMBER} ci-product-${BUILD_NUMBER} ci-order-${BUILD_NUMBER} 2>/dev/null || true
                    }
                    trap cleanup EXIT

                    docker run -d --name ci-user-${BUILD_NUMBER} -p 127.0.0.1:13001:3001 user-service:${BUILD_NUMBER}
                    docker run -d --name ci-product-${BUILD_NUMBER} -p 127.0.0.1:13002:3002 product-service:${BUILD_NUMBER}
                    docker run -d --name ci-order-${BUILD_NUMBER} -p 127.0.0.1:13003:3003 order-service:${BUILD_NUMBER}

                    curl --fail --silent --show-error --retry 15 --retry-all-errors --retry-delay 2 http://127.0.0.1:13001/health
                    curl --fail --silent --show-error --retry 15 --retry-all-errors --retry-delay 2 http://127.0.0.1:13002/health
                    curl --fail --silent --show-error --retry 15 --retry-all-errors --retry-delay 2 http://127.0.0.1:13003/health
                '''
            }
        }

        stage('Push Images to AWS ECR') {
            steps {
                sh '''
                    set -e

                    REGISTRY="047106156365.dkr.ecr.us-east-1.amazonaws.com"

                    aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin "$REGISTRY"

                    for service in user-service product-service order-service
                    do
                        docker tag ${service}:${BUILD_NUMBER} ${REGISTRY}/${service}:${BUILD_NUMBER}
                        docker push ${REGISTRY}/${service}:${BUILD_NUMBER}
                    done
                '''
            }
        }
    }

    post {
        success {
            echo 'CI/CD image build, testing and ECR push completed successfully'
        }

        failure {
            echo 'Pipeline failed. Check the Jenkins console output.'
        }
    }
}
