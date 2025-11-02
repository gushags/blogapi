# Blog Api

## Project Overview

A Node.js blog API built with Express, Prisma, and Passport.js. Provides secure
user authentication, admin authorization, and full CRUD functionality for users,
posts, and comments.

## Key Features & Benefits

- **User Authentication:** Register and log in securely via Passport.js (local
  strategy).
- **Posts and Comments:** Create, read, update, and delete posts and comments.
- **Database Management:** Uses Prisma for efficient database access and
  management with PostgreSQL (or configured database).
- **API Structure:** Well-structured controllers and utils for maintainability
  and scalability.

## Prerequisites & Dependencies

Before you begin, ensure you have the following installed:

- **Node.js:** Version 16 or higher is recommended.
- **PostgreSQL:** A running instance of PostgreSQL database.
- **Prisma:** Required for database migrations and management.

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

## API Usage

Note: All endpoints marked as “Authenticated” require a valid JWT in the
Authorization header (Authorization: Bearer <token>).

### Authentication Endpoints

- **`POST /auth/register`**: Register a new user. Register a new user. Required:
  `username`, `password`, `firstname`, `lastname`, `email`. Optional:
  `avatarUrl`, `websiteUrl`, `isAdmin`, `isAuthor`.
- **`POST /auth/login`**: Authenticate user. Required: `username`, `password`.
  Returns JWT and user info.

(Note: by default the Blog Api allows any logged-in user to create posts and
comments. The optional `isAuthor` field can be used on the front end to restrict
either of these if that makes sense for your application.)

### Users

- **`GET /users`**: Retrieve all users (Admin only)
- **`GET /users/:id`**: Retrieve a single user
- **`PUT /users/:id`**: Update a user (User themselves or Admin)
- **`DELETE /users/:id`**: Delete a user (User themselves or Admin)

### Posts Endpoints

- **`GET /posts`**: Retrieve all posts with comments
- **`GET /posts/:id`**: Retrieve a single post
- **`POST /posts`**: Create a new post (Authenticated)
- **`PUT /posts/:id`**: Update a post (Authenticated)
- **`DELETE /posts/:id`**: Delete a post (Authenticated)

### Comments

- **`GET /posts/:postId/comments`**: Get comments for a post
- **`POST /posts/:postId/comments`**: Add a new comment (Authenticated)
- **`PUT /posts/:postId/comments/:id`**: Update a comment (Authenticated)
- **`DELETE /posts/:postId/comments/:id`**: Delete a comment (Authenticated)

### Example: Creating a Post

```json
// Sample request body for creating a post
{
  "title": "My First Post",
  "content": "This is the content of my first blog post.",
  "published": true
}
```

Send a `POST` request to `/posts` with the JSON body and valid JWT in the
`Authorization` header.

## Configuration Options

- **`DATABASE_URL`**: PostgreSQL connection string
- **`JWT_SECRET`**: Secret key for signing JWTs
- **`PORT`**: Server port (default: 3000)

## Contributing Guidelines

We welcome contributions! To contribute to this project:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your fork.
5.  Submit a pull request to the main branch of the original repository.

Please ensure your code adheres to the project's coding standards.

## Acknowledgments

- This project uses the `@faker-js/faker` library for generating seed data for
  testing.
- Thanks to the Prisma team for their excellent ORM.
- Thanks to the Passport.js team for their flexible authentication middleware.
- Built as part of the excellent Odin Project Curriculm
