# API Contract (OpenAPI 3.1)

This document represents the SINGLE SOURCE OF TRUTH for the BeeManHoney API. All backend implementation must adhere strictly to this schema.

```yaml
openapi: 3.1.0
info:
  title: BeeManHoney AI Platform API
  version: 1.0.0
  description: |
    Backend API for BeeManHoney, featuring Hybrid Auth, E-commerce flows, and AI Agent Streaming.
    
    **Authentication**:
    - All protected endpoints require a Bearer Token (JWT).
    - Login via `/auth/token` (OAuth2 Password Flow) or `/auth/qr-login`.
    
    **Error Handling**:
    - All errors follow the standard `ProblemDetails` RFC 7807 format implicitly.
    
servers:
  - url: http://localhost:8000/api/v1
    description: Local Development
  - url: https://api.beemanhoney.com/api/v1
    description: Production

tags:
  - name: Auth
    description: User authentication and identity management
  - name: Products
    description: Product catalog and semantic search
  - name: Chat
    description: AI Agent interaction and streaming
  - name: Orders
    description: Order management and history
  - name: Content
    description: Static content (Recipes, Apiaries, Contact)

paths:
  # ============================================================================
  # AUTHENTICATION
  # ============================================================================
  /auth/token:
    post:
      tags: [Auth]
      summary: Login (OAuth2 Password Flow)
      operationId: login_access_token
      requestBody:
        required: true
        content:
          application/x-www-form-urlencoded:
            schema:
              type: object
              properties:
                username:
                  type: string
                  format: email
                  description: User email
                password:
                  type: string
                  format: password
                grant_type:
                  type: string
                  default: password
              required: [username, password]
      responses:
        200:
          description: Successful Login
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Token'
        401:
          description: Invalid credentials

  /auth/register:
    post:
      tags: [Auth]
      summary: Register a new user
      operationId: register_user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserCreate'
      responses:
        201:
          description: User Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Token'
        400:
          description: Email already exists

  /auth/qr-login:
    post:
      tags: [Auth]
      summary: Login via Physical QR Token
      operationId: qr_login
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                qr_token:
                  type: string
                  description: The unique string scanned from the physical jar/card
              required: [qr_token]
      responses:
        200:
          description: Successful QR Login
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Token'

  # ============================================================================
  # PRODUCTS
  # ============================================================================
  /products:
    get:
      tags: [Products]
      summary: List Products with Semantic Search & Filtering
      operationId: list_products
      parameters:
        - name: q
          in: query
          description: Search term for Vector Semantic Search
          schema:
            type: string
        - name: category
          in: query
          schema:
            type: string
        - name: skip
          in: query
          schema:
            type: integer
            default: 0
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
      responses:
        200:
          description: List of products
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Product'

  /products/featured:
    get:
      tags: [Products]
      summary: Get Featured Products for Headline/Home
      operationId: get_featured_products
      responses:
        200:
          description: Top 3-4 feature products
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Product'

  /products/{product_id}:
    get:
      tags: [Products]
      summary: Get Product Details
      parameters:
        - name: product_id
          in: path
          required: true
          schema:
            type: integer
      responses:
        200:
          description: Product details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        404:
          description: Product not found

  # ============================================================================
  # CHAT (AI)
  # ============================================================================
  /chat/stream:
    post:
      tags: [Chat]
      summary: Stream AI Chat Response (SSE)
      description: |
        Initiates or continues a chat conversation. 
        Returns `text/event-stream`.
        Events:
        - `message`: A chunk of text token.
        - `tool_start`: JSON details of a tool being called.
        - `tool_end`: JSON result of a tool call.
        - `end`: Stream finished.
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ChatRequest'
      responses:
        200:
          description: Event Stream
          content:
            text/event-stream:
              schema:
                type: string
                format: binary

  # ============================================================================
  # ORDERS
  # ============================================================================
  /orders/user/{user_id}:
    get:
      tags: [Orders]
      summary: Get User Order History
      security:
        - bearerAuth: []
      parameters:
        - name: user_id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        200:
          description: List of orders
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Order'

  /cart/add:
    post:
      tags: [Orders]
      summary: Add Item to Persistent Cart
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                product_id:
                  type: integer
                quantity:
                  type: integer
                  minimum: 1
      responses:
        200:
          description: Item added
          content:
            application/json:
              schema:
                type: object
                properties:
                  cart_size:
                    type: integer

  # ============================================================================
  # CONTENT
  # ============================================================================
  /recipes:
    get:
      tags: [Content]
      summary: List Recipes
      parameters:
        - name: category
          in: query
          schema:
            type: string
      responses:
        200:
          description: List of recipes
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Recipe'

  /contact:
    post:
      tags: [Content]
      summary: Submit Contact Form
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                email:
                  type: string
                  format: email
                message:
                  type: string
      responses:
        202:
          description: Message accepted for processing

  /apiaries:
    get:
      tags: [Content]
      summary: Get Apiary Locations
      responses:
        200:
          description: List of locations
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Location'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    Token:
      type: object
      properties:
        access_token:
          type: string
        token_type:
          type: string
      required: [access_token, token_type]

    UserCreate:
      type: object
      properties:
        email:
          type: string
          format: email
        password:
          type: string
        full_name:
          type: string
      required: [email, password]

    Product:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        price:
          type: number
        description:
          type: string
        image_url:
          type: string
        category:
          type: string
        stock_status:
          type: string
          enum: [in_stock, out_of_stock]

    Order:
      type: object
      properties:
        id:
          type: string
          format: uuid
        date:
          type: string
          format: date-time
        total:
          type: number
        status:
          type: string
          enum: [Delivered, Shipped, Processing, Cancelled]
        items:
          type: array
          items:
            type: object # Simplified for overview

    ChatRequest:
      type: object
      properties:
        message:
          type: string
        thread_id:
          type: string
          format: uuid
          description: Session ID for conversation memory
      required: [message]

    Recipe:
      type: object
      properties:
        id:
          type: integer
        title:
          type: string
        image_url:
          type: string
        category:
          type: string

    Location:
      type: object
      properties:
        lat:
          type: number
        lng:
          type: number
        location_name:
          type: string
        description:
          type: string
```
