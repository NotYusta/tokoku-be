# Client Order Endpoints

Manage personal orders. All endpoints require authentication.

## List My Orders

- **URL:** `/client/orders`
- **Method:** `GET`
- **Query Params:** `page`, `page_size`
- **Success Response:**
  ```json
  {
    "data": [
      {
        "id": 1,
        "createdAt": "2024-03-20T10:00:00.000Z",
        "status": "pending",
        "totalAmount": 50.0
      }
    ],
    "meta": {
      "total": 1,
      "page": 1,
      "pageSize": 20,
      "totalPages": 1
    }
  }
  ```

## Get Order Details

- **URL:** `/client/orders/:id`
- **Method:** `GET`
- **Success Response:**
  ```json
  {
    "data": {
      "id": 1,
      "items": [{ "id": 1, "productName": "Cool T-Shirt", "quantity": 2 }],
      "transaction": {
        "status": "pending",
        "amount": 50.0,
        "paymentUrl": "https://..."
      },
      "status": "pending"
    }
  }
  ```

## Get Account info

Check user session and account details.

- **URL:** `/client/account`
- **Method:** `GET`
- **Success Response:**
  ```json
  {
    "data": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "isAdmin": false
    }
  }
  ```

---

[Back to Home](./README.md)
