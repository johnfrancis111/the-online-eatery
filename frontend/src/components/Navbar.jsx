import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${isActive ? 'text-turmeric' : 'text-ivory-300/70 hover:text-ivory'}`;

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ivory-300/10 bg-char-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <NavLink to="/" className="flex items-baseline gap-2">
          <span className="font-display text-xl font-semibold text-ivory">The Online Eatery</span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-turmeric sm:inline">
            hot &amp; on time
          </span>
        </NavLink>

        <nav className="flex items-center gap-6">
          <NavLink to="/" end className={navLinkClass}>
            Menu
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/orders" className={navLinkClass}>
              My Orders
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}

          <NavLink to="/cart" className="relative">
            <span className="btn-ghost !px-3 !py-1.5">
              Cart
              {itemCount > 0 && (
                <span className="ml-1 rounded-full bg-pepper px-1.5 py-0.5 text-[11px] font-mono leading-none text-ivory">
                  {itemCount}
                </span>
              )}
            </span>
          </NavLink>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <NavLink to="/profile" className="text-sm text-ivory-300/70 hover:text-ivory">
                {user?.name?.split(' ')[0]}
              </NavLink>
              <button onClick={handleLogout} className="btn-ghost !px-3 !py-1.5 text-xs">
                Log out
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="btn-primary !px-4 !py-1.5 text-xs">
              Log in
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
