# Admin: User Management

Manage system users.

## List Users

- **URL:** `/api/admin/users`
- **Method:** `GET`
- **Query Params:** `page`, `page_size`
- **Success Response:**
  ```json
  {
    "data": [
      {
        "id": 1,
        "name": "Admin User",
        "email": "admin@example.com",
        "isAdmin": true,
        "createdAt": "2024-03-20T10:00:00.000Z"
      }
    ],
    "meta": {
      "total": 5,
      "page": 1,
      "pageSize": 20,
      "totalPages": 1
    }
  }
  ```

## Get User Details

- **URL:** `/api/admin/users/:id`
- **Method:** `GET`
- **Success Response:**
  ```json
  {
    "data": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com",
      "isAdmin": true,
      "createdAt": "2024-03-20T10:00:00.000Z"
    }
  }
  ```

## Create User

- **URL:** `/api/admin/users`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "name": "New Admin",
    "email": "admin@example.com",
    "password": "securepassword",
    "isAdmin": true
  }
  ```
- **Success Response:**
  ```json
  {
    "data": {
      "id": 10,
      "name": "New Admin",
      "email": "admin@example.com",
      "isAdmin": true
    }
  }
  ```

## Update User

- **URL:** `/api/admin/users/:id`
- **Method:** `PUT`
- **Body:**
  ```json
  {
    "name": "Updated Name",
    "isAdmin": false
  }
  ```
- **Success Response:**
  ```json
  {
    "data": {
      "id": 10,
      "name": "Updated Name",
      "email": "admin@example.com",
      "isAdmin": false
    }
  }
  ```

## Delete User

- **URL:** `/api/admin/users/:id`
- **Method:** `DELETE`
- **Success Response:** `204 No Content`

---

[Back to Admin Index](./README.md)
