# Blog Api

## Project Overview

This project is a Node.js-based blog API built with Express, Prisma, and
Passport.js, designed for managing users, posts, and comments. It provides
functionalities such as user authentication, CRUD operations for posts, and
comment management.

## Key Features & Benefits

- **User Authentication:** Secure user registration and authentication via
  Passport.js with local strategy.
- **CRUD Operations for Posts:** Create, read, update, and delete blog posts.
- **Comment Management:** Add, retrieve, and manage comments on blog posts.
- **Database Management:** Uses Prisma for efficient database access and
  management with PostgreSQL (or configured database).
- **API Structure:** Well-structured controllers and utils for maintainability
  and scalability.

## Prerequisites & Dependencies

Before you begin, ensure you have the following installed:

- **Node.js:** Version 16 or higher is recommended.
- **npm:** Node Package Manager (usually comes with Node.js).
- **PostgreSQL:** A running instance of PostgreSQL database.
- **Prisma CLI:** Required for database migrations and management.

## Installation & Setup Instructions

Follow these steps to set up the project:

1. **Clone the repository:**

   ```bash
   git clone <repository_url>
   cd blogapi
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Set up Environment Variables:**

   Create a `.env` file in the root directory with the following variables:

   ```
   DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>?schema=public"
   JWT_SECRET="your_secret_key"  # Replace with a strong, random secret key
   PORT=3000 # (Optional) Define the port the server will run on. Defaults to 3000
   ```

   Replace `<user>`, `<password>`, `<host>`, `<port>`, and `<database>` with
   your PostgreSQL database credentials. Make sure you set a strong JWT secret.

4. **Run Prisma Migrations:**

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Generate Prisma Client:**

   ```bash
   npx prisma generate
   ```

6. **Seed the database (optional):**

   ```bash
   node config/seed.js
   ```

7. **Start the server:**

   ```bash
   npm start
   ```

## Usage Examples & API Documentation

### Authentication Endpoints

- **`POST /auth/register`**: Register a new user. Requires `username`,
  `password`, `firstname`, `lastname`, and `email` in the request body.
- **`POST /auth/login`**: Authenticate a user. Requires `username` and
  `password` in the request body. JSON replies with a valid JWD (e.g.,
  `Authorization: Bearer <token>`).

### Posts Endpoints

- **`GET /posts`**: Retrieve all posts with comments and replies to comments.
- **`GET /posts/:id`**: Retrieve a single post by ID.
- **`POST /posts`**: Create a new post. Requires an authenticated user and a
  request body containing `title` and `content`.
- **`PUT /posts/:id`**: Update an existing post by ID. Requires an authenticated
  user and a request body containing the updated data.
- **`DELETE /posts/:id`**: Delete a post by ID. Requires an authenticated user.

(Authenticated routes require a valid JWT in the `Authorization` header (e.g.,
`Authorization: Bearer <token>`).)

### Comments Endpoints

- **`GET /posts/:postId/comments`**: Retrieve all comments for a specific post.
- **`POST /posts/:postId/comments`**: Add a new comment to a post. Requires an
  authenticated user and the comment `content` in the request body.
- **`PUT /posts/:postId/comments/:id`**: Update an existing comment by ID.
  Requires an authenticated user and a request body containing the updated data.
- **`DELETE /posts/:postId/comments/:id`**: Delete a comment by ID. Requires an
  authenticated user.

(Authenticated routes require a valid JWT in the `Authorization` header (e.g.,
`Authorization: Bearer <token>`).)

### Example: Creating a Post

```javascript
// Sample request body for creating a post
{
  "title": "My First Post",
  "content": "This is the content of my first blog post.",
  "published": true
}
```

Send a `POST` request to `/posts` with the above JSON body and an
`Authorization` header containing a valid JWT.

## Configuration Options

- **`DATABASE_URL`**: The connection string for the PostgreSQL database. Defined
  in the `.env` file.
- **`JWT_SECRET`**: The secret key used for signing JWTs. Crucial for security.
  Defined in the `.env` file.
- **`PORT`**: The port on which the server runs. Defaults to 3000 if not set in
  the `.env` file.

## Contributing Guidelines

We welcome contributions! To contribute to this project:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your fork.
5.  Submit a pull request to the main branch of the original repository.

Please ensure your code adheres to the project's coding standards.

## Acknowledgments

- This project uses the `@faker-js/faker` library for generating seed data.
- Thanks to the Prisma team for their excellent ORM.
- Thanks to the Passport.js team for their flexible authentication middleware.
- Built as part of the excellent Odin Project Curriculm
