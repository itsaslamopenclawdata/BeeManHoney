# BeeManHoney E2E Test Cases, User Stories & Acceptance Criteria

**Date:** 2026-02-27  
**Project:** BeeManHoney E-commerce Platform  
**Status:** Comprehensive Test Documentation with API Compliance

---

## 1. USER STORIES

### US-01: User Registration
**As a** new customer  
**I want to** create an account  
**So that** I can browse products and place orders

### US-02: User Login
**As a** registered customer  
**I want to** log in securely  
**So that** I can access my account and view personalized content

### US-03: Browse Products
**As a** customer  
**I want to** view all available honey products  
**So that** I can select items to purchase

### US-04: View Product Details
**As a** customer  
**I want to** see detailed product information  
**So that** I can make informed purchase decisions

### US-05: Add to Cart
**As a** customer  
**I want to** add products to my shopping cart  
**So that** I can collect items for purchase

### US-06: Manage Cart
**As a** customer  
**I want to** view, update quantities, and remove items from cart  
**So that** I can finalize my purchase selection

### US-07: Place Order
**As a** logged-in customer  
**I want to** checkout and place an order  
**So that** I can purchase my selected items

### US-08: View Order History
**As a** logged-in customer  
**I want to** view my past orders  
**So that** I can track my purchase history

### US-09: Admin Product Management
**As an** admin user  
**I want to** add, edit, and delete products  
**So that** I can manage the product catalog

### US-10: View Analytics
**As an** admin user  
**I want to** view sales and order analytics  
**So that** I can make data-driven business decisions

---

## 2. USER ACCEPTANCE CRITERIA

### US-01: User Registration
- [ ] User can register with email and password
- [ ] Password must meet security requirements
- [ ] Duplicate email registration is prevented
- [ ] User receives confirmation of successful registration

### US-02: User Login
- [ ] User can log in with registered email and password
- [ ] Invalid credentials show appropriate error message
- [ ] Successful login redirects to homepage
- [ ] JWT token is returned for authenticated requests

### US-03: Browse Products
- [ ] All products are displayed on products page
- [ ] Product images load correctly
- [ ] Product name, price, and category are visible
- [ ] Products can be filtered by category (Premium, Standard, Dark, Infused)

### US-04: View Product Details
- [ ] Clicking a product shows full details
- [ ] Product description, price, stock quantity are displayed
- [ ] "Add to Cart" button is available

### US-05: Add to Cart
- [ ] User can add product to cart from product list
- [ ] User can add product to cart from product details
- [ ] Cart count updates in header after adding
- [ ] Success notification appears after adding

### US-06: Manage Cart
- [ ] Cart page shows all added items
- [ ] User can increase/decrease quantity
- [ ] User can remove items from cart
- [ ] Total price updates dynamically
- [ ] Cart persists across page refreshes (localStorage)

### US-07: Place Order
- [ ] Checkout button is available when cart has items
- [ ] Order is created with all cart items
- [ ] Order status is set to "pending"
- [ ] Cart is cleared after successful order
- [ ] Order confirmation is displayed

### US-08: View Order History
- [ ] Logged-in user can view their orders
- [ ] Orders show date, status, and total amount
- [ ] Order items are displayed with quantities and prices

### US-09: Admin Product Management
- [ ] Admin can access admin dashboard
- [ ] Admin can view all products in table format
- [ ] Admin can add new product with all fields
- [ ] Admin can edit existing product
- [ ] Admin can delete product with confirmation

### US-10: View Analytics
- [ ] Admin can view total orders count
- [ ] Admin can view total revenue
- [ ] Admin can view recent orders
- [ ] Analytics data refreshes on page load

---

## 3. E2E TEST CASES

### TC-001: New User Registration
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to /signup | Signup page loads |
| 2 | Enter email, password, confirm password | Fields accept input |
| 3 | Click Register button | Account created, redirect to login |
| 4 | Try duplicate email | Error message displayed |

### TC-002: User Login
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to /login | Login page loads |
| 2 | Enter invalid credentials | Error message displayed |
| 3 | Enter valid credentials | Redirect to homepage, token stored |

### TC-003: Browse Products
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to /products | Products page loads |
| 2 | Verify products grid displays | All products visible |
| 3 | Check product images | Images load correctly |

### TC-004: Add Product to Cart
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to products page | Products displayed |
| 2 | Click "Add to Cart" on a product | Item added to cart |
| 3 | Check header cart badge | Count increases |
| 4 | Check cart in localStorage | Item persisted |

### TC-005: Cart Management
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to cart | Cart page loads with items |
| 2 | Increase quantity | Total updates |
| 3 | Decrease quantity | Total updates, item removed if 0 |
| 4 | Click remove on item | Item removed from cart |

### TC-006: Place Order
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Add items to cart | Items in cart |
| 2 | Click Checkout/Place Order | Order created |
| 3 | Check order in database | Order exists with items |
| 4 | Verify cart is empty | Cart cleared |

### TC-007: View Order History
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login as test user | Logged in |
| 2 | Navigate to /history | Orders displayed |
| 3 | Check order details | Date, status, items visible |

### TC-008: Admin Add Product
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login as admin | Admin dashboard accessible |
| 2 | Click Add Product button | Modal opens |
| 3 | Fill product form | All fields accepted |
| 4 | Submit form | Product created, appears in list |

### TC-009: Admin Edit Product
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login as admin | Admin dashboard accessible |
| 2 | Click Edit on a product | Modal opens with data |
| 3 | Modify product details | Fields editable |
| 4 | Save changes | Product updated in list |

### TC-010: Admin Delete Product
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login as admin | Admin dashboard accessible |
| 2 | Click Delete on a product | Confirmation dialog appears |
| 3 | Confirm deletion | Product removed from list |

### TC-011: View Analytics
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login as admin | Admin dashboard accessible |
| 2 | Navigate to analytics section | Data displayed |
| 3 | Verify total orders | Count shown |
| 4 | Verify total revenue | Amount shown |

---

## 4. API COMPLIANCE REPORT

### Authentication Endpoints

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| /api/v1/auth/register | POST | ✅ EXISTS | User registration |
| /api/v1/auth/login | POST | ✅ EXISTS | User login, returns JWT |

### Product Endpoints

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| /api/v1/products | GET | ✅ EXISTS | List all products |
| /api/v1/products | POST | ✅ EXISTS | Create product (admin) |
| /api/v1/products/{id} | GET | ✅ EXISTS | Get single product |
| /api/v1/products/{id} | PUT | ✅ EXISTS | Update product (admin) |
| /api/v1/products/{id} | DELETE | ✅ EXISTS | Delete product (admin) |

### Order Endpoints

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| /api/v1/orders | GET | ✅ EXISTS | List user orders |
| /api/v1/orders | POST | ✅ EXISTS | Create new order |
| /api/v1/orders/{id} | GET | ✅ EXISTS | Get order details |

### Analytics Endpoints

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| /api/v1/analytics/summary | GET | ✅ EXISTS | Dashboard analytics |

### Compliance Summary

| Category | Total | Passed | Failed |
|----------|-------|--------|--------|
| Auth | 2 | 2 | 0 |
| Products | 5 | 5 | 0 |
| Orders | 3 | 3 | 0 |
| Analytics | 1 | 1 | 0 |
| **TOTAL** | **11** | **11** | **0** |

**API Compliance: 100%** ✅

---

## 5. TEST CATEGORIES

### Functional Tests
- User registration and login
- Product browsing and search
- Cart operations (add, update, remove)
- Order placement and history
- Admin CRUD operations

### Non-Functional Tests
- Page load performance
- Responsive design (mobile, tablet, desktop)
- Error handling and validation messages

### Security Tests
- Password hashing verification
- JWT token validation
- Protected route access control
- SQL injection prevention

---

## 6. TEST DATA

### Test Users
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@beemanhoney.com | BeeManHoney@Admin2024!Secure |
| Test User | test@example.com | Test12345! |

### Test Products
| Name | Category | Price |
|------|----------|-------|
| Manuka Honey UMF 15+ | Premium | $45.99 |
| Wildflower Honey | Standard | $12.99 |
| Acacia Honey | Standard | $18.50 |
| Buckwheat Honey | Dark | $15.00 |

---

## 7. RUNNING THE TESTS

### Backend Tests
```bash
cd backend
pytest -v
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Manual E2E Testing
1. Start services: `docker-compose up -d`
2. Frontend: http://localhost:3000
3. Backend API: http://localhost:8000/docs

---

**Document Status:** Complete  
**Last Updated:** 2026-02-27
