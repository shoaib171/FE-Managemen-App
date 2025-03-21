
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthModal } from '@/components/Auth/AuthModal';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for token in URL (from Google OAuth)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (token) {
      localStorage.setItem('token', token);
      window.location.href = '/';
    }
  }, []);
  
  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    }
  }, [isAuthenticated, navigate, location]);
  
  // Close modal handler
  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open && !isAuthenticated) {
      navigate('/');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <AuthModal open={isModalOpen} onOpenChange={handleModalClose} />
    </div>
  );
};

export default Login;
