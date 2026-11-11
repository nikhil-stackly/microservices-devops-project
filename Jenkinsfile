pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {
        stage('Source Checkout') {
            steps {
                echo 'Checking out source code'
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
                    docker build -t user-service:${BUILD_NUMBER} ./user-service
                    docker build -t product-service:${BUILD_NUMBER} ./product-service
                    docker build -t order-service:${BUILD_NUMBER} ./order-service

                    docker tag user-service:${BUILD_NUMBER} user-service:latest
                    docker tag product-service:${BUILD_NUMBER} product-service:latest
                    docker tag order-service:${BUILD_NUMBER} order-service:latest
                '''
            }
        }

        stage('Test Microservices') {
            steps {
                sh '''
                    set -eu

                    docker run -d --name ci-user-${BUILD_NUMBER} \
                      -p 127.0.0.1:13001:3001 user-service:${BUILD_NUMBER}

                    docker run -d --name ci-product-${BUILD_NUMBER} \
                      -p 127.0.0.1:13002:3002 product-service:${BUILD_NUMBER}

                    docker run -d --name ci-order-${BUILD_NUMBER} \
                      -p 127.0.0.1:13003:3003 order-service:${BUILD_NUMBER}

                    curl --fail --silent --show-error \
                      --retry 15 --retry-all-errors --retry-delay 2 \
                      http://127.0.0.1:13001/health

                    curl --fail --silent --show-error \
                      --retry 15 --retry-all-errors --retry-delay 2 \
                      http://127.0.0.1:13002/health

                    curl --fail --silent --show-error \
                      --retry 15 --retry-all-errors --retry-delay 2 \
                      http://127.0.0.1:13003/health
                '''
            }
        }
    }

    post {
        always {
            sh '''
                docker rm -f ci-user-${BUILD_NUMBER} \
                  ci-product-${BUILD_NUMBER} \
                  ci-order-${BUILD_NUMBER} 2>/dev/null || true
            '''
        }

        success {
            echo 'CI pipeline completed successfully'
        }

        failure {
            echo 'CI pipeline failed. Check the console output.'
        }
    }
}
