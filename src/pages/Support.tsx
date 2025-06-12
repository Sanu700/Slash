import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Mail, Phone, Search } from "lucide-react";

const faqs = [
  {
    category: "General",
    questions: [
      {
        question: "What is Slash Experiences?",
        answer: "Slash Experiences is a platform that connects users with unique and curated experiences across various categories like adventure, dining, wellness, and more."
      },
      {
        question: "How do I book an experience?",
        answer: "To book an experience, simply browse our catalog, select your desired experience, choose your preferred date and time, and complete the booking process through our secure payment system."
      }
    ]
  },
  {
    category: "Booking",
    questions: [
      {
        question: "Can I modify my booking?",
        answer: "Yes, you can modify your booking up to 24 hours before the scheduled time. Please contact our support team for assistance."
      },
      {
        question: "What is your cancellation policy?",
        answer: "We offer full refunds for cancellations made at least 48 hours before the scheduled time. Cancellations made within 48 hours may be subject to a partial refund."
      }
    ]
  },
  {
    category: "Payment",
    questions: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, debit cards, and digital payment methods including UPI, Net Banking, and digital wallets."
      },
      {
        question: "Is my payment information secure?",
        answer: "Yes, we use industry-standard encryption and security measures to protect your payment information. We are PCI DSS compliant and never store your complete card details."
      }
    ]
  }
];

export default function Support() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Support Center</h1>
        
        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for help..."
            className="pl-10"
          />
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Live Chat
              </CardTitle>
              <CardDescription>Chat with our support team</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Start Chat</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Support
              </CardTitle>
              <CardDescription>Get help via email</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Send Email</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Phone Support
              </CardTitle>
              <CardDescription>Call our support team</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Call Now</Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQs */}
        <Tabs defaultValue="General" className="mb-12">
          <TabsList className="mb-4">
            {faqs.map((category) => (
              <TabsTrigger key={category.category} value={category.category}>
                {category.category}
              </TabsTrigger>
            ))}
          </TabsList>
          {faqs.map((category) => (
            <TabsContent key={category.category} value={category.category}>
              <div className="space-y-4">
                {category.questions.map((faq, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Still Need Help?</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Name</label>
                  <Input type="text" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <Input type="email" placeholder="Your email" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Subject</label>
                <Input type="text" placeholder="What's your question about?" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Message</label>
                <textarea
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  placeholder="Describe your issue in detail"
                />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 