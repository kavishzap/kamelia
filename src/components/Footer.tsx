export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#050505] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center text-sm text-[#9a948a] sm:flex-row sm:text-left">
        <p className="font-[family-name:var(--font-display)] text-lg text-[#f5f0e8]">Kamelia</p>
        <p>© {new Date().getFullYear()} Kamelia — The Floral Designer. All rights reserved.</p>
        <a href="#contact" className="font-medium text-[#c9a962] hover:text-[#d4bc7a]">
          Plan Your Event
        </a>
      </div>
    </footer>
  );
}
