pipeline {
    agent {
        dockerfile {
            filename 'Dockerfile'
            dir 'jenkins/'
            label 'agent && linux'
            args '''
                -v /var/lib/package-cache/.npm:/.npm:rw,z
            '''
        }
    }
    parameters {
       string(name: 'GIT_COMMIT_SHA', description: 'The commit that will be deployed', trim:true)
    }
    environment {
        NODE_ENV = "staging"
        GIT_TRUNK_BRANCH = "master"
        S3_BUCKET = "vtx-cloudfront-stage"
        S3_REGION_KEY = "us-east-1"
    }
    options {
        buildDiscarder(logRotator(numToKeepStr: '100', artifactNumToKeepStr: '20'))
        timestamps()
        timeout(time: 20, unit: 'MINUTES')
        parallelsAlwaysFailFast()
    }
    stages {
        stage('Git Checkout') {
            steps {
                sh "git checkout ${GIT_COMMIT_SHA}; echo Git checkout return code: \$?"
            }
        }
        stage('Install dependencies') {
            steps {
                sh "npm ci"
                sh "npx cypress install"
            }
        }
        stage('Test') {
            steps {
                sh 'npm run test'
            }
        }
        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }
        stage('Cypress mocked API tests') {
            parallel {
                stage('Start local server') {
                    steps {
                        sh returnStatus: true, script: "npm run start:test"
                    }
                }
                stage('Run Cypress tests') {
                    steps {
                        sh 'npm run wait'
                        sh 'npm run cypress:run'
                        sh 'killall node'
                    }
                }
            }
        }
        stage('Cypress E2E tests') {
            parallel {
                stage('Start local server') {
                    steps {
                        sh returnStatus: true, script: "npm run start:${NODE_ENV}"
                    }
                }
                stage('Run Cypress tests') {
                    steps {
                        sh 'npm run wait'
                        sh 'npm run cypress:run:e2e'
                        sh 'killall node'
                    }
                }
            }
        }
        stage('Build') {
            steps {
                sh "npm run build:${NODE_ENV}"
            }
        }
        stage('Deploy') {
            steps {
                script {
                    echo "Current workspace is ${env.WORKSPACE}"
                    println "env.GIT_COMMIT=${env.GIT_COMMIT}"
                    println "S3_BUCKET=${S3_BUCKET}"
                    sh "export ${NODE_ENV}"
                    sh "printenv NODE_ENV"

                    withCredentials([usernamePassword(credentialsId: 'cicd-platform-ui-imd-credentials', passwordVariable: 'IMD_PASSWORD', usernameVariable: 'IMD_USERNAME')]) {
                        def deployScript = """npm_config_registry=https://binrepo.vtxdev.net/artifactory/api/npm/vtx-ui npx @vertexinc/vtx-ui-tools-deployment deployMicroFrontend --gitCommitSha=${env.GIT_COMMIT} --importMapUsername=${IMD_USERNAME} --importMapPassword=${IMD_PASSWORD} --s3BucketName=${S3_BUCKET}""";
                        def status = sh(returnStatus: true, script: "${deployScript} > deployment_log.txt")
                        def output = readFile('deployment_log.txt').trim()
                        println output
                        println "========== Status Code: ${status} ================"
                        if (status != 0) {
                            println "FAILED. Look above the logs to see the source of the error"
                            currentBuild.result = 'FAILED'
                        }
                    }
                }
            }
        }
    }
    post {
        always {
            echo "Job completed"
        }
    }
}