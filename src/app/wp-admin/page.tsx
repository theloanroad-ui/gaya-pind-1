import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

/**
 * WordPress admin shorthand route forwarding to the standalone portal.
 */
export default function WpAdminRedirectPage() {
  redirect('/wp-admin.html');
}

