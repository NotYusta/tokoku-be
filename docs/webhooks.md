# Webhooks

Tokoku supports outgoing and incoming webhooks for integration with 3rd party services.

## Xendit Webhook (Incoming)

Receives payment notifications when a customer completes a transaction via Xendit.

- **URL:** `/api/webhook/xendit`
- **Method:** `POST`
- **Headers:**
  - `x-callback-token`: Verification token provided by Xendit.
- **Payload:** Directly forwarded from Xendit callback.
- **Action**: Updates the corresponding transaction and order status automatically based on the payment success.

---

[Back to Home](./README.md)
