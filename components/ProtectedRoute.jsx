import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, requiredRole = null, fallbackPath = '/login' }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push(fallbackPath);
        return;
      }

      // Check role if required
      if (requiredRole && user?.role !== requiredRole) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [loading, isAuthenticated, user, requiredRole, router, fallbackPath]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Don't render anything if not authenticated (redirecting)
  if (!isAuthenticated) {
    return null;
  }

  // Don't render if role check fails (redirecting)
  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  // Render children if authenticated and authorized
  return children;
};

export default ProtectedRoute;
