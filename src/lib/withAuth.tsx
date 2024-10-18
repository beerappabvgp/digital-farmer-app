// lib/withAuth.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const ProtectedComponent = (props: any) => {
    const router = useRouter();
    const auth = useAppSelector((state) => state.auth);

    useEffect(() => {
      if (!auth?.accessToken) {
        router.push('/signin'); // Redirect to sign-in page if not logged in
      }
    }, [auth, router]);

    // Render the wrapped component only if the user is authenticated
    return auth?.accessToken ? <WrappedComponent {...props} /> : null;
  };

  return ProtectedComponent;
};

export default withAuth;
