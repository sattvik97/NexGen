/* ============================================================== */
/*  NEXGEN TOYS — STORE POLICIES (FALLBACK)                       */
/*                                                                  */
/*  Rendered whenever the Shopify Storefront API does not return    */
/*  a policy body (e.g. mock.shop demo store, or when an admin     */
/*  hasn't filled in a policy yet). The /policies/$handle route   */
/*  falls back to the content here so the footer links always     */
/*  resolve and customers always see substantive content.         */
/* ============================================================== */

export type NexGenPolicyHandle =
  | 'privacy-policy'
  | 'refund-policy'
  | 'shipping-policy'
  | 'terms-of-service'
  | 'cookie-policy'
  | 'accessibility-statement';

export type NexGenPolicy = {
  handle: NexGenPolicyHandle;
  title: string;
  body: string;
};

const CONTACT_BLOCK = `
  <h2>Contact us</h2>
  <p>
    Questions about this policy? Reach the NexGen Toys team:
  </p>
  <ul>
    <li><strong>Email:</strong> <a href="mailto:toys.nexgen@gmail.com">toys.nexgen@gmail.com</a></li>
    <li><strong>Support hours:</strong> Mon–Sat, 10 am – 7 pm IST</li>
    <li><strong>Mailing address:</strong> NexGen Toys, India</li>
    <li><strong>Contact form:</strong> <a href="/pages/contact">/pages/contact</a></li>
  </ul>
`;

export const NEXGEN_POLICIES: Record<NexGenPolicyHandle, NexGenPolicy> = {
  'privacy-policy': {
    handle: 'privacy-policy',
    title: 'Privacy Policy',
    body: `
      <p>
        Welcome to NexGen Toys ("we," "our," or "us"). We value your
        privacy and are committed to protecting your personal
        information. This Privacy Policy explains how we collect, use,
        store, and protect information when you visit our website,
        purchase products, or interact with our services.
      </p>
      <p>
        By using our website or services, you agree to the practices
        described in this Privacy Policy.
      </p>

      <h2>1. Information We Collect</h2>
      <p>We may collect the following categories of information:</p>

      <h3>Personal Information</h3>
      <p>
        When you place an order, contact us, subscribe to updates, or
        interact with our services, we may collect:
      </p>
      <ul>
        <li>Name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Shipping and billing address</li>
        <li>Payment information (processed securely through third-party payment providers)</li>
        <li>Any information voluntarily submitted by you</li>
      </ul>

      <h3>Automatically Collected Information</h3>
      <p>
        When you use our website, certain technical information may
        automatically be collected, including:
      </p>
      <ul>
        <li>IP address</li>
        <li>Browser type</li>
        <li>Device information</li>
        <li>Operating system</li>
        <li>Pages visited and browsing activity</li>
        <li>Cookies and analytics data</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We may use your information to:</p>
      <ul>
        <li>Process and fulfill orders</li>
        <li>Provide customer support</li>
        <li>Improve our products and website experience</li>
        <li>Send order confirmations and shipping updates</li>
        <li>Respond to inquiries and requests</li>
        <li>Prevent fraudulent or unauthorized activity</li>
        <li>Send promotional communications where legally permitted</li>
      </ul>

      <h2>3. Payments</h2>
      <p>
        Payments made through our website may be handled by secure
        third-party payment providers. NexGen Toys does not store
        complete payment card information on its servers unless
        otherwise stated.
      </p>

      <h2>4. Cookies and Analytics</h2>
      <p>
        Our website may use cookies and similar technologies to improve
        functionality, analyze website traffic, and enhance user
        experience.
      </p>
      <p>
        You may disable cookies through your browser settings; however,
        some features of the website may not function properly.
      </p>

      <h2>5. Sharing of Information</h2>
      <p>We do not sell or rent your personal information.</p>
      <p>
        We may share information with trusted third-party service
        providers only as necessary to:
      </p>
      <ul>
        <li>Process payments</li>
        <li>Deliver orders</li>
        <li>Host or maintain our website</li>
        <li>Provide analytics and business services</li>
        <li>Comply with legal obligations</li>
        <li>Protect our legal rights and business interests</li>
      </ul>

      <h2>6. Data Security</h2>
      <p>
        We implement reasonable technical, administrative, and
        organizational safeguards to help protect your information from
        unauthorized access, misuse, or disclosure.
      </p>
      <p>
        While we strive to use commercially acceptable security
        measures, no method of electronic storage or transmission is
        completely secure.
      </p>

      <h2>7. Children's Privacy</h2>
      <p>
        NexGen Toys products may be intended for children and families;
        however, our website is not intended to knowingly collect
        personal information from children without appropriate parental
        or guardian consent where required by applicable law.
      </p>
      <p>
        If we become aware that information has been collected
        inappropriately from a child, we will take reasonable steps to
        delete it.
      </p>

      <h2>8. Your Rights</h2>
      <p>
        Depending on your location and applicable privacy laws, you may
        have rights regarding your personal information, including the
        right to:
      </p>
      <ul>
        <li>Access your information</li>
        <li>Correct inaccurate data</li>
        <li>Request deletion of your information</li>
        <li>Opt out of marketing communications</li>
      </ul>
      <p>
        To exercise these rights, please contact us using the
        information below.
      </p>

      <h2>9. Third-Party Services and Links</h2>
      <p>
        Our website may contain links to third-party websites or
        services. We are not responsible for the content, security, or
        privacy practices of third-party websites.
      </p>

      <h2>10. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time to reflect
        operational, legal, or regulatory changes. Updated versions
        will be posted on this page with a revised effective date.
      </p>

      <h2>11. Contact Us</h2>
      <p>
        If you have questions regarding this Privacy Policy or your
        personal information, please contact us:
      </p>
      <ul>
        <li><strong>NexGen Toys</strong></li>
        <li><strong>Email:</strong> <a href="mailto:toys.nexgen@gmail.com">toys.nexgen@gmail.com</a></li>
        <li><strong>Website:</strong> toys.nexgen</li>
        <li><strong>Address:</strong> NexGen, New Delhi, India</li>
      </ul>

      <h2>Legal Disclaimer</h2>
      <p>
        This Privacy Policy is provided for general informational
        purposes only and does not constitute legal advice. Businesses
        should consult a qualified legal professional to ensure
        compliance with all applicable laws and regulations, including
        but not limited to GDPR, CCPA, COPPA, and other regional
        privacy requirements.
      </p>
    `,
  },

  'refund-policy': {
    handle: 'refund-policy',
    title: 'Refund & Return Policy',
    body: `
      <p><strong>Effective date:</strong> 1 May 2026</p>
      <p>
        We want you to love every NexGen Toys purchase. If something
        isn't right, we'll make it right — quickly and without drama.
        This policy explains when you can return a product, how refunds
        work, and what's excluded.
      </p>

      <h2>1. Return window</h2>
      <p>
        You may request a return within <strong>7 calendar days</strong>
        of delivery for any product that is:
      </p>
      <ul>
        <li>Unused and in the same condition as received,</li>
        <li>In its original packaging, with all tags, manuals, batteries and accessories,</li>
        <li>Accompanied by the original invoice or order ID.</li>
      </ul>

      <h2>2. How to start a return</h2>
      <ol>
        <li>Email <a href="mailto:toys.nexgen@gmail.com">toys.nexgen@gmail.com</a> or use the "Request return" link in your account, within 7 days of delivery.</li>
        <li>Mention your order ID, the item(s) you want to return, and a short reason. For damaged or defective items please attach 2–3 photos and a short unboxing video if possible.</li>
        <li>We'll confirm within 1–2 business days and arrange a reverse pickup. If your pincode isn't reverse-pickup serviceable we'll share a return address and reimburse standard courier charges.</li>
        <li>Pack the item securely in its original box and tape the return label on the outside.</li>
      </ol>

      <h2>3. Inspection &amp; refund timeline</h2>
      <ul>
        <li>We inspect the returned item within <strong>48 hours</strong> of receipt at our warehouse.</li>
        <li>Approved refunds are issued to the original payment method within <strong>5–7 business days</strong> after inspection.</li>
        <li>For Cash on Delivery orders, refunds are sent to the bank account / UPI ID you provide — we'll request these securely over email after pickup.</li>
        <li>Once we initiate the refund, banks usually credit it within an additional 2–5 business days.</li>
      </ul>

      <h2>4. Damaged, defective or wrong items</h2>
      <p>
        If your item arrives damaged, defective, or you receive the
        wrong product, contact us within <strong>48 hours</strong> of
        delivery with photos of the package, product and any damage.
        We'll send a free replacement or a full refund — your choice —
        and cover all return shipping. There is no restocking fee in
        this case.
      </p>

      <h2>5. Order cancellations</h2>
      <ul>
        <li>You can cancel a prepaid order any time before it is shipped, and we'll refund 100% within 5–7 business days.</li>
        <li>Once a package has been handed to the courier we're unable to cancel it, but you can refuse the delivery and the package will come back to us — we will refund after it reaches our warehouse.</li>
        <li>We reserve the right to cancel any order in case of pricing errors, stock-outs, or suspected fraud. You'll be refunded in full and notified by email.</li>
      </ul>

      <h2>6. Non-returnable items</h2>
      <ul>
        <li>Items explicitly marked "Final Sale" on the product page.</li>
        <li>Items damaged due to misuse, mishandling, water damage, or unauthorised repair after delivery.</li>
        <li>Hygiene items where the seal has been opened (e.g. mouthpieces, soft toys without their seal).</li>
        <li>Gift cards.</li>
        <li>Items returned without their original packaging, accessories, or manual.</li>
      </ul>

      <h2>7. Exchanges</h2>
      <p>
        Need a different size, colour, or product of equal value? Start
        the same way as a return and mention the replacement you'd like.
        Once we receive and inspect the returned item, we'll ship the
        replacement; any price difference is collected or refunded
        accordingly.
      </p>

      <h2>8. Shipping charges on returns</h2>
      <p>
        We don't charge a restocking fee. Original shipping or COD
        handling fees (if any) are non-refundable when you change your
        mind, but are fully refunded when the return is due to a damage,
        defect or wrong-item shipment on our side.
      </p>

      <h2>9. Late or missing refunds</h2>
      <p>
        If you haven't received your refund 7 business days after we
        confirm it, please first check with your bank or payment
        provider. If it still isn't there, write to us at
        <a href="mailto:toys.nexgen@gmail.com">toys.nexgen@gmail.com</a>
        and we'll trace it with our payment partner.
      </p>

      ${CONTACT_BLOCK}
    `,
  },

  'shipping-policy': {
    handle: 'shipping-policy',
    title: 'Shipping Policy',
    body: `
      <p><strong>Effective date:</strong> 1 May 2026</p>
      <p>
        Every NexGen Toys order is hand-checked, padded, and shipped
        from our warehouse with care. Here's how shipping works.
      </p>

      <h2>1. Where we ship</h2>
      <p>
        We currently ship across India to all serviceable pincodes via
        Delhivery, Blue Dart, Xpressbees, Ekart and India Post. We do
        not currently ship internationally; if you need international
        delivery, email us and we'll see what we can arrange.
      </p>

      <h2>2. Order processing</h2>
      <ul>
        <li>Orders placed before <strong>2 pm IST</strong> on a working day (Mon–Sat) are dispatched the same day.</li>
        <li>Orders placed after 2 pm or on Sundays / public holidays ship on the next working day.</li>
        <li>You'll receive an order-confirmation email immediately and a dispatch email with a tracking link as soon as the courier scans the package.</li>
        <li>Live tracking is also available under <a href="/account/orders">My account → Orders</a>.</li>
      </ul>

      <h2>3. Estimated delivery time</h2>
      <p>Delivery times are estimates from the day of dispatch:</p>
      <ul>
        <li><strong>Metro cities</strong> (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad): 2–4 working days.</li>
        <li><strong>Tier 2/3 cities:</strong> 4–6 working days.</li>
        <li><strong>Remote, north-east, or hilly pincodes:</strong> 6–9 working days.</li>
      </ul>
      <p>
        Weather, monsoon, strikes and courier capacity occasionally
        stretch these timelines — we'll proactively email you if your
        package is running late.
      </p>

      <h2>4. Shipping charges</h2>
      <ul>
        <li><strong>Free shipping</strong> on prepaid orders above ₹999.</li>
        <li>Below ₹999, a flat shipping fee is calculated at checkout based on weight and pincode.</li>
        <li>For bulky items (scooters, large RC sets), an extra logistics fee may apply and is shown clearly at checkout.</li>
      </ul>

      <h2>5. Cash on Delivery (COD)</h2>
      <p>
        COD is available on most serviceable pincodes for orders up to
        ₹5,000. A small COD handling fee is shown at checkout. To keep
        fraud low, our system may auto-disable COD on certain pincodes
        or first-time addresses — in that case, prepaid options (UPI,
        cards, netbanking, wallets) are always available.
      </p>

      <h2>6. Multiple shipments</h2>
      <p>
        Larger orders may ship in more than one package, sometimes on
        different days, to reach you faster. You'll get a tracking link
        for each shipment.
      </p>

      <h2>7. Failed deliveries / RTO</h2>
      <p>
        Couriers attempt delivery up to 3 times. If all attempts fail
        (no one home, address incomplete, COD refused), the package is
        returned to us as RTO. For prepaid orders we re-ship at no
        extra cost if you reach out within 7 days. For COD orders we
        may charge the courier's return fees on re-shipment.
      </p>

      <h2>8. Lost or stuck shipments</h2>
      <p>
        If your tracking hasn't updated for 5+ working days or the
        package is marked lost, email
        <a href="mailto:toys.nexgen@gmail.com">toys.nexgen@gmail.com</a> with
        your order number. We'll investigate with the courier and
        either re-ship or refund within 10 working days.
      </p>

      <h2>9. Order changes</h2>
      <p>
        Need to change your address, phone number, or remove an item?
        Reply to your order-confirmation email within 30 minutes of
        placing the order and we'll do our best. Once dispatched, we
        can't change shipments.
      </p>

      ${CONTACT_BLOCK}
    `,
  },

  'terms-of-service': {
    handle: 'terms-of-service',
    title: 'Terms of Service',
    body: `
      <p><strong>Effective date:</strong> 1 May 2026</p>
      <p>
        Welcome to NexGen Toys. These Terms of Service ("Terms") govern
        your access to and use of
        <a href="https://nexgen.toys">nexgen.toys</a> (the "Site"), our
        mobile views, and every purchase you make from us. By browsing,
        creating an account, or placing an order you agree to these
        Terms. Please read them carefully.
      </p>

      <h2>1. Who we are</h2>
      <p>
        NexGen Toys is an online toy store operated from India.
        References to "we", "us" and "our" mean NexGen Toys. References
        to "you" mean the visitor, customer or account holder.
      </p>

      <h2>2. Eligibility &amp; account</h2>
      <ul>
        <li>You must be at least 18 years old, or have the consent of a parent or legal guardian, to place an order.</li>
        <li>You agree to provide accurate, current and complete information when you create an account or place an order, and to update it as needed.</li>
        <li>You are responsible for keeping your password confidential and for everything that happens under your account.</li>
        <li>We may suspend or close accounts that are used for fraud, abuse, repeated chargebacks, or that violate these Terms.</li>
      </ul>

      <h2>3. Products, descriptions &amp; pricing</h2>
      <ul>
        <li>All prices are listed in Indian Rupees (₹) and are inclusive of GST unless stated otherwise.</li>
        <li>We do our best to keep product descriptions, images, age ratings, dimensions, stock and prices accurate, but small errors can occur. Where a product is mis-priced or mis-described, we reserve the right to cancel the affected order and refund you in full.</li>
        <li>Product images and "Maximum Retail Price" / strike-through prices are illustrative; actual colour, packaging and accessories may vary slightly.</li>
        <li>Stock is not reserved until checkout is completed.</li>
      </ul>

      <h2>4. Orders, acceptance &amp; payment</h2>
      <ul>
        <li>An order is an <em>offer</em> from you to buy. It is accepted only when we dispatch the goods and send the dispatch confirmation email.</li>
        <li>Payments are processed by secure third-party gateways (Razorpay, Shopify Payments, UPI, netbanking, cards, wallets). We do not store full card or UPI credentials.</li>
        <li>For Cash on Delivery orders, full payment is collected by the courier at the time of delivery.</li>
        <li>We may refuse or cancel orders that look fraudulent, breach these Terms, or come from regions we don't currently ship to.</li>
      </ul>

      <h2>5. Shipping, returns &amp; refunds</h2>
      <p>
        Please see our <a href="/policies/shipping-policy">Shipping Policy</a>
        and <a href="/policies/refund-policy">Refund &amp; Return Policy</a>
        for full details. They form part of these Terms.
      </p>

      <h2>6. Safety, age ratings &amp; intended use</h2>
      <p>
        Each product page lists the recommended age range. Adult
        supervision is strongly recommended for RC vehicles, blasters,
        outdoor toys and any toy containing small parts, batteries or
        magnets. Always follow the instructions on the packaging and
        the manual that ships with the product. NexGen Toys is not
        responsible for injuries or damages caused by use that ignores
        the product's age rating or safety instructions.
      </p>

      <h2>7. Reviews, comments &amp; user content</h2>
      <ul>
        <li>By submitting a review, photo, video or comment, you grant us a non-exclusive, royalty-free, worldwide licence to use, edit, display and promote it in connection with the store.</li>
        <li>Content you submit must be honest, your own, and free of anything illegal, defamatory, hateful, obscene, or that infringes on someone else's rights.</li>
        <li>We may moderate, edit, or remove any user content at our discretion.</li>
      </ul>

      <h2>8. Intellectual property</h2>
      <p>
        All content on the Site — the NexGen Toys logo, brand colours,
        photography, illustrations, copy, the storefront UI and code —
        is owned by NexGen Toys or our licensors and is protected by
        Indian and international IP laws. You may not copy, reproduce,
        modify, distribute, or create derivative works without our
        prior written permission, other than for personal,
        non-commercial use.
      </p>

      <h2>9. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Site for any unlawful purpose.</li>
        <li>Attempt to disrupt, scrape, reverse engineer or overload the Site.</li>
        <li>Impersonate another person or misuse another user's account.</li>
        <li>Place bulk fraudulent or speculative orders, including for resale outside India without our written consent.</li>
      </ul>

      <h2>10. Disclaimers</h2>
      <p>
        The Site and the products are provided "as is". We do not
        guarantee uninterrupted availability of the Site, exact colour
        accuracy of product images on every screen, or that the Site
        is free from bugs or security vulnerabilities. Statements
        about play value or educational benefit are based on common
        usage and are not medical or developmental claims.
      </p>

      <h2>11. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, NexGen Toys' total
        liability for any claim arising out of an order is limited to
        the amount you paid for that order. We are not liable for
        indirect, incidental, special or consequential losses, loss of
        profits, or loss of goodwill arising out of your use of the
        Site or our products, except as required under the Consumer
        Protection Act, 2019.
      </p>

      <h2>12. Indemnity</h2>
      <p>
        You agree to indemnify and hold NexGen Toys harmless from any
        third-party claims arising out of your breach of these Terms,
        misuse of the Site, or misuse of a product.
      </p>

      <h2>13. Force majeure</h2>
      <p>
        We are not liable for delays or failures caused by events
        outside our reasonable control, including natural disasters,
        pandemics, courier strikes, government actions and internet
        outages.
      </p>

      <h2>14. Termination</h2>
      <p>
        You may stop using the Site at any time. We may suspend or
        terminate access if you breach these Terms, abuse our services,
        or create risk for other users or the business.
      </p>

      <h2>15. Governing law &amp; disputes</h2>
      <p>
        These Terms are governed by the laws of India. Any dispute
        arising out of or related to these Terms or your use of the
        Site will be subject to the exclusive jurisdiction of the
        competent courts at the location of our registered office.
      </p>

      <h2>16. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. Material changes
        will be shown on this page; for significant changes we'll also
        email registered customers. The "Effective date" at the top
        always reflects the latest version. Continued use of the Site
        after a change means you accept the new Terms.
      </p>

      <h2>17. Grievance Officer</h2>
      <p>
        Under the IT Rules, 2021, our Grievance Officer can be reached
        at
        <a href="mailto:toys.nexgen@gmail.com">toys.nexgen@gmail.com</a>.
        We acknowledge complaints within 24 hours and aim to resolve
        them within 15 days.
      </p>

      ${CONTACT_BLOCK}
    `,
  },

  'cookie-policy': {
    handle: 'cookie-policy',
    title: 'Cookie Policy',
    body: `
      <p><strong>Effective date:</strong> 1 May 2026</p>
      <p>
        This Cookie Policy explains how NexGen Toys uses cookies and
        similar tracking technologies (pixels, local storage, SDKs) on
        <a href="https://nexgen.toys">nexgen.toys</a>. It should be read
        together with our
        <a href="/policies/privacy-policy">Privacy Policy</a>.
      </p>

      <h2>1. What is a cookie?</h2>
      <p>
        A cookie is a small text file placed on your device when you
        visit a website. Cookies let the site remember things like
        your sign-in state, items in your cart, or your dark-mode
        preference. They can also help us measure how the store is
        used so we can improve it.
      </p>

      <h2>2. Categories of cookies we use</h2>
      <h3>Strictly necessary</h3>
      <p>
        Required for the site to work. They enable cart, checkout,
        account login, security, fraud prevention and load balancing.
        You cannot opt out of these without breaking the store.
      </p>
      <h3>Functional</h3>
      <p>
        Remember choices you make &mdash; dark mode, language, recently
        viewed products, saved favourites. If you disable these, the
        site still works but feels less personalised.
      </p>
      <h3>Analytics</h3>
      <p>
        Help us understand which pages are popular, where visitors
        come from and which products people search for. We use
        aggregated, anonymised data; we do not try to identify
        individuals. Examples: page view counts, time on page,
        click-through rates on banners.
      </p>
      <h3>Marketing</h3>
      <p>
        Set by us or by carefully chosen partners to show you relevant
        NexGen Toys ads on other sites and social platforms, and to
        measure whether those ads actually lead to purchases. Examples:
        Meta Pixel, Google Ads conversion tag.
      </p>

      <h2>3. Third parties who set cookies on our site</h2>
      <p>
        We use a short list of trusted vendors. Each operates under its
        own privacy policy, which you can review on their websites:
      </p>
      <ul>
        <li>Shopify &mdash; storefront platform, cart, checkout.</li>
        <li>Razorpay &mdash; payment processing.</li>
        <li>Google Analytics 4 / Google Tag Manager &mdash; aggregated
          analytics.</li>
        <li>Meta Pixel &mdash; ad measurement on Facebook and Instagram.</li>
        <li>Delhivery, Blue Dart, Xpressbees and similar &mdash; for the
          tracking widget on your order page.</li>
      </ul>
      <p>
        We do not allow third parties to use cookies on our site for
        purposes other than those listed above.
      </p>

      <h2>4. How long cookies stay on your device</h2>
      <ul>
        <li><strong>Session cookies</strong> &mdash; cleared when you close
          your browser.</li>
        <li><strong>Persistent cookies</strong> &mdash; remain for a defined
          period, from a few days to 24 months, then expire.</li>
      </ul>

      <h2>5. Your choices</h2>
      <ul>
        <li>You can accept or reject non-essential cookies the first
          time you visit the site from our cookie banner.</li>
        <li>You can change your preference at any time by clicking
          "Cookie settings" in the site footer.</li>
        <li>Most browsers let you block or delete cookies through their
          settings. See the help pages for Chrome, Safari, Firefox or
          Edge for instructions.</li>
        <li>You can opt out of personalised advertising from many
          networks at
          <a href="https://youradchoices.com" target="_blank" rel="noopener noreferrer">youradchoices.com</a>.</li>
      </ul>
      <p>
        Note: if you block strictly-necessary cookies, the site will
        not function correctly &mdash; you may not be able to log in,
        add to cart or complete checkout.
      </p>

      <h2>6. Do Not Track</h2>
      <p>
        Our site honours your browser's "Do Not Track" signal by
        treating it as a withdrawal of consent for analytics and
        marketing cookies. Strictly necessary cookies remain active.
      </p>

      <h2>7. Changes to this policy</h2>
      <p>
        We may update this Cookie Policy as we add or remove tools.
        The "Effective date" at the top will reflect the latest
        change.
      </p>

      ${CONTACT_BLOCK}
    `,
  },

  'accessibility-statement': {
    handle: 'accessibility-statement',
    title: 'Accessibility Statement',
    body: `
      <p><strong>Last reviewed:</strong> 1 May 2026</p>
      <p>
        NexGen Toys is committed to making
        <a href="https://nexgen.toys">nexgen.toys</a> usable by everyone,
        including parents, grandparents and gift-givers who rely on
        assistive technology. We design the store with the Web Content
        Accessibility Guidelines (WCAG) 2.1 Level AA as our target.
      </p>

      <h2>1. What we do to make the site accessible</h2>
      <ul>
        <li>Every page is keyboard-navigable. Tab, Shift+Tab, Enter and
          Space behave the way you expect.</li>
        <li>Visible focus rings are kept on all interactive elements so
          you always know where you are on the page.</li>
        <li>Headings, landmarks and ARIA roles are used so screen
          readers (NVDA, JAWS, VoiceOver, TalkBack) can navigate the
          page structure.</li>
        <li>Form fields have programmatic labels, and error messages
          are announced to assistive tech.</li>
        <li>Colour contrast is at or above the AA threshold for
          standard text. A dedicated dark mode reduces glare and helps
          users sensitive to bright backgrounds.</li>
        <li>The "prefers-reduced-motion" setting is respected
          site-wide; animations are paused or simplified for users who
          ask for it.</li>
        <li>Images that convey meaning have alternative text. Decorative
          images are marked so screen readers can skip them.</li>
        <li>Videos are muted by default and do not autoplay with
          sound.</li>
        <li>Touch targets meet the 44 &times; 44 px guideline so the
          site is comfortable on small screens and for users with
          motor impairments.</li>
      </ul>

      <h2>2. Where we know we can do better</h2>
      <p>
        We will be honest: some areas still need work and we are
        actively improving them.
      </p>
      <ul>
        <li>A handful of legacy product descriptions imported from
          suppliers may not yet be fully marked up for screen readers
          &mdash; we are reviewing them in batches.</li>
        <li>Third-party widgets (payment, reviews, chat) follow their
          own accessibility roadmap, which we cannot control directly.
          We choose vendors who publish a VPAT or accessibility
          conformance statement wherever possible.</li>
        <li>Captions for product walkaround videos are being added
          progressively.</li>
      </ul>

      <h2>3. Standards we follow</h2>
      <ul>
        <li>Web Content Accessibility Guidelines (WCAG) 2.1, Level AA.</li>
        <li>The Rights of Persons with Disabilities Act, 2016 (India).</li>
        <li>Section 46 of the RPwD Act and Rule 15 of the RPwD Rules,
          which require accessible information and communication
          technology for service providers.</li>
        <li>Guidelines for Indian Government Websites (GIGW) where
          applicable.</li>
      </ul>

      <h2>4. Assistive technology we test against</h2>
      <ul>
        <li>NVDA on Windows (Firefox &amp; Chrome).</li>
        <li>VoiceOver on macOS Safari and iOS Safari.</li>
        <li>TalkBack on Android Chrome.</li>
        <li>Keyboard-only navigation.</li>
        <li>200% browser zoom.</li>
      </ul>

      <h2>5. Tell us when something isn't accessible</h2>
      <p>
        If you run into a barrier &mdash; a missing label, a button you
        can't reach, a contrast issue, a confusing flow &mdash; please
        let us know so we can fix it quickly:
      </p>
      <ul>
        <li><strong>Email:</strong>
          <a href="mailto:toys.nexgen@gmail.com">toys.nexgen@gmail.com</a></li>
        <li><strong>Subject line:</strong> "Accessibility issue &mdash;
          [short description]"</li>
        <li><strong>What helps us:</strong> the page URL, your browser
          and assistive tech (e.g. "Chrome 124 + NVDA 2024.1"), and
          what happened.</li>
        <li>We acknowledge accessibility reports within two business
          days and aim to either ship a fix or share a target date
          within 15 days.</li>
      </ul>

      <h2>6. Feedback that requires an immediate workaround</h2>
      <p>
        If you cannot complete a purchase because of an accessibility
        issue, write to
        <a href="mailto:toys.nexgen@gmail.com">toys.nexgen@gmail.com</a> with
        the product link and we will place the order on your behalf,
        confirm pricing and delivery with you on a call, and send the
        invoice by email.
      </p>

      ${CONTACT_BLOCK}
    `,
  },
};

export const NEXGEN_POLICY_LIST: Array<{
  handle: NexGenPolicyHandle;
  title: string;
}> = [
  {handle: 'privacy-policy', title: 'Privacy Policy'},
  {handle: 'refund-policy', title: 'Refund & Return Policy'},
  {handle: 'shipping-policy', title: 'Shipping Policy'},
  {handle: 'terms-of-service', title: 'Terms of Service'},
  {handle: 'cookie-policy', title: 'Cookie Policy'},
  {handle: 'accessibility-statement', title: 'Accessibility Statement'},
];
