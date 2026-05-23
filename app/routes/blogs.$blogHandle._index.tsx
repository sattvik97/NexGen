import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/blogs.$blogHandle._index';
import {Image, getPaginationVariables} from '@shopify/hydrogen';
import type {ArticleItemFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `${data?.blog.title ?? 'Blog'} | NexGen Toys`}];
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
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  if (!params.blogHandle) {
    throw new Response(`blog not found`, {status: 404});
  }

  const [{blog}] = await Promise.all([
    context.storefront.query(BLOGS_QUERY, {
      variables: {
        blogHandle: params.blogHandle,
        ...paginationVariables,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!blog?.articles) {
    throw new Response('Not found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle: params.blogHandle, data: blog});

  return {blog};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Blog() {
  const {blog} = useLoaderData<typeof loader>();
  const {articles} = blog;

  return (
    <div className="bg-nexgen-mist dark:bg-[#070b1a] min-h-[60vh]">
      <section className="relative overflow-hidden bg-gradient-to-br from-nexgen-orange via-nexgen-purple to-nexgen-teal text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_50%,white_0%,transparent_45%)]" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-12 sm:py-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">Blog</p>
          <h1 className="mt-2 font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight">{blog.title}</h1>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10 py-10 sm:py-14">
        <PaginatedResourceSection<ArticleItemFragment> connection={articles} resourcesClassName="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {({node: article, index}) => (
            <ArticleItem
              article={article}
              key={article.id}
              loading={index < 2 ? 'eager' : 'lazy'}
            />
          )}
        </PaginatedResourceSection>
      </div>
    </div>
  );
}

function ArticleItem({
  article,
  loading,
}: {
  article: ArticleItemFragment;
  loading?: HTMLImageElement['loading'];
}) {
  const publishedAt = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt!));
  return (
    <Link
      to={`/blogs/${article.blog.handle}/${article.handle}`}
      key={article.id}
      className="group block rounded-3xl overflow-hidden bg-white dark:bg-[#0d1326] ring-1 ring-nexgen-night/5 dark:ring-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
    >
      {article.image && (
        <div className="aspect-[3/2] bg-nexgen-cream dark:bg-white/5 overflow-hidden">
          <Image
            alt={article.image.altText || article.title}
            aspectRatio="3/2"
            data={article.image}
            loading={loading}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        </div>
      )}
      <div className="p-5 sm:p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-nexgen-purple">{publishedAt}</p>
        <h3 className="mt-2 font-display font-black text-lg sm:text-xl text-nexgen-night dark:text-white group-hover:text-nexgen-orange transition line-clamp-2">{article.title}</h3>
      </div>
    </Link>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Blog(
    $language: LanguageCode
    $blogHandle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      title
      handle
      seo {
        title
        description
      }
      articles(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ArticleItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          hasNextPage
          endCursor
          startCursor
        }

      }
    }
  }
  fragment ArticleItem on Article {
    author: authorV2 {
      name
    }
    contentHtml
    handle
    id
    image {
      id
      altText
      url
      width
      height
    }
    publishedAt
    title
    blog {
      handle
    }
  }
` as const;
