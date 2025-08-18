// src/content/TermsOfService.js
import React from "react";

const TermsOfService = () => {
  return (
    <div className="prose prose-sm max-w-none">
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-4">
          <strong>Last Updated:</strong> August 19, 2025
        </p>
        <p className="text-gray-700 leading-relaxed">
          Welcome to AutoApply. These Terms of Service ("Terms") govern your use
          of our automated job application platform and services. By creating an
          account or using our services, you agree to be bound by these Terms.
        </p>
      </div>

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          1. Service Description
        </h3>
        <p className="text-gray-700 leading-relaxed mb-3">
          AutoApply provides an automated job application service that applies
          to job opportunities on your behalf based on your preferences,
          qualifications, and uploaded resume information.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          2. No Job Guarantee
        </h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
          <p className="text-gray-800 font-medium">
            <strong>IMPORTANT:</strong> We do not guarantee that you will secure
            employment through our service.
          </p>
        </div>
        <ul className="text-gray-700 leading-relaxed space-y-2 list-disc pl-6">
          <li>
            Job placement depends on multiple factors including market
            conditions, your qualifications, and employer preferences
          </li>
          <li>
            Our service increases your application volume but does not guarantee
            interview invitations or job offers
          </li>
          <li>
            <strong>No refunds will be provided</strong> if you do not secure
            employment through our platform
          </li>
          <li>
            Payment for services is final and non-refundable regardless of
            employment outcomes
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          3. Data Sharing with Employers
        </h3>
        <p className="text-gray-700 leading-relaxed mb-3">
          By using our service, you authorize us to:
        </p>
        <ul className="text-gray-700 leading-relaxed space-y-2 list-disc pl-6">
          <li>
            Share your resume, cover letter, and application materials with
            potential employers
          </li>
          <li>
            Submit job applications on your behalf using your personal and
            professional information
          </li>
          <li>
            Provide your contact information to employers who express interest
            in your application
          </li>
          <li>
            Share relevant profile data with job boards and recruiting platforms
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          4. User Responsibilities
        </h3>
        <ul className="text-gray-700 leading-relaxed space-y-2 list-disc pl-6">
          <li>
            Provide accurate and up-to-date information in your profile and
            resume
          </li>
          <li>Respond promptly to employer inquiries and interview requests</li>
          <li>
            Maintain professional conduct in all interactions with potential
            employers
          </li>
          <li>
            Notify us of any changes to your job search status or availability
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          5. Payment Terms
        </h3>
        <ul className="text-gray-700 leading-relaxed space-y-2 list-disc pl-6">
          <li>
            All payments are processed securely through third-party payment
            processors
          </li>
          <li>
            Subscription fees are billed in advance and are non-refundable
          </li>
          <li>
            You may cancel your subscription at any time, but no partial refunds
            will be provided
          </li>
          <li>Pricing is subject to change with 30 days notice</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          6. Service Limitations
        </h3>
        <p className="text-gray-700 leading-relaxed mb-3">
          Our service is provided "as is" and we make no warranties regarding:
        </p>
        <ul className="text-gray-700 leading-relaxed space-y-2 list-disc pl-6">
          <li>Continuous, uninterrupted service availability</li>
          <li>Specific number of applications per time period</li>
          <li>Response rates from employers</li>
          <li>Quality or suitability of matched job opportunities</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          7. Account Termination
        </h3>
        <p className="text-gray-700 leading-relaxed mb-3">
          We reserve the right to terminate accounts for:
        </p>
        <ul className="text-gray-700 leading-relaxed space-y-2 list-disc pl-6">
          <li>Violation of these Terms of Service</li>
          <li>Providing false or misleading information</li>
          <li>Misuse of the platform or inappropriate conduct</li>
          <li>Non-payment of fees</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          8. Contact Information
        </h3>
        <p className="text-gray-700 leading-relaxed">
          For questions about these Terms, please contact us at:
        </p>
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-gray-700">
            <strong>Email:</strong> info@autoapplyjob.co
            <br />
            <strong>Address:</strong> Islamabad, Pakistan
          </p>
        </div>
      </section>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          By clicking "I agree" or using our services, you acknowledge that you
          have read, understood, and agree to be bound by these Terms of
          Service.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
