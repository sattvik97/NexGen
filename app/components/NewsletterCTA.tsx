import {useEffect, useState} from 'react';

const STORAGE_KEY = 'nexgen.newsletter.v1';

type Status = 'idle' | 'submitting' | 'success' | 'already' | 'error';

export function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  // If the user has already joined in a previous visit, greet them.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setStatus('already');
        setMessage(
          `You\u2019re already on the list as ${saved}. We\u2019ll be in touch soon!`,
        );
      }
    } catch {
      /* ignore */
    }
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    // Basic email shape check (the input also has type="email" + required).
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!isValidEmail) {
      setStatus('error');
      setMessage('That email doesn\u2019t look right. Please double-check and try again.');
      return;
    }

    setStatus('submitting');
    setMessage('');

    try {
      // Persist locally so a refresh remembers the user.
      window.localStorage.setItem(STORAGE_KEY, trimmed);

      // Simulated network call \u2014 swap with a real endpoint when ready.
      await new Promise((resolve) => setTimeout(resolve, 600));

      setStatus('success');
      setMessage(
        `Thanks for joining the NexGen Adventure Club! A welcome email is on its way to ${trimmed}.`,
      );
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong on our side. Please try again in a moment.');
    }
  };

  const isDone = status === 'success' || status === 'already';

  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-nexgen-night text-white p-8 sm:p-12 lg:p-16 text-center">
          <div
            aria-hidden
            className="absolute -top-20 -left-20 size-72 rounded-full bg-nexgen-orange/40 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-20 -right-20 size-72 rounded-full bg-nexgen-purple/40 blur-3xl"
          />
          <span className="relative text-xs font-semibold uppercase tracking-widest text-nexgen-yellow">
            NexGen Adventure Club
          </span>
          <h2 className="relative mt-3 font-display font-black text-3xl sm:text-4xl lg:text-5xl">
            Join the club, unlock the{' '}
            <span className="text-gradient">magic</span>
          </h2>
          <p className="relative mt-4 text-white/75 max-w-xl mx-auto">
            Exclusive discounts, new drops, parenting tips and educational
            activities — straight to your inbox. No spam, promise.
          </p>

          {isDone ? (
            <div
              role="status"
              aria-live="polite"
              className="relative mt-8 mx-auto max-w-md rounded-2xl bg-white/10 ring-1 ring-white/20 px-5 py-5 sm:px-6 sm:py-6"
            >
              <div className="flex items-start gap-3 text-left">
                <span
                  aria-hidden
                  className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-nexgen-teal/90 text-nexgen-night"
                >
                  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div className="flex-1">
                  <p className="font-display font-bold text-lg text-white">
                    {status === 'success' ? "You\u2019re in \u2014 welcome!" : 'Welcome back!'}
                  </p>
                  <p className="mt-1 text-sm text-white/80">{message}</p>
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        window.localStorage.removeItem(STORAGE_KEY);
                      } catch {
                        /* ignore */
                      }
                      setStatus('idle');
                      setMessage('');
                    }}
                    className="mt-3 text-xs font-semibold uppercase tracking-wider text-white/70 underline underline-offset-4 hover:text-white"
                  >
                    Use a different email
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form
              className="relative mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={onSubmit}
              noValidate
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') {
                    setStatus('idle');
                    setMessage('');
                  }
                }}
                disabled={status === 'submitting'}
                aria-invalid={status === 'error' || undefined}
                aria-describedby={message ? 'newsletter-msg' : undefined}
                placeholder="parent@example.com"
                className="flex-1 min-w-0 rounded-full bg-white/10 ring-1 ring-white/20 px-5 py-3 text-base text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-nexgen-orange disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="rounded-full nexgen-gradient px-6 py-3 font-semibold hover:-translate-y-0.5 transition-transform disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {status === 'submitting' ? 'Joining\u2026' : 'Join free'}
              </button>
            </form>
          )}

          {status === 'error' && message && (
            <p
              id="newsletter-msg"
              role="alert"
              className="relative mt-4 mx-auto max-w-md text-sm text-nexgen-yellow"
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
