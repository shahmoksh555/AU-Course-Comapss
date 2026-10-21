import React, { useState } from 'react';
import { Compass, Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { supabase } from '../lib/supabase';

type PasswordResetPageProps = {
  onComplete: () => void;
};

export function PasswordResetPage({ onComplete }: PasswordResetPageProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('Use at least 6 characters for your new password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }
    if (!supabase) {
      setError('Supabase is not configured for this deployment.');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setSuccess('Your password has been updated. Signing you out so you can sign in with the new password.');
      await supabase.auth.signOut();
      onComplete();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not update your password. Request a new reset link and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbfaf8] px-4 py-10 text-stone-900">
      <section className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-7 shadow-xl shadow-stone-900/5 sm:p-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#b83e26] text-white"><Compass size={24} /></div>
          <div><p className="font-bold">Course Compass</p><p className="text-xs text-stone-500">Ahmedabad University</p></div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Choose a new password</h1>
        <p className="mt-2 text-sm leading-6 text-stone-500">Create a new password for your Course Compass account.</p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-stone-700">New password</label>
            <div className="flex items-center gap-3 rounded-xl border border-stone-200 px-3.5 focus-within:border-[#b83e26] focus-within:ring-4 focus-within:ring-[#b83e26]/10">
              <LockKeyhole size={18} className="text-stone-400" />
              <input id="new-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="min-w-0 flex-1 bg-transparent py-3.5 text-sm outline-none" placeholder="At least 6 characters" />
              <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)} className="text-stone-400 hover:text-stone-700">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
          </div>
          <div>
            <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-stone-700">Confirm new password</label>
            <input id="confirm-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-xl border border-stone-200 px-3.5 py-3.5 text-sm outline-none focus:border-[#b83e26] focus:ring-4 focus:ring-[#b83e26]/10" placeholder="Re-enter your password" />
          </div>
          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-xs leading-5 text-red-700">{error}</p>}
          {success && <p role="status" className="rounded-lg bg-green-50 p-3 text-xs leading-5 text-green-800">{success}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#b83e26] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#9e321e] disabled:opacity-60">{loading ? 'Updating password…' : 'Update password'}</button>
        </form>
      </section>
    </main>
  );
}
