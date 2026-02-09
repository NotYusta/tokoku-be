# Admin: Order Management

## Orders

### List Orders

- **URL:** `/api/admin/orders`
- **Method:** `GET`
- **Success Response:**
  ```json
  {
    "data": [
      {
        "id": 1,
        "userId": 5,
        "productId": 10,
        "quantity": 2,
        "status": "pending",
        "totalAmount": 50.00,
        "createdAt": "2024-03-20T10:00:00.000Z"
      }
    ],
    "meta": { ... }
  }
  ```

### Get Order Details

- **URL:** `/api/admin/orders/:id`
- **Method:** `GET`
- **Success Response:**
  ```json
  {
    "data": {
      "id": 1,
      "user": { "id": 5, "name": "John Doe" },
      "product": { "id": 10, "name": "Cool T-Shirt" },
      "quantity": 2,
      "status": "pending",
      "transaction": { "status": "pending", "amount": 50.0 }
    }
  }
  ```

### Create Order for User

- **URL:** `/api/admin/orders`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "userId": 5,
    "productId": 10,
    "quantity": 1,
    "selectedOptions": [{ "optionId": 1, "valueIds": [10] }]
  }
  ```
- **Success Response:** `200 OK` with order and payment URL.

### Update Order Status

- **URL:** `/api/admin/orders/:id/status`
- **Method:** `PUT`
- **Body:**
  ```json
  {
    "status": "processing"
  }
  ```
- **Description:** Valid statuses: `pending`, `processing`, `completed`, `cancelled`.

## Transactions

### List Transactions

- **URL:** `/api/admin/transactions`
- **Method:** `GET`
- **Success Response:**
  ```json
  {
    "data": [
      {
        "id": 1,
        "amount": 50.00,
        "status": "pending",
        "gateway": "xendit"
      }
    ],
    "meta": { ... }
  }
  ```

### Update Transaction Status

- **URL:** `/api/admin/transactions/:id/status`
- **Method:** `PUT`
- **Body:**
  ```json
  {
    "status": "paid"
  }
  ```
- **Description:** Valid statuses: `pending`, `paid`, `failed`. Use with caution to manually override status.

---

[Back to Admin Index](./README.md)
