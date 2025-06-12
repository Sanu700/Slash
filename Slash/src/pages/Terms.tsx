import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Agreement to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                By accessing and using Slash Experiences, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Use License</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Permission is granted to temporarily access the materials (information or software) on Slash Experiences for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside mt-4 text-gray-600">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software contained on Slash Experiences</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the security of your account and password. We cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Booking and Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                All bookings are subject to availability and confirmation. Payment must be made in full at the time of booking. We reserve the right to refuse service to anyone for any reason at any time.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Cancellation Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Cancellations must be made at least 48 hours before the scheduled experience time to receive a full refund. Cancellations made within 48 hours may be subject to a partial refund or no refund, depending on the specific experience and circumstances.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. User Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Users may post content as long as it isn't illegal, obscene, threatening, defamatory, invasive of privacy, infringing of intellectual property rights, or otherwise injurious to third parties.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Prohibited Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                You are prohibited from:
              </p>
              <ul className="list-disc list-inside mt-4 text-gray-600">
                <li>Using the service for any illegal purpose</li>
                <li>Harassing, threatening, or intimidating other users</li>
                <li>Posting false or misleading information</li>
                <li>Attempting to gain unauthorized access to any portion of the service</li>
                <li>Interfering with the proper functioning of the service</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                In no event shall Slash Experiences be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Slash Experiences.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new Terms of Service on this page. Your continued use of the service after any such changes constitutes your acceptance of the new Terms of Service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="mt-2 text-gray-600">
                Email: legal@slashexperiences.com<br />
                Phone: +91 123 456 7890<br />
                Address: 123 Experience Street, Mumbai, Maharashtra 400001
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 