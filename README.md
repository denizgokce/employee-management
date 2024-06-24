# NestJS Backend with Employee Module and Email Service

Welcome to the NestJS backend application that manages employee data with CRUD functionalities and integrates an email
service using a queue system.

## Features

- **Employee Module**:
    - Create, Read, Update, and Delete (CRUD) operations for managing employee data.
- **Email Service**:
    - Sends email notifications asynchronously using a queue system (Bull).
    - Example usage: Welcome emails for new employees.
- **GraphQL API**:
    - Provides a GraphQL API for flexible data fetching and manipulation.

## Setup

### Prerequisites

Ensure you have the following installed on your system:

- Node.js (v14.x or later)
- npm or yarn
- Redis server (for Bull queue)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your/repository.git
   cd repository

2. Install dependencies:

   `npm install`

### Configuration

1. Environment Variables:

   Create a `.env` file in the root directory with the following variables:

    ```dotenv
    JWT_SECRET=DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.
    JWT_EXPIRATION=30d
    
    MAIL_SERVER_HOST=smtp.example.com
    MAIL_SERVER_PORT=587
    MAIL_SERVER_AUTH_USER=user@example.com
    MAIL_SERVER_AUTH_PASS=password
    
    BULL_REDIS_HOST=localhost
    BULL_REDIS_PORT=6379
    ```

Adjust `DATABASE_URL` and other variables as per your environment setup.

2. Redis Configuration:

Ensure your Bull module configuration (`bull` in `app.module.ts`) matches your Redis server
configuration (`host`, `port`).

## Usage

### Running the Application

Start the application in development mode:

```bash
npm run start:dev
````
    
## GraphQL API

### Accessing the GraphQL Playground

To interact with the GraphQL API, access the GraphQL playground at `http://localhost:3015/graphql`.

## Authentication

The `AuthResolver` handles authentication-related GraphQL mutations, specifically the `login` mutation. This mutation allows users to log in by providing a username and password, returning an `AuthPayload` containing access and refresh tokens, username, email, and role.

Example `login` mutation:

```graphql
mutation {
    login(username: "user", password: "password") {
        access_token
        refresh_token
        username
        email
        role
    }
}
```

Since the resolvers are protected by the JwtAuthGuard, the JWT token needs to be included in every request.

### Queries
#### Retrieve All Employees

```graphql
   query {
      employees {
        id
        name
        email
        jobTitle
        department
        created
        updated
      }
    }
```
#### Retrieve a Single Employee

```graphql
   query {
    employee(id: "employee_id_here") {
        id
        name
        email
        jobTitle
        department
        created
        updated
    }
}
```
Replace "employee_id_here" with the actual ID of the employee you want to retrieve.
### Mutations
#### Create Employee

```graphql
   mutation {
    createEmployee(
        name: "John Doe"
        email: "john.doe@example.com"
        jobTitle: "Software Engineer"
        department: "Engineering"
    ) {
        id
        name
        email
        jobTitle
        department
        created
        updated
    }
}

```
#### Update Employee

```graphql
   mutation {
    updateEmployee(
        id: "employee_id_here"
        name: "Updated Name"
        email: "john.doe@example.com"
        jobTitle: "Updated Job Title"
        department: "Updated Department"
    ) {
        id
        name
        email
        jobTitle
        department
        created
        updated
    }
}
```
Replace "employee_id_here" with the ID of the employee you want to update.

#### Delete Employee

```graphql
mutation {
    deleteEmployee(id: "employee_id_here")
}
```
Replace "employee_id_here" with the ID of the employee you want to delete.



