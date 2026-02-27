# Error Handbook

## 1. Backend Error Codes (FastAPI)
All API errors return `ProblemDetails`.

| HTTP | Code | Message | Resolution |
| :--- | :--- | :--- | :--- |
| 400 | `VAL_ERR` | "Invalid Request Body" | Check JSON format against OpenAPI schema. |
| 401 | `AUTH_ERR` | "Token Expired/Invalid" | Refresh token or redirect to Login. |
| 403 | `PERM_ERR` | "Insufficient Role" | User lacks `admin` or `guest_scanner` scope. |
| 404 | `RES_NOT_FOUND` | "Resource X not found" | Verify ID exists. |
| 429 | `RATE_LIMIT` | "Too Many Requests" | Slow down. Max 60/min. |
| 500 | `INT_ERR` | "Internal Server Error" | Check `docker logs api` for stack trace. |

## 2. AI Failure Modes
-   **`LLM_TIMEOUT`**: Agent took > 30s.
    -   *Handling*: Return "I'm thinking too hard. Try again?" to user.
-   **`CONTEXT_OVERFLOW`**: RAG retrieved too much text.
    -   *Handling*: Truncate context to 4096 tokens.

## 3. Frontend Error Boundaries
-   **Global Boundary**: Catches React rendering crashes. Displays "Something went wrong" + Reload button.
-   **Network Boundary**: Catches failed Axios requests. Displays Toast Notification (Red).
