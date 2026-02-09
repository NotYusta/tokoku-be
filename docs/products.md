# Product Endpoints (Public)

These endpoints are accessible to everyone.

## List Products

Retrieve a paginated list of catalog products.

- **URL:** `/products`
- **Method:** `GET`
- **Query Parameters:**
  - `page` (integer, default: `1`)
  - `page_size` (integer, default: `20`)
  - `only_in_stock` (boolean, optional)
- **Success Response:**
  ```json
  {
    "data": [
      {
        "id": 1,
        "name": "Cool T-Shirt",
        "price": 25.0,
        "stock": 100,
        "thumbnail": "http://localhost:5000/uploads/tshirt.jpg"
      }
    ],
    "meta": {
      "total": 50,
      "page": 1,
      "pageSize": 20,
      "totalPages": 3
    }
  }
  ```

## Get Product Details

Retrieve full details including options (size, color) and gallery.

- **URL:** `/products/:id`
- **Method:** `GET`
- **Success Response:**
  ```json
  {
    "data": {
      "id": 1,
      "name": "Cool T-Shirt",
      "description": "Premium cotton t-shirt",
      "price": 25.0,
      "stock": 100,
      "options": [
        {
          "id": 1,
          "name": "Size",
          "values": [
            { "id": 10, "value": "S" },
            { "id": 11, "value": "M" }
          ]
        }
      ],
      "images": [
        "http://localhost:5000/uploads/tshirt-front.jpg",
        "http://localhost:5000/uploads/tshirt-back.jpg"
      ]
    }
  }
  ```

## Quick Buy (Create Order)

Starts an order for a specific product.

- **URL:** `/products/:id/order`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "quantity": 2,
    "selectedOptions": [
      {
        "optionId": 1,
        "valueIds": [10],
        "customValue": "Optional text"
      }
    ]
  }
  ```
- **Success Response:**
  - **Status:** `200 OK`
  - **Body:**
    ```json
    {
      "data": {
        "order": {
          "id": 123,
          "totalAmount": 50.0,
          "status": "pending"
        },
        "url": "https://checkout.xendit.co/v2/..."
      }
    }
    ```

---

[Back to Home](./README.md)
