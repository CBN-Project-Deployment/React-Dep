pipeline {
    agent any

    environment {
        GCP_PROJECT = 'di-gcp-351221'
        GCP_KEY_FILE = '/home/mrityunjaikumar_dwivedy/di-gcp-351221-5d28d91f767a.json'
        NODE_VERSION = '18'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Mrityunjai-demo/React-Dep.git'
            }
        }

        stage('Install Node.js dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to GCP App Engine') {
            steps {
                sh """
                gcloud auth activate-service-account --key-file=${GCP_KEY_FILE}
                gcloud config set project ${GCP_PROJECT}
                gcloud app deploy app.yaml --quiet
                """
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed.'
        }
    }
}
