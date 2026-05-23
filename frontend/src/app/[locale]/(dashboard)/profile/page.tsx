import type { Metadata } from 'next';
import { ProfileClient } from './ProfileClient';

export const metadata: Metadata = {
  title: 'Profile',
};

// Auth-bound, kullanıcıya özel — static prerender'da SSR fetch takılıyor.
export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  return <ProfileClient />;
}
