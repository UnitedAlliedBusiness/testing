pipeline {
    agent any 
    stages {
        stage('Stage 1') {
            steps {
                sh """
                git config --global user.email "zw.leow@unitedalliedbusiness.com"
                git config --global user.name "zw-leow"
                """
                echo 'Hello world!' 
            }
        }
    }
}
