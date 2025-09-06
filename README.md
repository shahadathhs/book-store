# 📚 Book Store

#### 🌐 [Live URL](https://book-store-fbwl.onrender.com)

#### 🗂  [View Database ERD](https://dbdiagram.io/d/Book-Store-68bae5a561a46d388ea5485e)

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
- [`src/db/schemas`](src/db/schemas/README.md) → All database schemas with enums, relations, and documentation.

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

<details>
<summary>Posts Endpoints (/api/post)</summary>

- Work IN Progress
</details>