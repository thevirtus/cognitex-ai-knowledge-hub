import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { User } from '@supabase/supabase-js';

interface ChatPageProps {
  user: User;
}

export const ChatPage = ({ user }: ChatPageProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect to dashboard with chat tab if not already there
    if (location.pathname === '/chat') {
      navigate('/dashboard?tab=chat', { replace: true });
    }
  }, [location.pathname, navigate]);

  return <Dashboard user={user} defaultTab="chat" />;
};