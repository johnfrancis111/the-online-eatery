export default function Footer() {
  return (
    <footer className="mt-20 border-t border-ivory-300/10 py-8">
      <div className="mx-auto max-w-6xl px-5 text-center text-xs text-ivory-300/40">
        <p>&copy; {new Date().getFullYear()} The Online Eatery. Made to order, delivered hot.</p>
      </div>
    </footer>
  );
}
