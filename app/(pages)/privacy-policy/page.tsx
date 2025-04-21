import React from "react";

const PrivacyPolicy = () => {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="text-gray-700">
                    This privacy policy describes how we collect, use, and protect your personal information when you visit our website and use our services. By using our site, you agree to the terms of this policy.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Information Collected</h2>
                <p className="text-gray-700 mb-4">
                    We collect the following types of information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>
                        <strong>Personally identifiable information:</strong> Name, email address, phone number, etc.
                    </li>
                    <li>
                        <strong>Technical information:</strong> IP address, browser type, operating system, and data on how you interact with our site.
                    </li>
                    <li>
                        <strong>Cookies:</strong> We use cookies to enhance your browsing experience. You can manage your cookie preferences in your browser settings.
                    </li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Use of Information</h2>
                <p className="text-gray-700 mb-4">
                    The information we collect is used to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Improve and personalize your experience on our site.</li>
                    <li>Respond to your inquiries or send you information related to our services.</li>
                    <li>Analyze trends and perform statistics on the use of our site.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Sharing of Information</h2>
                <p className="text-gray-700 mb-4">
                    We do not sell or share your personal information with third parties, except in the following cases:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>When required by law or to respond to legal requests.</li>
                    <li>To protect our rights, property, or the safety of our users.</li>
                    <li>With third-party service providers who help us operate our site, provided they also respect the confidentiality of your data.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
                <p className="text-gray-700">
                    We implement technical and organizational security measures to protect your personal information from unauthorized access, loss, or disclosure. However, no method of transmission over the Internet or electronic storage is completely secure. We cannot guarantee absolute security.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
                <p className="text-gray-700 mb-4">
                    You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>
                        <strong>Right of access:</strong> You have the right to know what information we hold about you.
                    </li>
                    <li>
                        <strong>Right of rectification:</strong> You can request the correction of any incorrect or incomplete information.
                    </li>
                    <li>
                        <strong>Right to erasure:</strong> You can request the deletion of your personal information, subject to certain exceptions.
                    </li>
                    <li>
                        <strong>Right to data portability:</strong> You can obtain a copy of the personal information we hold in a structured format.
                    </li>
                </ul>
                <p className="text-gray-700">
                    To exercise these rights, please contact us at <strong>contact@sskprod.be</strong>.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Changes to the Privacy Policy</h2>
                <p className="text-gray-700">
                    We reserve the right to modify this privacy policy at any time. Any changes will be posted on this page, and the changes will take effect upon publication.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">8. Contact</h2>
                <p className="text-gray-700">
                    If you have any questions about this privacy policy or wish to exercise your rights regarding your personal data, you can contact us.
                </p>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
