pipeline {
  agent any

  environment {
    GCP_PROJECT = 'di-gcp-351221'
    NODE_VERSION = '24.8.0'
  }

  stages {
    stage('get app from git') {
      steps {
        git branch: 'main', url: 'https://github.com/Mrityunjai-demo/React-Dep.git'
      }
    }

    stage('Build React App') {
      steps {
        sh 'CI=false npm run build'
      }
    }

    stage('Deploy App') {
      steps {
        sh """
        gcloud auth activate-service-account --key-file=${GCP_KEY_FILE}
        gcloud config set project ${GCP_PROJECT}
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
