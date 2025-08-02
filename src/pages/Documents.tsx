import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { User } from '@supabase/supabase-js';

interface DocumentsPageProps {
  user: User;
}

export const DocumentsPage = ({ user }: DocumentsPageProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect to dashboard with documents tab if not already there
    if (location.pathname === '/documents') {
      navigate('/dashboard?tab=documents', { replace: true });
    }
  }, [location.pathname, navigate]);

  return <Dashboard user={user} defaultTab="documents" />;
};