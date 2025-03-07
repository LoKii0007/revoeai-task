import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-900">
        Welcome to Our App
      </h1>
      <p className="text-lg text-center text-gray-600 mb-8 max-w-md">
        Get started by creating an account or signing in to access your dashboard.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/signup">Sign Up</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </div>
  );
}