node {
echo 'building....'
echo "Running your service with environemnt ${env.BRANCH_NAME} now (Build Number: ${env.BUILD_NUMBER})"
script {
  // dev branch
    if (env.BRANCH_NAME == 'dev'){
    def remote = [:]
    remote.name = "node-1"
    remote.host = "10.8.18.18"
    remote.user = "rakhats"
    remote.allowAnyHosts = true

    withCredentials([sshUserPrivateKey(credentialsId: 'rakhats-local', keyFileVariable: 'identity', passphraseVariable: '')]) {
      remote.identityFile = identity
      stage("deployment") {
        sshCommand remote: remote, command: '''
         #!/bin/bash
        . ~/.nvm/nvm.sh && nvm use 16.14.0
        cd /home/rakhats/peplink-bea
        git reset --hard
        git pull
        git checkout dev
        git pull
        rm -rf .next
        rm -rf node_modules
        yarn install --silent
        yarn build:dev      
        pm2 stop peplink-bea
        pm2 delete peplink-bea
        pm2 start pm2.config_dev.json
        pm2 save
        pm2 list
        '''
        }
      }
    }
  }
}
 