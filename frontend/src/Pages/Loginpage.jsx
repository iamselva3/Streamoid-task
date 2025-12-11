// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login } from '../endpoint.js';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: ({ email, password }) => login({ email, password }),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('name', data.name || data.email);

      setTimeout(() => navigate('/'), 1500); // small delay so toast shows
      toast.success(`Logged in as ${data.role}`, { autoClose: 1500 });
    },
    onError: (err) => {
      toast.error('Login failed: ' + (err?.response?.data?.error || err.message));
    }
  });

  const submit = (e) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <ToastContainer />

      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email" className="w-full p-2 border rounded" />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="password" type="password" className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          {mutation.isLoading ? 'Logging...' : 'Login'}
        </button>
      </form>

      <div className="text-sm text-gray-500 mt-3">
        Use seeded accounts: admin@local / AdminPass123!, seller@local / SellerPass123!
      </div>
    </div>
  );
}
