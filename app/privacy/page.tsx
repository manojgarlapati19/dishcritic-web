export default function PrivacyPage() {
  return (
    <div className="bg-[#FBF6EE]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <span className="text-xs font-semibold text-[#C8702A] uppercase tracking-[0.2em]">Legal</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E1208] mt-4 mb-8">Privacy Policy</h1>
        <p className="text-sm text-[#A08060] mb-10">Last updated: May 2026</p>

        <div className="prose prose-sm max-w-none text-[#A08060] space-y-8">
          <section>
            <h2 className="font-serif text-xl font-bold text-[#1E1208] mb-3">1. Introduction</h2>
            <p className="leading-relaxed">
              DishCritic (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#1E1208] mb-3">2. Information We Collect</h2>
            <p className="leading-relaxed mb-3">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Account information (name, email address, phone number)</li>
              <li>Profile information (avatar, bio, location)</li>
              <li>Reviews, ratings, and other content you submit</li>
              <li>Saved restaurants and preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#1E1208] mb-3">3. How We Use Your Information</h2>
            <p className="leading-relaxed mb-3">We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide, maintain, and improve our platform</li>
              <li>Personalize your experience and show relevant content</li>
              <li>Connect you with restaurants and other users</li>
              <li>Send you updates, promotions, and support messages</li>
              <li>Detect and prevent fraud or abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#1E1208] mb-3">4. Data Sharing</h2>
            <p className="leading-relaxed">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-3">
              <li>Restaurants you review or interact with</li>
              <li>Service providers who help us operate our platform</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#1E1208] mb-3">5. Data Security</h2>
            <p className="leading-relaxed">
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#1E1208] mb-3">6. Your Rights</h2>
            <p className="leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access, update, or delete your personal data</li>
              <li>Opt out of marketing communications</li>
              <li>Request a copy of your data</li>
              <li>Close your account at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#1E1208] mb-3">7. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at privacy@dishcritic.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
