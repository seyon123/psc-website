"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  BuildingOfficeIcon, 
  ClockIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function ContactForm() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    interested: 'general'
  });

  // Form validation
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine if we're in dark mode
  const isDarkMode = mounted && resolvedTheme === 'dark';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setFormStatus('submitting');

    // Simulate API call
    try {
      // Replace with actual API call to your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        interested: 'general'
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('error');
    }
  };

  // Don't render with theme-specific styles until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode
      ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200'
      : 'bg-gradient-to-b from-white to-gray-50 text-gray-700'
      }`}
    >
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Contact Us
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Have questions about our products or services? Our team is ready to help you find the perfect solution for your needs.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-blue-600 opacity-5 pattern-diagonal-lines pattern-white pattern-bg-transparent pattern-size-4 pattern-opacity-10"></div>
      </section>

      {/* Contact Information and Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Contact Information */}
            <div className="lg:w-1/3">
              <div className={`rounded-xl shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="bg-blue-600 py-6 px-8 text-white">
                  <h2 className="text-2xl font-bold">Get In Touch</h2>
                  <p className="mt-2 text-blue-100">We&apos;re here to help with any questions you have</p>
                </div>
                <div className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-blue-100'} mr-4`}>
                        <PhoneIcon className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Phone</h3>
                        <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <a href="tel:+18002469689" className="hover:underline">(800) 246-9689</a>
                        </p>
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <a href="tel:+19057611733" className="hover:underline">(905) 761-1733</a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-blue-100'} mr-4`}>
                        <EnvelopeIcon className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Email</h3>
                        <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <a href="mailto:info@pscclean.com" className="hover:underline">info@pscclean.com</a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-blue-100'} mr-4`}>
                        <BuildingOfficeIcon className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Address</h3>
                        <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          3300 Steeles Ave. West #27<br />
                          Concord, ON L4K 2Y4<br />
                          Canada
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-blue-100'} mr-4`}>
                        <ClockIcon className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Business Hours</h3>
                        <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Monday - Friday: 8:00 AM - 5:00 PM<br />
                          Saturday: Closed<br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:w-2/3">
              <div className={`rounded-xl shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="p-8">
                  <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Send Us a Message</h2>
                  
                  {formStatus === 'success' ? (
                    <div className={`rounded-lg ${isDarkMode ? 'bg-green-900' : 'bg-green-100'} p-6 text-center`}>
                      <CheckCircleIcon className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                      <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Message Sent!</h3>
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Thank you for contacting us. We&apos;ll get back to you as soon as possible.
                      </p>
                      <button
                        onClick={() => setFormStatus('idle')}
                        className={`mt-4 px-6 py-2 cursor-pointer rounded-lg ${isDarkMode ? 'bg-green-700 text-white' : 'bg-green-600 text-white'} hover:bg-opacity-90 transition`}
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : formStatus === 'error' ? (
                    <div className={`rounded-lg ${isDarkMode ? 'bg-red-900' : 'bg-red-100'} p-6 text-center`}>
                      <div className="mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-red-500/20">
                        <span className="text-3xl">❌</span>
                      </div>
                      <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Something went wrong!</h3>
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        There was an error sending your message. Please try again or contact us directly.
                      </p>
                      <button
                        onClick={() => setFormStatus('idle')}
                        className={`mt-4 px-6 py-2 cursor-pointer rounded-lg ${isDarkMode ? 'bg-red-700 text-white' : 'bg-red-600 text-white'} hover:bg-opacity-90 transition`}
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Your Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg ${isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-gray-50 border-gray-300 text-gray-900'
                            } border focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="John Smith"
                          />
                          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>
                        
                        <div>
                          <label htmlFor="email" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg ${isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-gray-50 border-gray-300 text-gray-900'
                            } border focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="john@example.com"
                          />
                          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>
                        
                        <div>
                          <label htmlFor="phone" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg ${isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-gray-50 border-gray-300 text-gray-900'
                            } border focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="(123) 456-7890"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="company" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Company Name
                          </label>
                          <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg ${isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-gray-50 border-gray-300 text-gray-900'
                            } border focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="Your Company"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="interested" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          I&apos;m interested in
                        </label>
                        <select
                          id="interested"
                          name="interested"
                          value={formData.interested}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 cursor-pointer rounded-lg ${isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                          } border focus:ring-blue-500 focus:border-blue-500`}
                        >
                          <option value="general">General Information</option>
                          <option value="quote">Product Quote</option>
                          <option value="support">Technical Support</option>
                          <option value="parts">Parts & Accessories</option>
                          <option value="service">Service Request</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="message" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-lg ${isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                          } border focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="How can we help you?"
                        ></textarea>
                        {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
                      </div>
                      
                      <div>
                        <button
                          type="submit"
                          disabled={formStatus === 'submitting'}
                          className={`w-full md:w-auto px-8 py-3 cursor-pointer rounded-lg flex items-center justify-center ${
                            formStatus === 'submitting'
                              ? 'bg-blue-400 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700'
                          } text-white font-medium transition-colors shadow-md`}
                        >
                          {formStatus === 'submitting' ? (
                            <>
                              <div className="mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                              Sending...
                            </>
                          ) : (
                            <>
                              Send Message
                              <ArrowRightIcon className="ml-2 h-5 w-5" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className={`text-2xl font-bold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Our Location</h2>
          <div className={`rounded-xl overflow-hidden shadow-lg ${isDarkMode ? 'border border-gray-700' : ''}`}>
            <div className="h-[450px] w-full">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2879.57878950422!2d-79.53196412251076!3d43.775009071096655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b2fdbadb39cd5%3A0xb6673b565e46acb2!2sPSC%20Pressure%20Systems%20Company%20Inc.!5e0!3m2!1sen!2sca!4v1742674473155!5m2!1sen!2sca" 
                width="100%" 
                height="450" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Pressure Systems Company Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-2xl font-bold mb-12 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto divide-y divide-gray-200 dark:divide-gray-700" itemScope itemType="https://schema.org/FAQPage">
            <div className="py-6" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} itemProp="name">
                What areas do you service?
              </h3>
              <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} itemProp="text">
                  We provide equipment and services throughout North America, with main service areas in the United States and Canada. For international inquiries, please contact us directly.
                </p>
              </div>
            </div>
            
            <div className="py-6" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} itemProp="name">
                Do you offer installation services?
              </h3>
              <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} itemProp="text">
                  Yes, we offer professional installation services for all of our equipment. Our technicians are factory-trained and certified to ensure your equipment is installed correctly and operates at peak efficiency.
                </p>
              </div>
            </div>
            
            <div className="py-6" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} itemProp="name">
                What warranty do you offer?
              </h3>
              <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} itemProp="text">
                  We stand behind our products with comprehensive warranty options. Standard warranties range from 1-5 years depending on the product line, with extended warranty options available. Please contact us for specific warranty information for the product you&apos;re interested in.
                </p>
              </div>
            </div>
            
            <div className="py-6" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} itemProp="name">
                Do you offer maintenance services?
              </h3>
              <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} itemProp="text">
                  Yes, we provide regular maintenance services to keep your equipment running efficiently. We offer maintenance contracts as well as on-demand service calls. Regular maintenance is key to maximizing the lifespan of your equipment and preventing costly breakdowns.
                </p>
              </div>
            </div>
            
            <div className="py-6" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} itemProp="name">
                How quickly can I get replacement parts?
              </h3>
              <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} itemProp="text">
                  We maintain a large inventory of replacement parts and can ship most items within 24-48 hours. For emergency situations, we offer expedited shipping options. Contact our parts department for specific availability and delivery times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}