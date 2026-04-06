pipeline {
    agent any

    options {
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Backend') {
            steps {
                dir('backend') {
                    sh 'npm ci --include=dev'
                }
            }
        }

        stage('Install Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm ci --include=dev'
                }
            }
        }

        stage('Lint Frontend') {
            steps {
                dir('frontend') {
                    sh 'npx eslint .'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'NODE_ENV=production npm run build'
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'frontend/dist/**', allowEmptyArchive: true
        }
    }
}