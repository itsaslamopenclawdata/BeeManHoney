# Project Requirement Document (PRD) - BeeManHoney AI Platform

## 1. Executive Summary
BeeManHoney is transitioning from a static e-commerce site to an AI-driven platform. The core value proposition is the integration of "Deep Agents" that act as personalized apiarists, guiding users through product selection, recipes, and order management using natural language.

## 2. User Journey Flow

```mermaid
graph LR
    User[User] -->|Scans QR| Auth[QR Auth System]
    User -->|Asks Question| Chat[AI Chat Widget]
    User -->|Browses| Catalog[Product List]
    
    Auth -->|Token| Session[User Session]
    
    Chat -->|Intent: Buy| Sales[Sales Agent]
    Chat -->|Intent: Support| Support[Support Agent]
    Chat -->|Intent: Cook| Recipe[Recipe Agent]
    
    Sales -->|Recommendation| Cart[Shopping Cart]
    Support -->|Status Update| OrderDB[(Order History)]
    Recipe -->|Suggestions| ContentDB[(Recipes)]
```

## 3. Core Features & Gherkin Scenarios

### 3.1. Authentication (Hybrid)
**Requirement**: Support Email/Password, OAuth, and Physical QR Token login.
**Priority**: P0
**Scenario**: QR Login Flow
```gherkin
Given a user holds a honey jar with a unique QR code "honey_batch_24_xyz"
And the code corresponds to a valid "Guest_Scanner" role in Redis
When the user scans the code via the frontend camera UI
Then the backend validates the token signature
And returns a temporary JWT with scope "read:product_provenance"
```

### 3.2. Product Discovery (RAG + Hybrid Search)
**Requirement**: Semantic search using vector embeddings + keyword filtering.
**Priority**: P0
**Scenario**: Hybrid Search
```gherkin
Given the product "Manuka Honey" has embedding vector [0.1, 0.5, ...]
When a user searches "something medicinal for a sore throat"
Then the Search Agent retrieves top 5 semantic matches
And filters results by "In Stock" status
And returns "Manuka Honey UMF 15+" as the top recommendation
```

### 3.3. AI Customer Support (LangGraph)
**Requirement**: Contextual memory and order tracking.
**Priority**: P1
**Scenario**: Contextual Memory
```gherkin
Given a user previously asked "Do you have vegan options?"
When they follow up with "Which one is the cheapest?"
Then the Agent recalls the previous filter (Vegan/Plant-based context)
And sorts the "Vegan" subset by price ascending
And responds "The Wildflower Honey is our most affordable option."
```

### 3.4. Shopping Cart & Checkout
**Requirement**: Persistent cart sync between devices.
**Priority**: P1
**Scenario**: Cross-Device Cart
```gherkin
Given a user adds "Clover Honey" to cart on Mobile
When they login on Desktop with the same credentials
Then the "Clover Honey" should be visible in the Desktop cart
And the cart total should match
```

### 3.5. Recipe Integration
**Requirement**: AI generates recipes based on available honey products.
**Priority**: P2
**Scenario**: Recipe Generation
```gherkin
Given a user has "Spiced Honey" in their cart
When they ask "What cocktails can I make with this?"
Then the Recipe Agent uses "Spiced Honey" as a specific ingredient
And generates a recipe for "Spiced Honey Old Fashioned"
```

### 3.6. Admin Dashboard & Analytics
**Requirement**: Graphical and Tabular view of KPIs (Sales, Users, Inventory).
**Priority**: P1
**Scenario**: Admin views Sales Trend
```gherkin
Given I am logged in as an "Admin"
When I navigate to the Dashboard
Then I should see a Line Chart of "Monthly Sales"
And a Table of "Low Stock Products"
And I should be able to "Add New Product" via a modal
```

## 4. Non-Functional Requirements (NFRs)
1.  **Latency**:
    -   Vector Search: < 200ms.
    -   LLM Streaming TTFT (Time To First Token): < 1.5s.
2.  **Reliability**:
    -   The "Buy" button must work even if the AI Agent is down (Graceful Degradation).
3.  **Security**:
    -   All Chat inputs must be sanitized for Prompt Injection attacks.
    -   Rate limiting: 100 req/min per IP.
    -   **Zero-Trust**: Ensure API endpoints validate JWT scopes for every request.

## 5. Edge Cases & Handling
-   **Inventory Race Condition**: Two users buying the last jar simultaneously.
    -   *Test*: Simulate concurrent checkout requests.
    -   *Handling*: Optimistic locking on the database `stock_quantity` field.
-   **LLM Hallucination**: Agent inventing a product.
    -   *Test*: Ask for "Blueberry Honey" (not in stock).
    -   *Handling*: RAG strictness—Agent can only recommend products present in the `product_search` tool output.
-   **QR Token Spoofing**: User generating fake QR codes.
    -   *Handling*: Cryptographic signature verification (HMAC-SHA256) on QR tokens.
