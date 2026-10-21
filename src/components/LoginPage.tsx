import React, { useState } from 'react';
import { ArrowRight, Compass, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';

type LoginPageProps = {
  onContinue: () => void;
};

export function LoginPage({ onContinue }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [notice, setNotice] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: { email?: string; password?: string } = {};
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      nextErrors.email = 'Enter your university or personal email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!password) {
      nextErrors.password = 'Enter your password to continue.';
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(nextErrors);
    setNotice('');

    if (Object.keys(nextErrors).length === 0) {
      // This is a front-end prototype. No credentials are sent to or verified by a server.
      setNotice('Prototype mode: credentials are not verified. Continuing to the course explorer.');
      onContinue();
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fbfaf8] px-4 py-10 text-stone-900">
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#f3dfd8] opacity-70 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#f2e9d9] opacity-70 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl shadow-stone-900/5 md:grid-cols-2">
        <section className="flex flex-col justify-between bg-[#a83a25] p-8 text-white sm:p-10 md:p-12">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
              <Compass size={24} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">Course Compass</p>
              <p className="text-xs text-white/70">Ahmedabad University</p>
            </div>
          </div>

          <div className="my-12">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Your next semester starts here</p>
            <h1 className="max-w-sm text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Find courses that fit your journey.
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/80">
              Explore offerings, discover recommendations, and keep your course shortlist in one place.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm text-white/85">
              <span className="h-px w-8 bg-white/60" />
              Make your next academic choice with confidence.
            </div>
          </div>

          <p className="text-xs text-white/60">Winter 2027 course offerings</p>
        </section>

        <section className="p-7 sm:p-10 md:p-12">
          <div className="mb-8">
            <p className="text-sm font-semibold text-[#a83a25]">Welcome back</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Sign in to continue</h2>
            <p className="mt-3 text-sm leading-6 text-stone-500">
              Enter your details to open your Course Compass workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-stone-700">Email address</label>
              <div className={`flex items-center gap-3 rounded-xl border bg-white px-3.5 transition focus-within:border-[#b83e26] focus-within:ring-4 focus-within:ring-[#b83e26]/10 ${errors.email ? 'border-red-400' : 'border-stone-200'}`}>
                <Mail size={18} className="shrink-0 text-stone-400" aria-hidden="true" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => { setEmail(event.target.value); setErrors((current) => ({ ...current, email: undefined })); }}
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'login-email-error' : undefined}
                  className="min-w-0 flex-1 bg-transparent py-3.5 text-sm outline-none placeholder:text-stone-400"
                />
              </div>
              {errors.email && <p id="login-email-error" role="alert" className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-stone-700">Password</label>
              <div className={`flex items-center gap-3 rounded-xl border bg-white px-3.5 transition focus-within:border-[#b83e26] focus-within:ring-4 focus-within:ring-[#b83e26]/10 ${errors.password ? 'border-red-400' : 'border-stone-200'}`}>
                <LockKeyhole size={18} className="shrink-0 text-stone-400" aria-hidden="true" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => { setPassword(event.target.value); setErrors((current) => ({ ...current, password: undefined })); }}
                  placeholder="At least 6 characters"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'login-password-error' : undefined}
                  className="min-w-0 flex-1 bg-transparent py-3.5 text-sm outline-none placeholder:text-stone-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="rounded-md p-1 text-stone-400 transition hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b83e26]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p id="login-password-error" role="alert" className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
            </div>

            <button type="submit" className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#b83e26] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#9e321e] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#b83e26]/20">
              Continue to Course Compass
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            {notice && <p role="status" className="text-xs leading-5 text-amber-700">{notice}</p>}
          </form>

          <div className="mt-7 rounded-xl bg-stone-50 px-4 py-3.5">
            <p className="text-xs leading-5 text-stone-500">
              <strong className="font-semibold text-stone-700">Prototype notice:</strong> this screen currently checks form input only. Real account verification requires a configured authentication service.
            </p>
          </div>

          <p className="mt-8 text-center text-xs text-stone-400">Built for the Ahmedabad University student community</p>
        </section>
      </div>
    </main>
  );
}
