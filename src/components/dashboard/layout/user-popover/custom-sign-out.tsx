'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import { SignOut as SignOutIcon } from '@phosphor-icons/react/dist/ssr/SignOut';

import { authClient } from '@/lib/auth/custom/client';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';
import { toast } from '@/components/core/toaster';

export function CustomSignOut(): React.JSX.Element {
  const { checkSession } = useUser();

  const router = useRouter();

  const handleSignOut = React.useCallback(async (): Promise<void> => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        logger.error('Sign out error', error);
        toast.error('Something went wrong, unable to sign out');
        return;
      }

      // Refresh the auth state
      await checkSession?.();

      // UserProvider, for this case, will not refresh the router and we need to do it manually
      router.refresh();
      // After refresh, AuthGuard will handle the redirect
    } catch (err) {
      logger.error('Sign out error', err);
      toast.error('Something went wrong, unable to sign out');
    }
  }, [checkSession, router]);

  return (
    <ListItemButton onClick={handleSignOut}>
      <ListItemDecorator>
        <SignOutIcon fontSize="var(--Icon-fontSize)" weight="bold" />
      </ListItemDecorator>
      <ListItemContent>Sign Out</ListItemContent>
    </ListItemButton>
  );
}
