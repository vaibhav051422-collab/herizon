pipeline {
    agent any

    options {
        timestamps()
    }

    environment {
        NODE_ENV = 'production'
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
                    script {
                        if (isUnix()) {
                            sh 'npm ci'
                        } else {
                            bat 'npm ci'
                        }
                    }
                }
            }
        }

        stage('Install Frontend') {
            steps {
                dir('frontend') {
                    script {
                        if (isUnix()) {
                            sh 'npm ci'
                        } else {
                            bat 'npm ci'
                        }
                    }
                }
            }
        }

        stage('Lint Frontend') {
            steps {
                dir('frontend') {
                    script {
                        if (isUnix()) {
                            sh 'npm run lint'
                        } else {
                            bat 'npm run lint'
                        }
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    script {
                        if (isUnix()) {
                            sh 'npm run build'
                        } else {
                            bat 'npm run build'
                        }
                    }
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