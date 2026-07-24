import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="text-4xl">This plate isn&rsquo;t on the menu</h1>
      <p className="text-ivory-300/60">The page you&rsquo;re looking for doesn&rsquo;t exist.</p>
      <Link to="/" className="btn-primary mt-2">
        Back to menu
      </Link>
    </div>
  );
}
