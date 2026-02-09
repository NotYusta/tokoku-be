# Errors & Pagination

## Pagination Format

All listing endpoints return data in this standard envelope:

```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}
```

### Query Parameters

- `page`: Current page number (integer, default: 1).
- `page_size`: Number of items per page (integer, default: 20).
- `search`: Search keyword (string, optional).

### Response Fields

- `total`: Total number of items across all pages.
- `page`: Current page number.
- `pageSize`: Number of items per page.
- `totalPages`: Calculated based on `total` and `pageSize`.

## Error Handling

Errors are returned in a consistent JSON format with appropriate HTTP status codes.

### Error Envelope

```json
{
  "status": "error",
  "message": "A descriptive error message",
  "code": 401,
  "errors": []
}
```

### Common Status Codes

| Code  | Meaning           | Description                                                                   |
| :---- | :---------------- | :---------------------------------------------------------------------------- |
| `400` | Bad Request       | Validation errors or malformed JSON. Check the `errors` array for details.    |
| `401` | Unauthorized      | Session is missing or expired. Redirect to login.                             |
| `403` | Forbidden         | Authenticated but lacks permissions (e.g., non-admin accessing admin routes). |
| `404` | Not Found         | The requested resource (User, Product, Order) does not exist.                 |
| `429` | Too Many Requests | Rate limit exceeded.                                                          |
| `500` | Server Error      | Something went wrong on our end.                                              |

---

[Back to Home](./README.md)
