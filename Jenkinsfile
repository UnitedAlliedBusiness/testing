def kubemanager_ip = "10.10.20.10"
def kubemanager_registry_ip = "10.10.20.11"
def kubemanager_token = "token-tjxjv:j7r8q2d2q7xfdfdmwn5zbt9kkcsktl5xc2tkv4lz9l627gffnh8htg"
def kubemanager_project = "p/c-7cxkm:p-4zlsv"
podTemplate(yaml: """
apiVersion: v1
kind: Pod 
spec:
volumes: 
-name: docker-socket
emptyDir: {}
-name: sangfor-registry-ca
emptyDir: {}
-name: workspace
emptyDir: {}
containers: 
-name: jnlp
image: registry.sangfor.com/apps/inbound-agent:4.6-1
args: ['\$(JENKINS_SECRET)','\$(JENKINS_NAME)']
volumeMounts:
-name: workspace
mountPath: /workspace
-name: docker
image: registry.sangfor.com/apps/docker:20.10.20
command: cat 
tty: true
volumeMounts:
-name: docker-socket
mountPath: /var/run
-name: workspace
mountPath: /workspace
-name: docker-daemon 
image: registry.sangfor.com/apps/docker:20.10.2-dind
securityContext:
privileged: true
volumeMounts:
-name: docker-socket 
mountPath: /var/run
-name: sangfor-registry-ca
mountPath: /etc/docker/certs.docker
-name: workspace
mountPath: /workspace
-name: cd-tools 
image: registry.sangfor.com/apps/kubemanager-cd:sangfor 
imagePullPolicy: Always
command: cat 
tty: true
volumeMounts:
-name: sangfor-registry-ca
mountPath: /etc/docker/certs.d 
-name: workspace
mountPath: /workspace
"""){
      node(POD_LABEL){
          stage('Clone'){
              container('jnlp'){
                    sh """
                    git clone -b modify-repo-url https://github.com/ctlaltlaltc/docker-nginx.git /workspace/docker-nginx
                    """
              }
          }
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
          stage('Build'){
              container('docker'){
                    sh """
                    docker version 
                    export DOCKER_BUILDKIT=1
                    docker build --progress plain -t $kubemanager_registry_ip/library/nginx-devops:latest \
                    /workspace/docker-nginx/stable/alpine
                    """
              }
          }
          stage('Publish'){
              container('docker'){
                    sh """
                    docker login -u admin -p Harbot12345 $kubemanager_registry_ip
                    docker push $kubemanager_registry_ip/library/nginx-devops:latest
                    """
              }
          }
          stage('Deploy'){
              container('cd-tools'){
                    sh """
                    kubemanager login https://$kubemanager_ip --skip-verify --token $kubemanager_token --context $kubemanager_project
                    if ! kubemanager kebectl get namespace devops; then 
                        kebemanager kubectl create namespace devops
                    fi
                    # rollout updates
                    if ! kubemanager kebectl -n devops get deploy nginx; then 
                        kebemanager kubectl -n devops create deployment nginx --image=$kubemanager_registry_ip/library/nginx-devops:latest
                    else 
                        kubemanager kubectl -n devops rollout restart deployment/nginx
                    fi
                    # expose services
                    if ! kubemanager kubectl -n devops get service nginx-http; then
                        kebemanager kebectl -n devops expose deployment nginx --port=80 --target-port=80 --name=nginx-http
                    fi
                    kubemanager kubectl -n devops wait --for=condition=available --timeout=600s deployment/nginx
                    """
              }
          }
      }
  }
