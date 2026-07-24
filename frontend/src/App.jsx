import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import AdminRoute from './routes/AdminRoute.jsx';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderHistory from './pages/OrderHistory.jsx';
import OrderDetail from './pages/OrderDetail.jsx';
import NotFound from './pages/NotFound.jsx';
import MealDetail from './pages/MealDetail.jsx';

import Dashboard from './pages/admin/Dashboard.jsx';
import MenuManage from './pages/admin/MenuManage.jsx';
import OrdersManage from './pages/admin/OrdersManage.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public / customer-facing */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/menu/:id" element={<MealDetail />} />

        {/* Requires a logged-in user (customer or admin) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin-only */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="menu" element={<MenuManage />} />
          <Route path="orders" element={<OrdersManage />} />
        </Route>
      </Route>
    </Routes>
  );
}
