# Validation Rules

## 1. Input Validation (Pydantic / Zod)

### 1.1. User Registration
-   **Email**: Must pass regex `^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$`.
-   **Password**: Min 8 chars, 1 Uppercase, 1 Number, 1 Special (`@$!%*?&`).
-   **Full Name**: Min 2 chars, Max 50. No HTML/Script tags.

### 1.2. Product Management
-   **Price**: Decimal. Min `0.00`. Max `999,999.99`.
-   **Stock**: Integer. Min `0`.
-   **Image URL**: Must be a valid HTTPS URL ending in `.png`, `.jpg`, `.webp`.

## 2. Security Validation
-   **JWT Scope**:
    -   `/admin/*` requires `role: "admin"`.
    -   `/orders/user/{id}` requires `sub == {id}` OR `role == "admin"`.
-   **Sanitization**:
    -   All Chat Inputs are stripped of `<script>`, `<iframe>`, and `javascript:` prefixes before LLM processing.

## 3. Output Validation
-   **Secrets**: User objects NEVER return `password_hash`.
-   **Precision**: All currency values returned as floats with 2 decimal precision.
