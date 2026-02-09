# Getting Started

This section covers the basic conventions and authentication mechanism used by the Tokoku API.

## Authentication

Tokoku uses **HttpOnly Cookies** for secure session management. We do not use Bearer tokens in headers to prevent XSS-based token theft.

### How it works

1.  **Login/Signup**: When you successfully authenticate, the server sends a `Set-Cookie` header.
    - **Cookie Name**: `auth_token`
    - **Attributes**: `HttpOnly`, `SameSite=Strict`, `Secure` (in production).
2.  **Subsequent Requests**: The browser automatically includes this cookie in every request to the same domain.
3.  **Frontend Configuration**:
    - If using `fetch`: Set `credentials: 'include'`.
    - If using `axios`: Set `withCredentials: true`.

### Authentication Status

To check if a user is logged in, you can call the `GET /api/client/account` endpoint. If it returns `401 Unauthorized`, the user is not authenticated.

## Response Headers (Common)

Every response from the API typically includes these headers:

| Header                             | Description                                        |
| :--------------------------------- | :------------------------------------------------- |
| `Content-Type`                     | `application/json; charset=utf-8`                  |
| `Access-Control-Allow-Origin`      | The origin of the frontend (configured in `.env`). |
| `Access-Control-Allow-Credentials` | `true` (essential for cookie-based auth).          |

## Request Formats

- **Body**: Most `POST`, `PUT`, and `PATCH` requests expect `application/json`.
- **Query**: `GET` requests use standard URL query parameters.

---

[Back to Home](./README.md)
