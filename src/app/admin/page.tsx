import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

/**
 * Single WordPress Editorial Admin Portal entry point (Format 2 removed).
 */
export default function AdminRedirectPage() {
  redirect('/wp-admin.html');
}
