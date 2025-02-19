import { GithubIcon } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="py-6 ">
      <nav className="container px-20 mx-auto  flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="#" className="flex items-center space-x-2">
            {/* eslint-disable-next-line*/}
            <img src="/logo.png" alt="Logo" className="rounded h-8 w-8" />
            <p className="font-bold text-lg">Checked.</p>
          </Link>
          {/* <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/80">
            <Link href="#" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Developers
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Blog
            </Link>
          </div> */}
        </div>
        <a
          href="https://github.com/kriteshtimsina/checked"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-[#4B4ACF] px-4 py-2 rounded-full text-sm font-medium hover:bg-white/90 transition-colors flex group"
        >
          <GithubIcon
            className="mr-2 group-hover:-translate-y-1 transition-transform group-hover:rotate-12"
            size={20}
          />
          Star on GitHub
        </a>
      </nav>
    </header>
  );
}
