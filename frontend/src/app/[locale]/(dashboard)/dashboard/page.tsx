import type { Metadata } from 'next';
import { DashboardClient } from './DashboardClient';

export const metadata: Metadata = {
  title: 'Dashboard',
};

// Auth-bound, kullanıcıya özel — static prerender'da SSR fetch takılıyor.
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return <DashboardClient />;
}
