pipeline {
     agent any
     environment {
        HOME = '.'
      }
     stages {
        stage("Build") {
            steps {
                sh "sudo npm install"
                sh "sudo npm run build"
            }
        }
    }
}
