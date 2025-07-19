import React, { useState } from 'react';
import { useInView } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, MessageCircle, Clock, CalendarClock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const ContactUs = () => {
  const [heroRef, heroInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [formRef, formInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  // Form state
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const res = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess('Your message has been sent!');
        setForm({ firstName: '', lastName: '', email: '', subject: '', message: '' });
      } else {
        setError('Failed to send message. Please try again later.');
      }
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div 
        ref={heroRef}
        className="relative bg-gradient-to-r from-blue-700 to-cyan-600 text-white py-16 md:py-24"
      >
        <div className="container max-w-6xl mx-auto px-6 md:px-10">
          <div className={`max-w-2xl transition-all duration-700 ${heroInView ? "opacity-100" : "opacity-0 translate-y-8"}`}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl mb-6">
              Have questions or need assistance? We're here to help! Reach out to our team for prompt and friendly support.
            </p>
            <div className="flex flex-wrap gap-6 mt-8">
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                <span>8468951580, 8076586928, 9007488827</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                <span>support@slashexperiences.com</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="hidden md:block absolute right-10 bottom-10 opacity-20">
          <div className="w-48 h-48 border-2 border-white/50 rounded-full"></div>
          <div className="w-32 h-32 border-2 border-white/50 rounded-full absolute -top-10 -left-10"></div>
        </div>
      </div>
      
      {/* Contact Options */}
      <section className="py-16 md:py-20">
        <div className="container max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* General Inquiries */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-medium mb-2">General Inquiries</h2>
              <p className="text-muted-foreground mb-4">
                For general questions about our experiences, company information, or partnerships.
              </p>
              <div className="text-blue-600 font-medium">info@slashexperiences.com</div>
            </div>
            
            {/* Customer Support */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-medium mb-2">Customer Support</h2>
              <p className="text-muted-foreground mb-4">
                Need help with a booking, have questions about an experience, or need to make changes?
              </p>
              <div className="text-purple-600 font-medium">support@slashexperiences.com</div>
            </div>
            
            {/* Business Hours */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-100">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-medium mb-2">Business Hours</h2>
              <p className="text-muted-foreground mb-4">
                You can contact us anytime. Always there to help.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Form Section */}
      <section 
        ref={formRef}
        className="py-16 md:py-24 bg-secondary/10"
      >
        <div className="container max-w-6xl mx-auto px-6 md:px-10">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-lg w-full">
              <h2 className="text-2xl font-medium mb-6">Send Us a Message</h2>
              <p className="mb-6 text-muted-foreground">Have a question or want to reach out? Click below to email us directly.</p>
              <a
                href="mailto:slash.adbc@gmail.com"
                className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold text-lg shadow hover:bg-primary/90 transition-colors duration-150"
              >
                Send us a message
              </a>
              <p className="mt-2 text-sm text-muted-foreground">
                If clicking doesn't open your email, please send your message to <b>slash.adbc@gmail.com</b>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
