export const Privacy = () => {
  return (
    <div className="min-h-screen gradient-subtle py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none text-foreground">
          <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="mb-4">
              At Cognitex, we collect information you provide directly to us, such as when you create an account, 
              upload documents, or contact us for support. This includes:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Account information (name, email address, password)</li>
              <li>Team and organization information</li>
              <li>Documents and content you upload to our platform</li>
              <li>Usage data and analytics</li>
              <li>Communication records when you contact support</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process AI-powered document analysis and chat responses</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Protect against fraud and abuse</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="mb-4">
              We implement appropriate security measures to protect your personal information against unauthorized 
              access, alteration, disclosure, or destruction. Your data is encrypted in transit and at rest.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p className="mb-4">
              We may use third-party services like OpenAI for AI processing, Stripe for payments, and cloud 
              storage providers. These services have their own privacy policies governing the use of your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
            <p className="mb-4">
              We retain your information for as long as your account is active or as needed to provide services. 
              You may request deletion of your data at any time by contacting us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@cognitex.ai
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};