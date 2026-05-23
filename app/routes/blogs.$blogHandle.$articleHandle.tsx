import {useLoaderData} from 'react-router';
import type {Route} from './+types/blogs.$blogHandle.$articleHandle';
import {Image} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `${data?.article.title ?? 'Article'} | NexGen Toys`}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request, params}: Route.LoaderArgs) {
  const {blogHandle, articleHandle} = params;

  if (!articleHandle || !blogHandle) {
    throw new Response('Not found', {status: 404});
  }

  const [{blog}] = await Promise.all([
    context.storefront.query(ARTICLE_QUERY, {
      variables: {blogHandle, articleHandle},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(
    request,
    {
      handle: articleHandle,
      data: blog.articleByHandle,
    },
    {
      handle: blogHandle,
      data: blog,
    },
  );

  const article = blog.articleByHandle;

  return {article};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Article() {
  const {article} = useLoaderData<typeof loader>();
  const {title, image, contentHtml, author} = article;

  const publishedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));

  return (
    <article className="bg-nexgen-mist dark:bg-[#070b1a]">
      <header className="relative overflow-hidden bg-gradient-to-br from-nexgen-night via-nexgen-purple to-nexgen-orange text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_60%_30%,white_0%,transparent_45%)]" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-5 sm:px-6 lg:px-10 py-12 sm:py-16">
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight">{title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/85">
            <time dateTime={article.publishedAt}>{publishedDate}</time>
            {author?.name && (<><span aria-hidden>•</span><address className="not-italic">{author.name}</address></>)}
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-10 py-10 sm:py-14">
        {image && (
          <div className="rounded-3xl overflow-hidden ring-1 ring-nexgen-night/5 dark:ring-white/10 shadow-xl mb-8">
            <Image data={image} sizes="90vw" loading="eager" className="w-full h-auto object-cover" />
          </div>
        )}
        <div
          dangerouslySetInnerHTML={{__html: contentHtml}}
          className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-nexgen-night/85 dark:text-slate-300 [&_h2]:font-display [&_h2]:font-black [&_h2]:text-nexgen-night dark:[&_h2]:text-white [&_h3]:font-display [&_h3]:font-bold [&_h3]:text-nexgen-night dark:[&_h3]:text-white [&_a]:text-nexgen-orange [&_a]:underline [&_strong]:text-nexgen-night dark:[&_strong]:text-white"
        />
      </div>
    </article>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog#field-blog-articlebyhandle
const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      handle
      articleByHandle(handle: $articleHandle) {
        handle
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
` as const;
