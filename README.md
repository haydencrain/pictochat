# Pictochat

This repository contains the Project for Assessment 3 of 31242 Advanced Internet Programming

## Links

- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [Design Principles](#design-principles)
- [Contributors](#contributors)

## Project Structure

The application is split up into two main areas:

- `pictochat-fe`, which serves the front-end part of the application,
- `pictochat-be`, which servers the back-end api of the application, and provides access to the database.

### Pictochat Front End

#### Directory structure

```
src
  │   index.tsx     # React App entry point
  └───components    # React components / View Logic
  └───hooks         # Custom React Hooks
  └───images        # Images used in the app
  └───models        # TypeScript Models and Interfaces
  └───pages         # React components that are mapped to routes
  └───services      # Services for Api Requests
  └───styles        # global styles and constants
  └───store         # (IN PROGRESS) Mobx stores
  └───utils         # Helper functions and methods
```

#### Architectural Layers

- View Layer
  - **Purpose:** Presentation, handling user input
  - **What’s in it:** React components
- Store Layer
  - **Purpose:** Data stores, application state
  - **What’s in it:** Mobx stores and classes
- Service Layer:
  - **Purpose:** Communicating with external services (e.g. the API), hiding the details of those services from the rest of the front-end
  - **What’s in it:** Service classes

### Pictochat Back End

#### Directory Structure

```
src
  │   app.ts        # App entry point and setup
  └───middleware    # Middleware methods and functions
  └───models        # ORM/db Models and classes
  └───routes        # HTTP RESTful endpoints
  └───services      # Business logic
  └───utls          # Helper functions and methods
```

#### Architectural Layers

- Route/Presentation Layer
  - **Purpose:** Respond to HTTP requests, Send data to clients
  - **What’s in it:** Express Routers, middleware (e.g. passport)
- Service Layer
  - **Purpose:**
    - Classes that implement domain/business logic within the API
    - Services can delegate logic to model classes (part of the data access layer)
  - **What’s in it:** Service classes
- Data access Layer
  - **Purpose:**
    - Encapsulates the details for the database, implements data structures for our domain/business data.
    - In special cases, can implement functions/methods which perform domain/business logic for the service layer (e.g. if some operations are much faster when performed with raw SQL queries).
  - **What’s in it:** ORM Models (i.e. Sequelize models), and custom classes which implement database views

## Environment Setup

### Prerequisites

- Docker

### Setup Steps

1. (For Docker Toolbox) Ensure that the default machine is running.

2. (For Docker Toolbox) Check the default machine ip using:

   `$ docker-machine ip`

3. Start the application and related containers the first time with:

   `$ docker-compose -f docker-compose.dev.yml up --build`

   On subsequent runs, the containers can be spun up without being rebuilt by removing the --build option, i.e.

   `$ docker-compose -f docker-compose.dev.yml up`

Web services exposed by each container will be available at:

- \<docker-machine ip\>:\<port\> , on Window hosts
- localhost:\<port\>, on Mac and Linux hosts

_Note that containers will need to be rebuilt after any change which alters the output of the setup steps performed in the build-scripts/\* docker files (e.g. adding a new npm dependency). You may find it helpful to rebuild the containers after merging code from other developers._

### Accessing a running pictochat-db database container

1. The database container will be started along with the rest of the application then running
   `$ docker-compose -f docker-compose.dev.yml up`
   Or, to start only the database container, run
   `$ docker-compose -f docker-compose.dev.yml up pictochat-db`
2. One pictochat_pictochat-db container is running, the postgres database will exposed on <docker machine ip>:5432,
   The container provides a default user with username: postgres and password: postgres

## Design Principles

There are many ways to write web applications. However, it is important to create a unified approach in order to enhance readability and reusability. We have compiled a list of 'best practices' that we wish to follow and enforce within our project.

As this project is almost purely JavaScript, many of the best practices chosen take inspiration from [Airbnb's JavaScript Style Guide](https://github.com/airbnb/javascript).

1. Return Promises instead of using callbacks for asynchronous functions.
1. Use `aync` / `await` syntax rather than `Promise.then(...)` and `.catch(...)` within functions that return a Promise.
1. All API endpoints must be exposed under `/api/`.
1. Following RESTful conventions, API endpoints must be nouns; named after entities (e.g. `/api/discussion-thread`, `/api/user`, `/api/image`).
1. All file and folders names in backend must be lowercase with dashes separating words (e.g. `discussion-post.ts`).
1. Excluding React components, classes/modules that implement well-defined roles (e.g. Service, Router, Middleware) should include the role in their name (e.g. The discussion service should be called `DiscussionService`).
1. React components should be placed inside PascalCase directories matching the name of the corresponding tsx/jsx tag. These directories should contain:
   - `index.tsx` - exports the component by default.
   - `[component implementation file].tsx` - one or more files implementing the component.
   - `[component name].less` - component specific LESS styles.
1. Strings should be enclosed with single quotation marks.

   ```JS
   // good
   const str = ‘hello world’;

   // bad
   const str = "hello world";
   ```

1. HTML attribute strings should be enclosed with double quotation marks.

   ```HTML
   // good
   <div className=”hello-world” />

   // bad
   <div className='hello-world' />
   ```

1. Use the literal syntax for creation of data types.

   ```JS
   // good
   let obj = {};
   let arr = [];

   // bad
   let obj = new Object();
   let arr = new Array();
   ```

1. Use template strings instead of concatenation.

   ```JS
   let userName = 'doss';

   // good
   let str = `hello ${userName}!`;

   // bad
   let str = ‘hello’ + ‘ ‘ + userName + ‘!’;
   ```

1. Use arrow function for callbacks.

   ```JS
   // good
   [1,2,3].map((x) => x + 1));

   // bad
   [1,2,3].map(function(x) { return x + 1; }));
   ```

1. Always use `let` or `const` for variable declarations instead of `var`.
1. Dont variable chain when declaring values `let = a, b, c;`.
1. Use `// TODO:` to annotate solutions to problems, and `// FIXME:` to annotate parts of the code that need to be fixed.
1. Don't use multiple blank lines to pad your code.
1. Use semicolons after all statements, in order to avoid the use of [Automatic Code Insertion](https://tc39.es/ecma262/#sec-automatic-semicolon-insertion).

## Contributors

- Jordan Finch
- Hayden Crain
- Rachel Coster
