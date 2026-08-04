import * as React from 'react';
import { buyerService } from '@/services';
import { ProfileClient } from '@/components/buyer/ProfileClient';

export default async function ProfilePage() {
  const initialProfile = await buyerService.getBuyerProfile();

  return <ProfileClient initialProfile={initialProfile} />;
}
