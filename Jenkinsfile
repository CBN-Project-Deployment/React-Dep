pipeline {
    agent any

    environment {
        GCP_PROJECT = 'di-gcp-351221'
        NODE_VERSION = '24.8.0'
    }

    stages {
        stage('Get App code from git') {
            steps {
                git branch: 'main', url: 'https://github.com/Mrityunjai-demo/React-Dep.git'
            }
        }

        stage('Build React App') {
            steps {
                sh 'CI=false npm run build'
            }
        }

        stage('Deploy to GCP App Engine') {
            steps {
                sh """
                  gcloud app deploy app.yaml
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
