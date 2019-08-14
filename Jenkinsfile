podTemplate(label: 'blockchain-utils', containers: [
  containerTemplate(name: 'docker', image: 'docker', ttyEnabled: true, command: 'cat', envVars: [
    envVar(key: 'DOCKER_HOST', value: 'tcp://docker-host-docker-host:2375')
  ])
]) {
  node('blockchain-utils') {
    stage('Run Tests') {
      container('docker') {
        def scmVars = checkout scm

        sh "docker build -t blockchain-utils-test:${scmVars.GIT_COMMIT} ."
        sh "docker run --rm -t blockchain-utils-test:${scmVars.GIT_COMMIT} npm run test"
      }
    }
  }
}
