export function NewsletterCTA() {
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
          <form
            className="relative mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="parent@example.com"
              className="flex-1 rounded-full bg-white/10 ring-1 ring-white/20 px-5 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-nexgen-orange"
            />
            <button
              type="submit"
              className="rounded-full nexgen-gradient px-6 py-3 font-semibold hover:-translate-y-0.5 transition-transform"
            >
              Join free
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
