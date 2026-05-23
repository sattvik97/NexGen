import {
  data as remixData,
  Form,
  NavLink,
  Outlet,
  useLoaderData,
} from 'react-router';
import type {Route} from './+types/account';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

export function shouldRevalidate() {
  return true;
}

export async function loader({context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  const {data, errors} = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  const {customer} = useLoaderData<typeof loader>();

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}`
      : `Welcome to your account.`
    : 'Account Details';

  return (
    <div className="bg-nexgen-mist dark:bg-[#070b1a] min-h-[60vh]">
      <section className="relative overflow-hidden bg-gradient-to-br from-nexgen-purple via-nexgen-orange to-nexgen-teal text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,white_0%,transparent_45%)]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6 lg:px-10 py-10 sm:py-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">Account</p>
          <h1 className="mt-2 font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight">{heading}</h1>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10 py-8 sm:py-10 grid lg:grid-cols-[220px_1fr] gap-6">
        <AccountMenu />
        <div className="rounded-3xl bg-white dark:bg-[#0d1326] ring-1 ring-nexgen-night/5 dark:ring-white/10 shadow-xl p-6 sm:p-8 account-pane">
          <Outlet context={{customer}} />
        </div>
      </div>
    </div>
  );
}

function AccountMenu() {
  const linkClass = ({isActive, isPending}: {isActive: boolean; isPending: boolean}) =>
    `block rounded-full px-4 py-2.5 text-sm font-bold transition ${
      isActive
        ? 'bg-gradient-to-r from-nexgen-orange to-nexgen-purple text-white shadow-md'
        : isPending
          ? 'text-nexgen-night/50 dark:text-slate-500'
          : 'text-nexgen-night dark:text-slate-200 hover:bg-nexgen-mist dark:hover:bg-white/10'
    }`;

  return (
    <nav role="navigation" className="flex flex-row lg:flex-col gap-2 overflow-x-auto rounded-2xl bg-white dark:bg-[#0d1326] ring-1 ring-nexgen-night/5 dark:ring-white/10 shadow-sm p-3 h-fit lg:sticky lg:top-[200px]">
      <NavLink to="/account/orders" className={linkClass}>Orders</NavLink>
      <NavLink to="/account/profile" className={linkClass}>Profile</NavLink>
      <NavLink to="/account/addresses" className={linkClass}>Addresses</NavLink>
      <Logout />
    </nav>
  );
}

function Logout() {
  return (
    <Form method="POST" action="/account/logout" className="lg:mt-2">
      <button
        type="submit"
        className="w-full rounded-full px-4 py-2.5 text-sm font-bold text-nexgen-night dark:text-slate-200 border border-nexgen-night/15 dark:border-white/15 hover:bg-nexgen-night hover:text-white dark:hover:bg-white dark:hover:text-nexgen-night transition"
      >
        Sign out
      </button>
    </Form>
  );
}
