import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiHeart,
  FiShoppingBag,
  FiUser,
  FiMoon,
  FiSun,
  FiChevronDown,
} from "react-icons/fi";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Packages", to: "/packages" },
  { label: "Events", to: "/events" },
  { label: "Store", to: "/store" },
  { label: "Gallery", to: "/gallery" },
] as const;

const MORE_LINKS = [
  { label: "About Us", to: "/about" },
  { label: "Reviews", to: "/reviews" },
  { label: "Contact", to: "/contact" },
] as const;

/** Sticky, glassy navbar that turns solid on scroll. */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { count } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkTone = scrolled || open ? "text-foreground" : "text-primary-foreground";

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "glass shadow-soft" : "bg-transparent",
      )}
    >
      <nav className="container-tp flex h-18 items-center justify-between py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-ocean font-display text-lg font-bold text-primary-foreground shadow-soft">
            T
          </span>
          <span className={cn("font-display text-xl leading-none font-bold", linkTone)}>
            TrekVista
            <span className="block font-sans text-[10px] tracking-[0.28em] opacity-70 uppercase">
              Tours & Treks
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={cn("nav-underline text-sm font-medium transition-colors", linkTone)}
                activeProps={{ className: "text-primary" }}
                activeOptions={{ exact: link.to === "/" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li
            className="relative"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <button
              type="button"
              className={cn("flex items-center gap-1 text-sm font-medium", linkTone)}
            >
              More <FiChevronDown className={cn("transition-transform", moreOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {moreOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="glass absolute top-full left-1/2 w-48 -translate-x-1/2 overflow-hidden rounded-2xl p-2 shadow-card"
                >
                  {MORE_LINKS.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="block rounded-xl px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <IconAction label="Search" tone={linkTone}>
            <FiSearch size={18} />
          </IconAction>
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className={cn("relative hidden rounded-full p-2.5 transition-colors hover:bg-muted sm:block", linkTone)}
          >
            <FiHeart size={18} />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-secondary-foreground">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            aria-label="Cart"
            className={cn("relative rounded-full p-2.5 transition-colors hover:bg-muted", linkTone)}
          >
            <FiShoppingBag size={18} />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={cn("rounded-full p-2.5 transition-colors hover:bg-muted", linkTone)}
          >
            {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          <Link
            to={isAuthenticated ? "/profile" : "/login"}
            className="ml-1 hidden items-center gap-2 rounded-full bg-gradient-ocean px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition-shadow hover:shadow-lift sm:flex"
          >
            <FiUser size={16} />
            {isAuthenticated ? (user?.name?.split(" ")[0] ?? "Profile") : "Sign In"}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className={cn("rounded-full p-2.5 lg:hidden", linkTone)}
          >
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass overflow-hidden lg:hidden"
          >
            <ul className="container-tp flex flex-col gap-1 py-4">
              {[...NAV_LINKS, ...MORE_LINKS].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 font-medium text-foreground transition-colors hover:bg-muted"
                    activeProps={{ className: "bg-muted text-primary" }}
                    activeOptions={{ exact: link.to === "/" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2">
                <Link
                  to={isAuthenticated ? "/profile" : "/login"}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full bg-gradient-ocean px-4 py-3 font-medium text-primary-foreground"
                >
                  <FiUser size={16} /> {isAuthenticated ? "My Profile" : "Sign In"}
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function IconAction({
  children,
  label,
  tone,
}: {
  children: React.ReactNode;
  label: string;
  tone: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn("hidden rounded-full p-2.5 transition-colors hover:bg-muted sm:block", tone)}
    >
      {children}
    </button>
  );
}
