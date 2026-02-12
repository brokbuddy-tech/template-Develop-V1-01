'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(prevState: { error: string } | undefined, formData: FormData) {
  const password = formData.get('password');

  // In a real application, use a secure, environment-variable-based password
  if (password === process.env.VIP_PASSWORD || password === 'develop-vip') {
    cookies().set('vip_access', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    redirect('/vip-portal');
  }

  return {
    error: 'Incorrect password. Please try again.',
  };
}

export async function logout() {
  cookies().set('vip_access', 'false', { maxAge: -1 });
  redirect('/vip-portal/login');
}
