This repository contains the Project for Assessment 3 of 31242 Advanced Internet

# Development Environment Setup
## Install the following dependencies:
* Docker

## Setup Steps
1. (For Docker Toolbox) Ensure that the default machine is running.

2. (For Docker Toolbox) Check the default machine ip using: 

    `$ docker-machine ip`

3. Start the application and related containers the first time with:

    `$ docker-compose -f docker-compose.dev.yml up --build`

    On subsequent runs, the containers can be spun up without being rebuilt by removing the --build option, i.e.

    `$ docker-compose -f docker-compose.dev.yml up`

Web services exposed by each container will be available at:
* \<docker-machine ip\>:\<port\> , on Window hosts
* localhost:\<port\>, on Mac and Linux hosts

_Note that containers will need to be rebuilt after any change which alters the output of the setup steps performed in the build-scripts/* docker files (e.g. adding a new npm dependency). You may find it helpful to rebuild the containers after merging code from other developers._

## Accessing a running pictochat-db database container
1. The database container will be started along with the rest of the application then running
    `$ docker-compose -f docker-compose.dev.yml up`
    Or, to start only the database container, run
    `$ docker-compose -f docker-compose.dev.yml up pictochat-db`
2. One pictochat_pictochat-db container is running, the postgres database will exposed on <docker machine ip>:5432,
    The container provides a default user with username: postgres and password: postgres