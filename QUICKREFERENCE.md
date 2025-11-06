# Blog API – Quick Reference Cheat Sheet

**Note**: All authenticated routes require a valid JWT in the `Authorization`
header: `Authorization: Bearer <token>`

### Authentication

| Endpoint         | Method | Auth | Request Body                                                                                                                                                                                                                                                                                |
| ---------------- | ------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/auth/register` | POST   | No   | `json { "username": "string", "password": "string", "firstname": "string", "lastname": "string", "email": "string", "avatarUrl": "string (optional)", "websiteUrl": "string (optional)", "isAdmin": "boolean (optional, default false)", "isAuthor": "boolean (optional, default false)" }` |
| `/auth/login`    | POST   | No   | `json { "username": "string", "password": "string" }`                                                                                                                                                                                                                                       |

### Users

| Endpoint     | Method | Auth       | Request Body                                                                                                                                                                                                                                                                  |
| ------------ | ------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/users`     | GET    | Admin      | –                                                                                                                                                                                                                                                                             |
| `/users/:id` | GET    | User/Admin | –                                                                                                                                                                                                                                                                             |
| `/users/:id` | PUT    | User/Admin | `json { "username": "string (optional)", "firstname": "string (optional)", "lastname": "string (optional)", "email": "string (optional)", "bio": "string (optional)", "avatarUrl": "string (optional)", "websiteUrl": "string (optional)", "password": "string (optional)" }` |
| `/users/:id` | DELETE | User/Admin | –                                                                                                                                                                                                                                                                             |

### Posts

| Endpoint     | Method | Auth     | Request Body                                                                                               |
| ------------ | ------ | -------- | ---------------------------------------------------------------------------------------------------------- |
| `/posts`     | GET    | Optional | –                                                                                                          |
| `/posts/:id` | GET    | Optional | –                                                                                                          |
| `/posts`     | POST   | Auth     | `json { "title": "string", "content": "string", "published": "boolean (optional, default false)" }`        |
| `/posts/:id` | PUT    | Auth     | `json { "title": "string (optional)", "content": "string (optional)", "published": "boolean (optional)" }` |
| `/posts/:id` | DELETE | Auth     | –                                                                                                          |

### Comments

| Endpoint                      | Method | Auth     | Request Body                                                                                                                                        |
| ----------------------------- | ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/posts/:postId/comments`     | GET    | Optional | –                                                                                                                                                   |
| `/posts/:postId/comments`     | POST   | Auth     | `json { "content": "string", "published": "boolean (optional, default true)", "parentId": "integer (optional, for replies)", "postId": "integer" }` |
| `/posts/:postId/comments/:id` | PUT    | Auth     | `json { "content": "string (optional)", "published": "boolean (optional)" }`                                                                        |
| `/posts/:postId/comments/:id` | DELETE | Auth     | –                                                                                                                                                   |

### Example: Creating a Post

```JSON
POST /posts
{
  "title": "My First Post",
  "content": "This is the content of my first blog post.",
  "published": true
}
```

Headers: `Authorization: Bearer <token>`

### Configuration

- `DATABASE_URL` – PostgreSQL connection string
- `JWT_SECRET` – Secret key for signing JWTs
- `PORT` – Server port (default 3000)

### Quick Notes

- Expired or deleted JWT → `401 Unauthorized`
- Admin-only routes → `403 Forbidden` for non-admins
- Users can only modify/delete their own resources unless admin
