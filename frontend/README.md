# The Online Eatery — Frontend

React SPA (Vite + Tailwind) for The Online Eatery food ordering platform. Talks to the
Node/Express backend in `backend/` over the REST API.

## Stack

- React 18 + React Router 6
- Axios for API calls
- Tailwind CSS for styling
- Vite for dev/build tooling

## Folder structure

```
frontend/src/
  assets/       static images (none required — menu images come from imageUrl)
  components/   shared UI: Navbar, MenuCard, StatusTracker, StatusBadge, Spinner, EmptyState, Footer
  contexts/     AuthContext (session), CartContext (client-side cart)
  hooks/        useAuth, useCart
  layouts/      MainLayout (customer), AdminLayout (admin sidebar)
  pages/        Home, Login, Register, Profile, Cart, Checkout, OrderHistory, OrderDetail, NotFound
  pages/admin/  Dashboard, MenuManage, OrdersManage
  routes/       ProtectedRoute (logged-in only), AdminRoute (admin only)
  services/     apiClient.js (axios instance), authApi.js, menuApi.js, orderApi.js
  utils/        format.js (currency/date), constants.js (order status flow)
```

## Setup

1. **Install dependencies** (from the `frontend/` folder):

   ```
   npm install
   ```

   Note: given the Node install issues you hit on the backend (installer error 2755),
   you're already on Node v24.18.0 via the zip method — that's fine for this project too.
   If `npm` scripts get blocked again in a PowerShell terminal, switch VS Code's terminal
   to Command Prompt, same fix as before.

2. **Configure the API URL.** Copy `.env.example` to `.env`:

   ```
   cp .env.example .env
   ```

   By default it points at `http://localhost:5000/api`, matching your backend's `PORT=5000`.
   Change `VITE_API_URL` if your backend runs elsewhere.

3. **Make sure the backend's CORS allows this app.** In `backend/.env`, `CLIENT_ORIGIN`
   should include `http://localhost:5173` (Vite's default dev port) — that's already the
   default in `.env.example`.

4. **Run the dev server:**

   ```
   npm run dev
   ```

   Opens at `http://localhost:5173`.

5. **Build for production:**

   ```
   npm run build
   ```

   Outputs static files to `dist/`, ready to deploy to Vercel or Netlify. Set
   `VITE_API_URL` as an environment variable in your hosting dashboard to point at your
   deployed backend.

## Trying it out

- Register a new customer account, or log in with the seeded admin:
  `admin@theonlineeatery.com` / `Admin123!`
- As a customer: browse `/`, search/filter the menu, add items to cart, check out, and
  track your order status on `/orders/:id`.
- As an admin: `/admin` for revenue/order metrics, `/admin/menu` to add/edit/delete meals,
  `/admin/orders` to move orders through Pending → Preparing → Out for Delivery →
  Delivered (or Cancel), matching the transitions enforced by the backend's
  `orderService.isValidTransition`.

## Notes on how this integrates with your backend

- The server is always the source of truth for order totals — the frontend cart only
  shows an *estimated* total from the last known price; `POST /api/orders` re-prices
  everything server-side, exactly as your backend already does.
- Auth token is stored in `localStorage` and attached to every request via an Axios
  interceptor. A 401 response clears the local session automatically.
- Admin route guards are client-side UX only — your backend's `protect` / `adminOnly`
  middleware remains the real enforcement layer.
