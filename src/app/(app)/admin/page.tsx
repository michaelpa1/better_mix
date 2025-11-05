import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Redirect to existing admin page
  redirect('/admin/users');
}