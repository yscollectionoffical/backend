# YS Collection - Backend API Server

Standalone Express.js REST API server for YS Collection Luxury Modest Couture.

## Installation

```bash
cd backend
npm install
```

## Running the Server

### Development Mode (with hot-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

Default Port: `http://localhost:5000`

---

## API Endpoints Reference

### 1. Authentication (`/api/auth`)
- `POST /api/auth/login` - User & Admin login (Returns JWT token)
  - Default Admin: `admin@yscollection.pk` / `admin123`
- `POST /api/auth/register` - New user signup (Role: `user`)

### 2. Orders (`/api/orders`)
- `GET /api/orders` - Get all customer COD orders
- `POST /api/orders` - Place new Cash on Delivery order
- `PATCH /api/orders` - Update order tracking status (Pending, Confirmed, Dispatched, Delivered, Cancelled)

### 3. Products (`/api/products`)
- `GET /api/products` - List all catalog abayas
- `POST /api/products` - Add new product (Admin)
- `PUT /api/products` - Update product details (Admin)
- `DELETE /api/products/:id` - Delete product by ID (Admin)

### 4. Reviews (`/api/reviews`)
- `GET /api/reviews?productId=1` - Fetch customer ratings & reviews
- `POST /api/reviews` - Submit product review (1-5 stars)

### 5. Website Settings (`/api/settings`)
- `GET /api/settings` - Retrieve site headline, delivery charges, WhatsApp number
- `PUT /api/settings` - Update settings from Admin panel

---

## Database
Data is persisted in JSON format inside the `/backend/data/` directory:
- `users.json`
- `orders.json`
- `products.json`
- `reviews.json`
- `settings.json`
