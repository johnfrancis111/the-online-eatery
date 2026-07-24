import { NavLink, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-pepper/15 text-turmeric' : 'text-ivory-300/70 hover:bg-char-800 hover:text-ivory'
  }`;

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-5 py-8">
        <aside className="w-48 shrink-0">
          <p className="eyebrow mb-3 px-3">Admin</p>
          <nav className="flex flex-col gap-1">
            <NavLink to="/admin" end className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/menu" className={linkClass}>
              Menu
            </NavLink>
            <NavLink to="/admin/orders" className={linkClass}>
              Orders
            </NavLink>
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}
