# Day 2 Starter Guide - BeeManHoney Project

## 🚀 QUICK START (First thing tomorrow)

### 1. Start Services
```bash
cd F:\BeeManHoney\BeeManHoney
docker-compose up -d
docker ps --filter "name=beemanhoney"
```

### 2. Verify Everything Works
```bash
# Check frontend is accessible
curl http://localhost:3000

# Check backend API
curl http://localhost:8000/docs

# Check database has users
docker exec beemanhoney-db psql -U admin -d beemanhoney -c "SELECT email, role FROM users;"
```

### 3. Login Credentials
- **Test User:** test@example.com / Test12345!
- **Admin User:** admin@beemanhoney.com / BeeManHoney@Admin2024!Secure

---

## ⚠️ IMMEDIATE ISSUE TO FIX

### Frontend Container Build Failed
**Last Error:** Network timeout when pulling nginx:alpine + TypeScript error (now fixed)

**Solution:**
```bash
# Option 1: Simple retry
docker-compose build frontend

# Option 2: If network issues persist
docker pull nginx:alpine
docker-compose build frontend --no-cache

# Option 3: Use existing image
docker images | grep nginx
# If nginx:alpine exists, just rebuild frontend
docker-compose build frontend
```

**Expected Build Time:** 5-7 minutes

---

## 📋 TOMORROW'S TASK LIST (In Order)

### Task 1: Complete Frontend Build (30 min)
- [ ] Rebuild frontend container
- [ ] Start container with `docker-compose up -d frontend`
- [ ] Verify frontend loads at http://localhost:3000
- [ ] Test responsive behavior (resize browser window)

### Task 2: Fix Remaining Responsive Pages (1 hour)
Check and fix these files for max-width constraints:
```bash
# Check each file for "max-w-md" or "max-w-sm"
grep -n "max-w-" frontend/pages/About.tsx
grep -n "max-w-" frontend/pages/Contact.tsx
grep -n "max-w-" frontend/pages/History.tsx
grep -n "max-w-" frontend/pages/Login.tsx
grep -n "max-w-" frontend/pages/Signup.tsx
```

**Pattern to Find & Replace:**
```tsx
// FIND (lines with):
className="...max-w-md..."
className="...max-w-sm..."

// REPLACE WITH:
className="...w-full md:container md:mx-auto md:max-w-6xl..."
```

After each fix, test the page at http://localhost:3000

### Task 3: Add Admin Product Management (2 hours)
User wants admin to "change, adding, deleting records"

**Files to Edit:**
1. `frontend/pages/AdminDashboard.tsx` - Add CRUD UI
2. Create `frontend/components/ProductForm.tsx` - Add/Edit product form
3. Create `frontend/components/ProductTable.tsx` - Display products with actions

**API Endpoints Already Exist:**
- POST /api/v1/products - Create ✅
- PUT /api/v1/products/{id} - Update ✅
- DELETE /api/v1/products/{id} - Delete ✅
- GET /api/v1/products - List all ✅

**Implementation:**
```tsx
// AdminDashboard.tsx - Add these features:
// 1. Table showing all products with images
// 2. "Add Product" button → opens form modal
// 3. "Edit" button for each product → opens pre-filled form
// 4. "Delete" button for each product → confirmation dialog
// 5. Display image_url column
```

### Task 4: Fix 3 Backend Tests (30 min)
```bash
cd backend
pytest -v  # See which tests fail

# Fix test files:
# - backend/tests/test_products.py (GET /products/{id} test)
# - backend/tests/test_orders.py (empty cart validation)
```

### Task 5: Full Testing & Verification (1 hour)
- [ ] Test all pages on mobile (375px width)
- [ ] Test all pages on tablet (768px width)
- [ ] Test all pages on desktop (1920px width)
- [ ] Test add to cart on Products page
- [ ] Test admin login and product management
- [ ] Run all backend tests: `cd backend && pytest`
- [ ] Run all frontend tests: `cd frontend && npm test`

---

## 🔍 CODE PATTERNS TO USE

### Responsive Container Pattern
```tsx
// ❌ OLD - Mobile constrained
<div className="max-w-md mx-auto min-h-screen">

// ✅ NEW - Responsive
<div className="w-full md:container md:mx-auto md:max-w-6xl">
```

### Responsive Grid Pattern
```tsx
// Mobile: 2 columns, Tablet: 3 columns, Desktop: 4 columns
<section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
```

### Image with Fallback
```tsx
<img
  src={product.image_url || '/assets/logo.png'}
  alt={product.name}
  className="h-32 object-contain"
  onError={(e) => { e.currentTarget.src = '/assets/logo.png'; }}
/>
```

---

## 📁 FILES TO EDIT TOMORROW

### High Priority
1. `frontend/pages/About.tsx` - Responsive fix
2. `frontend/pages/Contact.tsx` - Responsive fix
3. `frontend/pages/History.tsx` - Responsive fix
4. `frontend/pages/Login.tsx` - Responsive fix
5. `frontend/pages/Signup.tsx` - Responsive fix
6. `frontend/pages/AdminDashboard.tsx` - Add CRUD UI

### Medium Priority
7. `backend/tests/test_products.py` - Fix failing test
8. `backend/tests/test_orders.py` - Fix failing test

---

## 🛠️ USEFUL COMMANDS

### Check What Changed Since Yesterday
```bash
# See modified files
git status

# See recent commits
git log --oneline -5

# See what's different in a file
git diff frontend/pages/Products.tsx
```

### Quick Test Commands
```bash
# Backend tests
cd backend
pytest tests/test_auth.py -v
pytest tests/test_products.py -v
pytest tests/test_orders.py -v

# Frontend tests
cd frontend
npm test -- --no-coverage --watch
```

### Database Operations
```bash
# Connect to database
docker exec -it beemanhoney-db psql -U admin -d beemanhoney

# Useful queries
\dt                          -- List tables
SELECT * FROM users;          -- View users
SELECT * FROM products;       -- View products
SELECT COUNT(*) FROM orders;  -- Count orders

# Exit database
\q
```

### Docker Commands
```bash
# View logs
docker-compose logs -f frontend
docker-compose logs -f api

# Restart specific service
docker-compose restart frontend
docker-compose restart api

# Rebuild specific service
docker-compose build frontend
docker-compose up -d frontend

# Stop everything
docker-compose down
```

---

## 🎯 SUCCESS METRICS FOR TOMORROW

By end of day tomorrow:
- [ ] Frontend container rebuilt and running
- [ ] All 6 pages fully responsive (100%)
- [ ] Admin can add/edit/delete products
- [ ] All backend tests passing (100%)
- [ ] Application tested on mobile, tablet, desktop
- [ ] Documentation updated with changes

---

## 💡 TIPS

1. **Build Takes Time:** Frontend build takes 5-7 minutes, be patient
2. **Network Issues:** If Docker build fails, wait 2 minutes and retry
3. **Test Often:** After each responsive fix, test in browser immediately
4. **Use Browser DevTools:** Press F12 → Toggle device toolbar (Ctrl+Shift+M) to test responsive
5. **Check Database:** After changes, verify data is still there
6. **Git Commits:** Commit working changes frequently with clear messages

---

## 📞 IF STUCK

**Build Issues:**
- Check Docker Desktop is running
- Check port 3000 is not in use: `netstat -ano | findstr :3000`
- Try `docker system prune -a` and rebuild

**Responsive Issues:**
- Use browser DevTools to inspect element
- Check for parent elements with max-width
- Look at Products.tsx and Recipes.tsx as examples

**Database Issues:**
- Re-seed: `docker exec beemanhoney-api python -m app_data.init_db`
- Check container is running: `docker ps`
- View logs: `docker-compose logs db`

**Test Issues:**
- Run with verbose: `pytest -v`
- Run single test: `pytest tests/test_auth.py::test_login`
- Check database has test data

---

**Ready to start! Open terminal and run:**
```bash
cd F:\BeeManHoney\BeeManHoney
docker-compose up -d
docker ps
```

Good luck! 🚀
