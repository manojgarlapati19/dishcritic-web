export default function TermsPage() {
  return (
    <div className="bg-cream text-ink">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">Legal</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink mt-4 mb-2">Terms of Service</h1>
        <p className="text-sm text-brown-muted mb-10">Last updated: May 2025</p>

        <div className="space-y-10">
          <section>
            <h2 className="font-serif text-xl font-bold text-ink mb-3">Acceptance of Terms</h2>
            <p className="text-brown-muted leading-relaxed">
              By accessing or using DishCritic (&ldquo;the Platform&rdquo;), you agree to be bound by these Terms of Service.
              If you do not agree with any part of these terms, you must not use the Platform. These terms apply to
              all visitors, users, and others who access or use the Platform.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-ink mb-3">Use of Service</h2>
            <p className="text-brown-muted leading-relaxed mb-3">
              DishCritic provides a dish-first restaurant review platform that allows users to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-brown-muted leading-relaxed">
              <li>Search for dishes and discover which restaurants serve them.</li>
              <li>View dish-level scores and rankings based on community reviews.</li>
              <li>Submit reviews, ratings, and photos for individual dishes.</li>
              <li>Create and maintain a profile to track your reviews and preferences.</li>
              <li>Save restaurants and dishes for future reference.</li>
            </ul>
            <p className="text-brown-muted leading-relaxed mt-3">
              You agree to use the Platform only for lawful purposes and in accordance with these terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-ink mb-3">User Content and Reviews</h2>
            <p className="text-brown-muted leading-relaxed mb-3">
              By submitting reviews, ratings, photos, or other content to DishCritic:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-brown-muted leading-relaxed">
              <li>You confirm that your reviews are based on your genuine, personal experience with the dish.</li>
              <li>You agree not to submit fake, misleading, incentivized, or AI-generated reviews.</li>
              <li>You retain ownership of your content, but grant DishCritic a non-exclusive, royalty-free license to display, distribute, and promote it on the Platform.</li>
              <li>You represent that your content does not violate any third-party rights or applicable laws.</li>
              <li>DishCritic reserves the right to remove or modify any content that violates these terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-ink mb-3">Prohibited Conduct</h2>
            <p className="text-brown-muted leading-relaxed mb-3">
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-brown-muted leading-relaxed">
              <li>Posting false, defamatory, abusive, harassing, or obscene content.</li>
              <li>Attempting to manipulate dish scores, rankings, or review counts.</li>
              <li>Creating fake accounts or impersonating other individuals or entities.</li>
              <li>Using the Platform for any illegal or unauthorized purpose.</li>
              <li>Scraping, data mining, or harvesting content without prior written consent.</li>
              <li>Interfering with the security, functionality, or performance of the Platform.</li>
              <li>Spamming other users or restaurants with unsolicited communications.</li>
              <li>Engaging in any activity that could harm minors or exploit vulnerable users.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-ink mb-3">Intellectual Property</h2>
            <p className="text-brown-muted leading-relaxed">
              The DishCritic name, logo, design, and platform code are our intellectual property.
              You may not reproduce, distribute, modify, or create derivative works from our
              intellectual property without our prior written consent. The content submitted by
              users remains their property, subject to the license granted above.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-ink mb-3">Disclaimer</h2>
            <p className="text-brown-muted leading-relaxed">
              DishCritic is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis.
              We make no warranties, express or implied, regarding the accuracy, reliability, or
              completeness of reviews, scores, or any other content on the Platform. Dish scores
              are based on user-generated reviews and may not reflect your personal experience.
              We are not responsible for the quality of food or service at any restaurant listed
              on the Platform. Your use of the Platform is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-ink mb-3">Contact</h2>
            <p className="text-brown-muted leading-relaxed">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="mt-4 p-4 rounded-xl bg-cream-dark border border-brown-muted/10 text-brown-muted leading-relaxed">
              <p><strong className="text-ink">Email:</strong> legal@dishcritic.in</p>
              <p className="mt-1"><strong className="text-ink">Address:</strong> DishCritic Technologies, Hyderabad, Telangana, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
