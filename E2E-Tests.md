### Running E2E Tests
1. Start the application by running:
    `npm run start-dev-docker`
2. In another terminal set the PICTOCHAT_FRONTEND_URL_ROOT so that the tests know how to connect to the application by running:
    `$ export PICTOCHAT_FRONTEND_URL_ROOT=http://$(docker-machine ip):443/`
    `$ export PICTOCHAT_API_ROOT=http://$(docker-machine ip):443/api`
3. In the same terminal as step 2, run the following to execute the tests:
    `$ npm run test`