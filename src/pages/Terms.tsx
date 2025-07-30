export const Terms = () => {
  return (
    <div className="min-h-screen gradient-subtle py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Terms & Conditions</h1>
        <div className="prose prose-slate max-w-none text-foreground">
          <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
            <p className="mb-4">
              By accessing and using Cognitex, you accept and agree to be bound by the terms and provision 
              of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Use License</h2>
            <p className="mb-4">
              Permission is granted to temporarily access Cognitex for personal or commercial use. 
              This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for commercial purposes without authorization</li>
              <li>Attempt to reverse engineer any software contained on the platform</li>
              <li>Remove any copyright or proprietary notations from the materials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">User Account</h2>
            <p className="mb-4">
              You are responsible for safeguarding the password and for maintaining the confidentiality 
              of your account. You agree not to disclose your password to any third party.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Content Ownership</h2>
            <p className="mb-4">
              You retain ownership of all content you upload to Cognitex. By uploading content, you grant 
              us a license to process, analyze, and store your content to provide our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Payment Terms</h2>
            <p className="mb-4">
              Subscription fees are billed in advance on a monthly basis and are non-refundable. 
              We reserve the right to change our pricing with 30 days notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Service Availability</h2>
            <p className="mb-4">
              We strive to maintain high service availability but do not guarantee uninterrupted access. 
              We may suspend or terminate service for maintenance, security, or other operational reasons.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="mb-4">
              Cognitex shall not be liable for any indirect, incidental, special, consequential, or 
              punitive damages, including but not limited to loss of profits, data, or other intangible losses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Termination</h2>
            <p className="mb-4">
              We may terminate or suspend your account and access to the service immediately, without prior 
              notice, for conduct that we believe violates these Terms or is harmful to other users.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p>
              If you have any questions about these Terms & Conditions, please contact us at legal@cognitex.ai
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};