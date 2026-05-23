import {Link} from 'react-router';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams, type RegularSearchReturn} from '~/lib/search';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & {term: string}) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsArticles({
  term,
  articles,
}: PartialSearchResult<'articles'>) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <section>
      <h2 className="font-display font-black uppercase tracking-wider text-sm text-nexgen-night/60 dark:text-slate-400 mb-3">Articles</h2>
      <ul className="divide-y divide-nexgen-night/10 dark:divide-white/10 rounded-2xl bg-white dark:bg-[#0d1326] ring-1 ring-nexgen-night/5 dark:ring-white/10 overflow-hidden">
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <li key={article.id}>
              <Link prefetch="intent" to={articleUrl} className="block px-5 py-3 text-nexgen-night dark:text-slate-100 hover:bg-nexgen-mist dark:hover:bg-white/5 hover:text-nexgen-orange transition">
                {article.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function SearchResultsPages({term, pages}: PartialSearchResult<'pages'>) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <section>
      <h2 className="font-display font-black uppercase tracking-wider text-sm text-nexgen-night/60 dark:text-slate-400 mb-3">Pages</h2>
      <ul className="divide-y divide-nexgen-night/10 dark:divide-white/10 rounded-2xl bg-white dark:bg-[#0d1326] ring-1 ring-nexgen-night/5 dark:ring-white/10 overflow-hidden">
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <li key={page.id}>
              <Link prefetch="intent" to={pageUrl} className="block px-5 py-3 text-nexgen-night dark:text-slate-100 hover:bg-nexgen-mist dark:hover:bg-white/5 hover:text-nexgen-orange transition">
                {page.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function SearchResultsProducts({
  term,
  products,
}: PartialSearchResult<'products'>) {
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <section>
      <h2 className="font-display font-black uppercase tracking-wider text-sm text-nexgen-night/60 dark:text-slate-400 mb-3">Products</h2>
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
          const ItemsMarkup = nodes.map((product) => {
            const productUrl = urlWithTrackingParams({
              baseUrl: `/products/${product.handle}`,
              trackingParams: product.trackingParameters,
              term,
            });

            const price = product?.selectedOrFirstAvailableVariant?.price;
            const image = product?.selectedOrFirstAvailableVariant?.image;

            return (
              <li key={product.id}>
                <Link
                  prefetch="intent"
                  to={productUrl}
                  className="flex items-center gap-4 p-3 sm:p-4 rounded-2xl bg-white dark:bg-[#0d1326] ring-1 ring-nexgen-night/5 dark:ring-white/10 hover:shadow-lg hover:-translate-y-0.5 transition"
                >
                  <div className="size-16 sm:size-20 shrink-0 rounded-xl bg-nexgen-cream dark:bg-white/5 overflow-hidden flex items-center justify-center">
                    {image && (
                      <Image data={image} alt={product.title} width={80} className="w-full h-full object-contain p-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-nexgen-night dark:text-white line-clamp-2">{product.title}</p>
                    <span className="mt-1 inline-block text-sm font-display font-black text-nexgen-purple dark:text-nexgen-yellow tabular-nums">
                      {price && <Money data={price} />}
                    </span>
                  </div>
                </Link>
              </li>
            );
          });

          return (
            <div className="space-y-3">
              <div className="flex justify-center">
                <PreviousLink className="text-sm font-semibold text-nexgen-purple hover:text-nexgen-orange transition">
                  {isLoading ? 'Loading…' : <span>↑ Load previous</span>}
                </PreviousLink>
              </div>
              <ul className="space-y-3">{ItemsMarkup}</ul>
              <div className="flex justify-center pt-2">
                <NextLink className="inline-flex items-center gap-1 rounded-full bg-nexgen-night dark:bg-white/15 text-white font-bold px-5 py-2.5 text-sm hover:scale-[1.02] transition">
                  {isLoading ? 'Loading…' : <span>Load more ↓</span>}
                </NextLink>
              </div>
            </div>
          );
        }}
      </Pagination>
    </section>
  );
}

function SearchResultsEmpty() {
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-3" aria-hidden>🔍</div>
      <p className="text-nexgen-night/70 dark:text-slate-400">No results. Try a different search.</p>
    </div>
  );
}
