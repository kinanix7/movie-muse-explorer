
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film } from 'lucide-react';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import { cn } from '@/lib/utils';

interface NavItemProps {
  to: string;
  label: string;
  currentPath: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, currentPath }) => {
  const isActive = currentPath === to;
  
  return (
    <Link
      to={to}
      className={cn(
        'px-3 py-2 text-sm font-medium rounded-md transition-colors',
        isActive 
          ? 'bg-primary/10 text-primary' 
          : 'hover:bg-secondary text-foreground/70 hover:text-foreground'
      )}
    >
      {label}
    </Link>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/popular', label: 'Popular' },
    { to: '/top-rated', label: 'Top Rated' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <Film className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">MovieMuse</span>
              </Link>
              <div className="md:hidden">
                <ThemeToggle />
              </div>
            </div>
            
            <SearchBar />
            
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          </div>
          
          <nav className="flex space-x-1 mt-4 overflow-x-auto pb-2">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                label={item.label}
                currentPath={location.pathname}
              />
            ))}
          </nav>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="border-t py-6 bg-background">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 MovieMuse. Powered by TMDb API.</p>
          <p className="mt-1">Created for educational purposes. Not a commercial application.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
