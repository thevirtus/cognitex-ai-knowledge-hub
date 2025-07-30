import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { User } from '@supabase/supabase-js';

interface NavbarProps {
  user?: User | null;
}

export const Navbar = ({ user }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = user ? [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Documents', path: '/documents' },
    { name: 'Chat', path: '/chat' },
    { name: 'Settings', path: '/settings' }
  ] : [
    { name: 'Features', path: '/#features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Cognitex</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path) 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Link to="/settings">
                <Button variant="outline" size="sm">
                  Account
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="shadow-glow transition-smooth">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-3 py-2 text-base font-medium transition-colors hover:text-primary ${
                    isActive(link.path) 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted-foreground'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="px-3 py-2 space-y-2">
                {user ? (
                  <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Account
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full shadow-glow transition-smooth">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};