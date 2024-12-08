pipeline {
    agent any
    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/Zubovdns/theWitcherShopServer'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        }
        stage('Build Artifact') {
            steps {
                sh '7z a build.zip ./src/*'
            }
        }
    }
    post {
        always {
            echo 'Pipeline completed'
        }
        success {
            echo 'Build succeeded'
        }
        failure {
            echo 'Build failed'
        }
    }
