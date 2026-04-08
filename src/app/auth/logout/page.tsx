import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Call logout API
    fetch('/api/auth/logout', {
      method: 'POST',
    })
      .then((res) => res.json())
      .then(() => {
        // Clear any client-side storage
        if (typeof window !== 'undefined') {
          localStorage.clear();
          sessionStorage.clear();
        }
        // Redirect to login page
        router.replace('/auth/login');
      })
      .catch((err) => {
        console.error('Logout failed', err);
        router.replace('/auth/login');
      });
  }, []);

  return null; // No UI needed; redirects automatically
}
