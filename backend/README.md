# The Online Eatery — Backend API

REST API for a full-stack food ordering platform. Node.js + Express + MongoDB (Mongoose), with JWT authentication and role-based access control.

## Tech Stack
- Node.js / Express
- MongoDB Atlas + Mongoose
- JWT (jsonwebtoken) for auth
- bcryptjs for password hashing
- express-validator for input validation

## Getting Started

```bash
cd backend
npm install
cp .env.example .env   # then fill in MONGO_URI and JWT_SECRET
npm run dev            # starts on http://localhost:5000
```

Seed demo data (a demo admin account + starter menu):
```bash
npm run seed
```
Demo admin login after seeding: `admin@theonlineeatery.com` / `Admin123!`

## Folder Structure
```
src/
  config/       # DB connection
  controllers/  # request handlers
  middleware/   # auth guard, error handler, validation
  models/       # Mongoose schemas: User, Menu, Order
  routes/       # Express route definitions
  services/     # reusable business logic (order total calc, status transitions)
  utils/        # helpers (JWT signing, async handler, seed script)
  validators/   # express-validator rule sets
server.js       # entry point
```

## API Reference

Base URL: `/api`

### Auth — `/api/auth`
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new customer |
| POST | `/login` | Public | Log in, returns JWT |
| GET | `/profile` | Private | Get own profile |
| PUT | `/profile` | Private | Update own profile |

### Menu — `/api/menu`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List meals. Query: `search`, `category`, `minPrice`, `maxPrice`, `page`, `limit` |
| GET | `/categories` | Public | List distinct categories |
| GET | `/:id` | Public | Get one meal |
| POST | `/` | Admin | Create a meal |
| PUT | `/:id` | Admin | Update a meal |
| DELETE | `/:id` | Admin | Delete a meal |

### Orders — `/api/orders`
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/` | Customer | Place an order (checkout) |
| GET | `/mine` | Customer | Own order history |
| GET | `/:id` | Owner/Admin | Get a single order |
| GET | `/` | Admin | List all orders (filter by `?status=`) |
| PATCH | `/:id/status` | Admin | Update order status |
| GET | `/dashboard/metrics` | Admin | Total orders, pending orders, revenue |

### Auth Header
```
Authorization: Bearer <token>
```

### Order Status Flow
`Pending → Preparing → Out for Delivery → Delivered`, or `Cancelled` from Pending/Preparing/Out for Delivery. Invalid transitions return `400`.

### Error Responses
All errors return:
```json
{ "success": false, "message": "..." }
```
Status codes used: `400` (validation/bad request), `401` (auth required/invalid), `403` (forbidden — wrong role or not the resource owner), `404` (not found), `500` (server error).

## Deployment
Deploy to Render or Railway. Set environment variables (`MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_ORIGIN`, `PORT`) in the platform's dashboard — never commit `.env`.
