import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { ShoppingBag, X } from 'lucide-react';

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp, isLoading } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await signUp({ name, email, password });
      navigate('/');
    } catch (error) {
      setErrors({ form: 'Failed to create account' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
      >
        <X className="h-6 w-6 text-gray-600" />
      </button>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <ShoppingBag className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/signin" className="font-medium text-green-600 hover:text-green-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.form && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {errors.form}
              </div>
            )}

            <Input
              label="Full name"
              name="name"
              type="text"
              autoComplete="name"
              error={errors.name}
            />

            <Input
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              error={errors.email}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              error={errors.password}
            />

            <Input
              label="Confirm password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              error={errors.confirmPassword}
            />

            <Button type="submit" isLoading={isLoading}>
              Create account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}