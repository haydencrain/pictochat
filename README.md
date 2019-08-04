This repository contains the Project for Assessment 3 of 31242 Advanced Internet

## Development Environment Setup
### Install the following dependencies:
* Docker

### Setup Steps
1. (For Docker Toolbox) Ensure that the default machine is running.

2. (For Docker Toolbox) Check the default machine ip using: 

    `$ docker-machine ip`

2. Start the application and related containers with:

    `$ docker-compose -f docker-compose.dev.yml up --build`

Web services exposed by each container will be available at \<docker-machine ip\>:\<port\>