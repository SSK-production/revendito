import React from "react";

const LegalNotice = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Legal Notice</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Website Presentation</h2>
        <p className="text-gray-700 leading-relaxed">
          The website <strong>SSK Production</strong> is published by:<br />
          <strong>SSK Production</strong><br />
          Address: <strong>Cours Saint-Michel 30, Etterbeek, Brussels Region, 1040 BE</strong><br />
          Publication Manager: <strong>Hambel Kurti</strong><br />
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Hosting</h2>
        <p className="text-gray-700 leading-relaxed">
          The website is hosted by: <br />
          <strong>Vercel</strong><br />
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Intellectual Property</h2>
        <p className="text-gray-700 leading-relaxed">
          All elements of the website, including texts, images, graphics, logos, etc., are protected by copyright and belong to <strong>SSK Production</strong> or are used with the authorization of the rights holders. Any reproduction or representation, in whole or in part, of these elements, without prior written authorization from the publisher, is prohibited.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Personal Data</h2>
        <p className="text-gray-700 leading-relaxed">
          <strong>SSK Production</strong> is committed to respecting the confidentiality of personal information collected on the website and to processing it in accordance with the applicable regulations, including the General Data Protection Regulation (GDPR). You can consult our privacy policy for more information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Liability</h2>
        <p className="text-gray-700 leading-relaxed">
          The publisher cannot be held responsible for errors or omissions on the website, nor for any direct or indirect damages that may result from the use of the website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. External Links</h2>
        <p className="text-gray-700 leading-relaxed">
          The website may contain links to other websites. These links are provided for informational purposes only. We assume no responsibility for the content of these external websites.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Modifications</h2>
        <p className="text-gray-700 leading-relaxed">
          <strong>SSK Production</strong> reserves the right to modify or update this legal notice at any time. It is recommended to check this page regularly.
        </p>
      </section>
    </div>
  );
};

export default LegalNotice;
