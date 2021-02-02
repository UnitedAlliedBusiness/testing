def kubemanager_ip = "10.10.20.10"
def kubemanager_registry_ip = "10.10.20.11"
def kubemanager_token = "token-tjxjv:j7r8q2d2q7xfdfdmwn5zbt9kkcsktl5xc2tkv4lz9l627gffnh8htg"
def kubemanager_project = "c-7cxkm:p-4zlsv"
podTemplate(containers: [
    containerTemplate(name: 'docker', image: 'docker:20.10.2', ttyEnabled: true, command: 'cat'),
    containerTemplate(name: 'docker-daemon', image: 'registry.sangfor.com/apps/docker:20.10.2-dind', ttyEnabled: true, command: 'cat', privileged: false),
    containerTemplate(name: 'cd-tools', image: 'registry.sangfor.com/apps/kubemanager-cd:sangfor', ttyEnabled: true, command: 'cat', alwaysPullImage: true)
  ],
  volumes: [hostPathVolume(hostPath: '/var/run/docker.sock', mountPath: '/var/run/docker.sock'),
  hostPathVolume(hostPath: '/var/run/docker.sock', mountPath: '/var/run/docker.sock'),
  emptyDirVolume(mountPath: '/etc/docker/certs.d', memory: true),
  ]) {
      node(POD_LABEL){
          stage('Clone'){
              container('jnlp'){
                    sh """
                    git branch master      // 在本地git仓库创建分支 
                    git checkout master   // 切换到该分支
                    git branch --set-upstream-to=origin/master
                    git clone -b modify-repo-url https://github.com/UnitedAlliedBusiness/testing.git /home/jenkins/agent/workspace/kwsp
                    """
              }
          }
          stage('Setting'){
              container('cd-tools'){
                    sh """
                    # Setting sangfor registry private certificates
                    # Setting sangfor kubemanager registry ip
                    mkdir -p /etc/docker/cert.d/$kubemanager_registry_ip
                    cd /etc/docker/cert.d/$kubemanager_registry_ip
                    wget --no-check-certificate https://$kubemanager_registry_ip/api/systeminfo/getcert > /etc/docker/cert.d/$kubemanager_registry_ip/ca.crt
                    ls
                    """
              }
          }
          stage('Build'){
              container('docker'){
                    sh """
                    docker version 
                    export DOCKER_BUILDKIT=0
                    docker version -f '{{.Server.Experimental}}'
                    docker build -t $kubemanager_registry_ip/testing/kwsp:latest /home/jenkins/agent/workspace/kwsp/stable/alpine
                    """
              }
          }
          stage('Publish'){
              container('docker'){
                    sh """
                    docker logout
                    docker login -u secure365 -p @Demo123 $kubemanager_registry_ip
                    docker push $kubemanager_registry_ip/testing/kwsp:latest
                    """
              }
          }
          stage('Deploy'){
              container('cd-tools'){
                    sh """
                    kubemanager login https://$kubemanager_ip --skip-verify --token $kubemanager_token --context $kubemanager_project
                    if ! kubemanager kubectl get namespace devops; then 
                        kubemanager kubectl create namespace devops
                    fi
                    # rollout updates
                    kubemanager kubectl get deployments
                    if ! kubemanager kubectl get deploy nginx; then 
                        kubemanager kubectl create deployment nginx --image=$kubemanager_registry_ip/testing/nginx-devops:latest
                    else 
                        kubemanager kubectl rollout restart deployment/nginx
                    fi
                    # expose services
                    if ! kubemanager kubectl get service nginx-http; then
                        kubemanager kubectl expose deployment nginx --port=80 --target-port=80 --name=nginx-http
                    fi
                    kubemanager kubectl wait --for=condition=available --timeout=600s deployment/nginx
                    """
              }
          }
      }
  }
