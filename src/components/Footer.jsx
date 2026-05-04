import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full py-2 px-6 flex flex-col md:flex-row justify-center items-center gap-3 md:gap-6 text-[10px] font-hand tracking-widest text-[var(--color-ink-muted)] opacity-60 hover:opacity-100 transition-opacity">
      <span className="uppercase text-center">© 2026 2011 Music Group / Piper Connolly</span>
      <div className="flex gap-4">
        <Link to="/privacy" className="hover:text-[var(--color-oxblood)] transition-colors uppercase border-b border-transparent hover:border-[var(--color-oxblood)]">
          Privacy Policy
        </Link>
        <span className="opacity-30">|</span>
        <a href="https://2011musicgroup.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-oxblood)] transition-colors uppercase border-b border-transparent hover:border-[var(--color-oxblood)]">
          Contact
        </a>
      </div>
      <span className="hidden lg:inline italic opacity-50">✦ piper connolly "beautiful life" fan activation ✦</span>
    </footer>
  );
}
