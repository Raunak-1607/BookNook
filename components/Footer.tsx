import { BookOpen } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full bg-[#104e5b] text-white">
      <div className="mx-auto flex justify-between max-w-[1200px] gap-8 px-6 py-8 ">
        {/* Logo and Description */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-orange-400" />
            <h2 className="text-lg font-bold">BookNook</h2>
          </div>

          <p className="max-w-[250px] text-sm">
            A small online library. Add a book, borrow a book, return a book.
          </p>
        </div>

       

        {/* Social Links */}
        <div>
          <h3 className="mb-2 font-semibold">Follow us</h3>

          <div className="mb-3 flex items-center gap-3">
            <a href="#" aria-label="X">
              <FaXTwitter size={17} />
            </a>

            <a href="#" aria-label="LinkedIn">
              <FaLinkedinIn size={16} />
            </a>

            <a href="#" aria-label="Facebook">
              <FaFacebookF size={15} />
            </a>

            <a href="#" aria-label="Instagram">
              <FaInstagram size={16} />
            </a>
          </div>

          <p className="text-xs">© 2026 BookNook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
