# Admin: Product Management

Manage catalog, categories, and stock.

## Products

### List Products

- **URL:** `/api/admin/products`
- **Method:** `GET`
- **Query Params:** `page`, `pageSize`, `search` (filters by name)
- **Success Response:**
  ```json
  {
    "data": [
      {
        "id": 1,
        "name": "Cool T-Shirt",
        "price": 25.00,
        "stock": 100
      }
    ],
    "meta": { ... }
  }
  ```

### Get Product

- **URL:** `/api/admin/products/:id`
- **Method:** `GET`
- **Success Response:**
  ```json
  {
    "data": {
      "id": 1,
      "name": "Cool T-Shirt",
      "description": "Premium cotton",
      "price": 25.0,
      "stock": 100
    }
  }
  ```

### Create Product

- **URL:** `/api/admin/products`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "name": "New Product",
    "description": "Description here",
    "price": 49.99,
    "stock": 50
  }
  ```
- **Success Response:** `200 OK` with created product data.

### Update Product

- **URL:** `/api/admin/products/:id`
- **Method:** `PUT`
- **Body:**
  ```json
  {
    "price": 44.99,
    "stock": 60
  }
  ```

### Delete Product

- **URL:** `/api/admin/products/:id`
- **Method:** `DELETE`
- **Success Response:** `204 No Content`

## Options & Values

### List Options

- `GET /api/admin/product-options?search=size`
- **Method:** `GET`
- **Query Params:** `page`, `pageSize`, `search` (filters by name or label)
- **Success Response:**
  ```json
  {
    "data": [
      {
        "id": 1,
        "name": "Size",
        "product": { "id": 10, "name": "Cool T-Shirt" }
      }
    ]
  }
  ```

### Create Option

- `POST /api/admin/product-options`
- **Body:** `{ "name": "Color" }`

### Values Management

- `GET /api/admin/product-option-values?search=XL`
- **Method:** `GET`
- **Query Params:** `page`, `pageSize`, `search` (filters by name or value)
- **Success Response:**
  ```json
  {
    "data": [
      {
        "id": 5,
        "name": "XL",
        "value": "extra-large",
        "option": {
          "id": 1,
          "name": "Size",
          "product": { "id": 10, "name": "Cool T-Shirt" }
        }
      }
    ]
  }
  ```
- `POST /api/admin/product-option-values`
- **Body:** `{ "option_id": 1, "name": "XL", "value": "extra-large" }`

## Product Images

- `POST /api/admin/product-images`
  - **Body (Multipart):** `image` file + `productId`
- `DELETE /api/admin/product-images/:id`

---

[Back to Admin Index](./README.md)
