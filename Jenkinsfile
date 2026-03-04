pipeline{
  agent any //Run this pipeline on any available Jenkins agent/node

  environment{
    // Defining reusable environment variables
    DOCKERHUB_USERNAME= "xtremed1"//Docker Hub Username
    IMAGE_NAME=  "my-survey"       //Name of Docker Image
    IMAGE_TAG=     "latest"    //Tag for Docker Image
    GITHUB_USERNAME= "extremed1" //GitHub Username
    GITHUB_REPO= "Assignment2-SWE645" //GitHub Repository Name

  }

  stages{
    stage('Checkout Code from GitHub'){
      steps{
        // Pulling the source code from my GitHub Repo
        git "https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO}.git"
      }
    }

    stage('Build Docker Image'){
      steps{
        script{
          // Build Docker image using Dockerfile in the repo
          //and store the resulting image object in 'dockerImage' variable
          dockerImage = docker.build("${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}")
        }
        
      }
    }

    stage('Push Docker Image to Docker Hub'){
      steps{
        script{
          // Log in to Docker Hub using credentials stored in Jenkins
          docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-creds') {
            // Push the built image to Docker Hub
            dockerImage.push("${IMAGE_TAG}")
          }
        }
      }
    }

    stage('Update Kubernetes Cluster with New Image'){
      steps{
        script{
          //Shell block to:
          //1. Set the new image for the Kubernetes deployment (replacing placeholder image name in deployment.yaml with the new image name)
          //2. Apply the updated deployment configuration to the Kubernetes cluster using kubectl
          //3. Apply the service configuration to ensure the application is accessible
          sh """
          sed -i 's|${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}|${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}|' k8s/deployment.yaml
          kubectl apply -f k8s/deployment.yaml --validate=false
          kubectl apply -f k8s/service.yaml --validate=false
          """
        }
      }
    }
  }

  post{
    //Actions run after the pipeline execution
    success{
      echo 'Deployment successful! The new Docker image has been pushed to Docker Hub and the Kubernetes cluster has been updated.'
    }
    failure{
      echo 'Deployment failed. Please check the Jenkins logs for more details.'
    }
  }
}