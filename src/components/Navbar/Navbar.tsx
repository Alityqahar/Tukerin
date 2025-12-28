import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PillNav from '../PillNav/PillNav';

// Daftar section id dan label
const sections = [
  { label: 'Home', href: '#hero' },
  { label: 'Overview', href: '#overview' },
  { label: 'Fitur', href: '#fitur' },
  { label: 'Produk', href: '#products' },
  { label: 'Leaderboard', href: '#leaderboard' },
  { label: 'Dashboard', href: '/dashboard' }
];

export default function Navbar() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(sections[0].href);

  // Scroll-based navigation: hanya aktif di halaman landing ("/")
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    if (isLandingPage) {
      const handleScroll = () => {
        let current = sections[0].href;
        for (const section of sections) {
          if (!section.href.startsWith('#')) continue;
          const el = document.getElementById(section.href.replace('#', ''));
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 80 && rect.bottom > 80) {
              current = section.href;
              break;
            }
          }
        }
        setActiveSection(current);
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [location.pathname, isLandingPage]);

  // Scroll ke section saat klik navbar (hanya di landing page)
  const handleNavClick = (href: string) => {
    if (isLandingPage && href.startsWith('#')) {
      const id = href.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Penentuan activeHref:
  // - Jika di landing page dan href hash, gunakan section aktif
  // - Jika di route lain, gunakan pathname
  const getActiveHref = () => {
    if (isLandingPage) {
      // Jika sedang di section, aktifkan section
      return activeSection;
    }
    // Aktifkan menu router sesuai pathname
    const routeItem = sections.find(item => item.href === location.pathname);
    return routeItem ? routeItem.href : '';
  };

  return (
    <PillNav
      logo={logo}
      logoAlt="Company Logo"
      items={sections}
      activeHref={getActiveHref()}
      className="custom-nav"
      ease="power2.easeOut"
      baseColor="linear-gradient(120deg, #4a7c23 0%, #8bc34a 100%)"
      pillColor="#ffffff"
      hoveredPillTextColor="#ffffff"
      pillTextColor="#000000"
      onNavClick={handleNavClick}
      scrollNav={isLandingPage}
    />
  );
}

const logo = '/nav-logo.webp';