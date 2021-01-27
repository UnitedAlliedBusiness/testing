def kubemanager_registry_ip = "10.10.20.11"
pipeline {
     agent any
     environment {
        HOME = '.'
      }
     stages {
        stage('Setting'){
              container('cd-tools'){
                    sh """
                    # Setting sangfor registry private certificates
                    # Setting sangfor kubemanager registry ip
                    mkdir -p /etc/docker/cert.d/$kubemanager_registry_ip
                    wget --no-check-certificate -q -O- https://$kubemanager_registry_ip/api/systeminfo/getcert >\
                    /etc/docker/certs.d/$kubemanager_registry_ip/ca.crt
                    """
              }
        }
        stage("Build") {
            steps {
                sh "sudo npm install"
                sh "sudo npm run build"
            }
        }
    }
}
