pipeline {
    agent any

    stages {
        stage('Source Checkout') {
            steps {
                echo 'Checking source code'
                checkout scm
            }
        }

        stage('Repository Validation') {
            steps {
                sh 'pwd'
                sh 'ls -la'
                sh 'git status'
            }
        }

        stage('Build Status') {
            steps {
                echo 'Initial CI pipeline executed successfully'
            }
        }
    }
}
