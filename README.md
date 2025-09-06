# 📚 Book Store

#### 🌐 [Live URL](https://book-store-fbwl.onrender.com)

#### 🗂 [View Database ERD](https://dbdiagram.io/d/Book-Store-68bae5a561a46d388ea5485e)

## 📖 Description

Book Store is a **Nest-like Express application** designed to manage books, orders, payments, and user interactions.  
It follows a **modular architecture** (Controllers, Services, Repositories, and Schemas) similar to NestJS while using **Express.js, TypeScript, Drizzle ORM, and PostgreSQL**.

This project demonstrates:

- 🔐 Authentication & OTP verification
- 📚 Book and Category management
- 🛒 Orders & Order items handling
- 💳 Payments with statuses
- ✍️ Posts & content publishing
- 📝 Logging admin actions

## 🏗 Project Structure

- [`src/db`](src/db/README.md) → Database setup, configuration, and usage details.
- [`src/db/schemas`](src/db/Schemas.md) → All database schemas with enums, relations, and documentation.

## 🚀 Tech Stack

- **Backend Framework:** Express.js (Nest-like structure)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Dependency Injection:** tsyringe
- **Other Tools:** Nodemailer (emails), Stripe (payments)

## 🔗 Endpoints

<details open>
<summary>Auth Endpoints (/api/auth)</summary>

- **POST /register** → Register a new user with email, password, and name.
- **POST /request-otp** → Request an OTP for login or verification.
- **POST /verify-otp** → Verify an OTP code sent to the user.
- **POST /forget-password** → Initiate a password reset by sending a code.
- **POST /reset-password** → Reset the user password using the code received.
- **POST /refresh** → Refresh the access token using a refresh token.
- **GET /me** → Get the profile information of the currently authenticated user.

#### 1. Register a New User

**POST /api/auth/register**  
Register a new user with email, password, and name.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

#### 2. Request OTP

**POST /api/auth/request-otp**
Request an OTP for login or verification.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### 3. Verify OTP

**POST /api/auth/verify-otp**
Verify an OTP code sent to the user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

#### 4. Forget Password

**POST /api/auth/forget-password**
Initiate a password reset by sending a code to the user’s email.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

#### 5. Reset Password

**POST /api/auth/reset-password**
Reset the user password using the code received via email.

**Request Body:**

```json
{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "newSecurePassword123"
}
```

#### 6. Refresh Token

**POST /api/auth/refresh**
Refresh the access token using a refresh token.

**Request Body:**

```json
{
  "refreshToken": "yourRefreshTokenHere"
}
```

#### 7. Get Current User Profile

**GET /api/auth/me** ✅ Auth Required
Get the profile information of the currently authenticated user.
Requires **JWT Bearer token** in the `Authorization` header:

```
Authorization: Bearer <your_access_token>
```

No request body required.

</details>

<details open>
<summary>Posts Endpoints (/api/posts)</summary>

> **Notes**
>
> - Controller base: `@Controller('/api/posts')`
> - `GET /api/posts` is **Public**. All other post endpoints require **JWT Bearer** auth.
> - Authorization rules (applies to update/delete): **admin** or **super_admin** OR **author of the post**.

---

#### 1. Get Posts (List)

**GET /api/posts** ✅ Public

Query parameters supported (example):

```

?limit=10\&offset=0\&orderBy=created\_at\&order=desc

```

**Success Response (200)**:

```json
{
  "success": true,
  "message": "Posts fetched successfully",
  "data": {
    "items": [
      /* array of posts */
    ],
    "count": 123,
    "limit": 10,
    "offset": 0
  }
}
```

#### 2. Get Post by ID

**GET /api/posts/\:id** ✅ Auth required

Headers:

```
Authorization: Bearer <your_access_token>
```

**Success Response (200)**:

```json
{
  "success": true,
  "message": "Post fetched successfully",
  "data": {
    "id": "post-id",
    "title": "Post title",
    "content": "Post content",
    "author": "user-id",
    "status": "PUBLISHED",
    "created_at": "2025-09-05T12:34:56.000Z"
  }
}
```

**Error (404)**:

```json
{
  "success": false,
  "message": "Post not found",
  "data": null
}
```

#### 3. Create Post

**POST /api/posts** ✅ Auth required

Headers:

```
Authorization: Bearer <your_access_token>
Content-Type: application/json
```

**Request Body**:

```json
{
  "title": "My new post",
  "content": "The content of the post"
}
```

**Success Response (201)**:

```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "id": "new-post-id",
    "title": "My new post",
    "content": "The content of the post",
    "author": "user-id",
    "status": "DRAFT",
    "created_at": "2025-09-06T00:00:00.000Z"
  }
}
```

**Error (401)**:

```json
{
  "success": false,
  "message": "Unauthorized",
  "data": null
}
```

#### 4. Update Post

**PUT /api/posts/\:id** ✅ Auth required — only **admin/super_admin** OR **author** can update

Headers:

```
Authorization: Bearer <your_access_token>
Content-Type: application/json
```

**Request Body (any of the fields are optional depending on update)**:

```json
{
  "title": "Updated title",
  "content": "Updated content",
  "status": "PUBLISHED" // or DRAFT, etc.
}
```

**Success Response (200)**:

```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "id": "post-id",
    "title": "Updated title",
    "content": "Updated content",
    "author": "user-id",
    "status": "PUBLISHED",
    "updated_at": "2025-09-06T01:23:45.000Z"
  }
}
```

**Error (403)** — not author nor admin:

```json
{
  "success": false,
  "message": "Forbidden: You cannot update this post",
  "data": null
}
```

**Error (404)** — post not found:

```json
{
  "success": false,
  "message": "Post not found",
  "data": null
}
```

#### 5. Delete Post

**DELETE /api/posts/\:id** ✅ Auth required — only **admin/super_admin** OR **author** can delete

Headers:

```
Authorization: Bearer <your_access_token>
```

**Success Response (200)**:

```json
{
  "success": true,
  "message": "Post deleted successfully",
  "data": null
}
```

**Error (403)**:

```json
{
  "success": false,
  "message": "Forbidden: You cannot delete this post",
  "data": null
}
```

**Error (404)**:

```json
{
  "success": false,
  "message": "Post not found",
  "data": null
}
```

</details>
