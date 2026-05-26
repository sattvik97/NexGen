import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/policies.$handle';
import {
  NEXGEN_POLICIES,
  type NexGenPolicyHandle,
} from '~/data/nexgenPolicies';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `${data?.policy.title ?? 'Policy'} | NexGen Toys`}];
};

export async function loader({params, context}: Route.LoaderArgs) {
  if (!params.handle) {
    throw new Response('No handle was passed in', {status: 404});
  }

  const handle = params.handle as NexGenPolicyHandle;
  const fallback = NEXGEN_POLICIES[handle];

  // NexGen Toys policies are authored locally (see app/data/nexgenPolicies.ts)
  // so the content we ship is always the source of truth. We no longer fetch
  // from the Shopify Storefront API here — the upstream mock.shop store
  // returns generic policy text that would otherwise override our own.
  const policy = fallback;
  if (!policy) {
    throw new Response('Could not find the policy', {status: 404});
  }

  return {policy};
}

export default function Policy() {
  const {policy} = useLoaderData<typeof loader>();

  return (
    <article className="bg-nexgen-mist dark:bg-[#070b1a] min-h-[60vh]">
      <header className="relative overflow-hidden bg-gradient-to-br from-nexgen-night via-nexgen-purple to-nexgen-orange text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_60%_30%,white_0%,transparent_45%)]" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-5 sm:px-6 lg:px-10 py-10 sm:py-14">
          <Link to="/policies" className="inline-flex items-center gap-1 text-sm font-semibold text-white/85 hover:text-white transition">← Back to Policies</Link>
          <h1 className="mt-3 font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight">{policy.title}</h1>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-10 py-10 sm:py-14">
        <div
          dangerouslySetInnerHTML={{__html: policy.body}}
          className={[
            'max-w-none text-[15px] sm:text-base leading-7 sm:leading-8 text-nexgen-night/85 dark:text-slate-300',
            // Paragraphs
            '[&_p]:my-4 [&_p]:first:mt-0',
            // Headings
            '[&_h2]:font-display [&_h2]:font-black [&_h2]:text-nexgen-night dark:[&_h2]:text-white',
            '[&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h2]:tracking-tight [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:first:mt-0',
            '[&_h3]:font-display [&_h3]:font-bold [&_h3]:text-nexgen-night dark:[&_h3]:text-white',
            '[&_h3]:text-lg sm:[&_h3]:text-xl [&_h3]:mt-6 [&_h3]:mb-2',
            // Lists
            '[&_ul]:my-4 [&_ul]:pl-6 [&_ul]:list-disc [&_ul]:space-y-2',
            '[&_ol]:my-4 [&_ol]:pl-6 [&_ol]:list-decimal [&_ol]:space-y-2',
            '[&_li]:marker:text-nexgen-orange [&_li>p]:my-1',
            // Links & emphasis
            '[&_a]:text-nexgen-orange [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-nexgen-purple',
            '[&_strong]:font-semibold [&_strong]:text-nexgen-night dark:[&_strong]:text-white',
            // Horizontal rule between sections (optional, leaves visual breathing room)
            '[&_hr]:my-8 [&_hr]:border-nexgen-night/10 dark:[&_hr]:border-white/10',
          ].join(' ')}
        />
      </div>
    </article>
  );
}


