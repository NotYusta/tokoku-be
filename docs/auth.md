# Authentication Endpoints

Manage user sessions and account creation.

## Login

Authenticates a user and establishes a session.

- **URL:** `/auth/login`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "remember": true
  }
  ```
- **Success Response:**
  - **Status:** `204 No Content`
  - **Headers:**
    - `Set-Cookie: auth_token=<JWT>; HttpOnly; Path=/; Max-Age=...`
- **Error Responses:**
  - `400 Bad Request`: Validation failed (e.g., invalid email format).
  - `401 Unauthorized`: Invalid credentials.

## Signup

Creates a new user account.

- **URL:** `/auth/signup`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "remember": true
  }
  ```
- **Success Response:**
  - **Status:** `200 OK`
  - **Body:**
    ```json
    {
      "data": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "createdAt": "2024-03-20T10:00:00.000Z"
      }
    }
    ```
- **Error Responses:**
  - `400 Bad Request`: Validation failed or email already exists.

## Logout

Terminates the current session.

- **URL:** `/auth/logout`
- **Method:** `GET`
- **Auth Required:** Yes
- **Success Response:**
  - **Status:** `204 No Content`
  - **Headers:**
    - `Set-Cookie: auth_token=; Max-Age=0; ...` (Expires the cookie)

---

[Back to Home](./README.md)
