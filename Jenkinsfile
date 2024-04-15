pipeline {
    agent any

    environment {
        NODE_VERSION = '21.7.3'
    }

    tools {
        nodejs 'Node.js 21.7.3'
    }

    parameters {
        choice(name: 'TYPE', choices: ['api', 'e2e'], description: 'Choose test type')
    }

    options {
        ansiColor('xterm')
    }

    stages {

        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm install cypress --save-dev'
                sh 'npm install allure-commandline --save-dev'
                sh 'npm install mocha-allure-reporter --save-dev'
            }
        }

        stage('Run tests') {
            steps {
                sh "npm run test:${TYPE}"
            }
        }

        stage('Generate Allure report') {
            steps {
                sh '/Users/moleinic/.nvm/versions/node/v21.7.3/bin/allure generate allure-results --clean -o allure-report'
                allure([
                    includeProperties: false,
                    jdk: '',
                    results: [[path: './allure-results']]
                ])
            }
        }

        stage('Send Email Notification') {
            steps {
                emailext (
                    subject: "Test Results",
                    body: "Test results are attached.",
                    attachLog: true,
                    to: "moleinic@griddynamics.com"
                )
            }
            post {
                always {
                    sh 'npm run clean:report'
                }
            }
        }
    }

    triggers {
        cron('H 13 * * *') 
    }
}

