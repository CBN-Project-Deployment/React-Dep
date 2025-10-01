pipeline {
    agent any

    environment {
        version = '1'
    }

    stages {
        stage('Get App code from git') {
            steps {
                git branch: 'main', url: 'https://github.com/Mrityunjai-demo/React-Dep.git'
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                sh 'CI=false npm run build'
            }
        }

        stage('Deploy to GCP App Engine') {
            steps {
                sh '''
                  currentVersion=`gcloud app versions list --sort-by=~version.createTime --limit=1 --format="value(version.id)" | sed "s/v//"`
                  version=`expr ${currentVersion} + 1`
                  gcloud app deploy app.yaml --version=v${version}
				  gcloud app deploy dispatch.yaml
                '''
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