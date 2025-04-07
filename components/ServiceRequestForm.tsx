"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { 
  PhoneIcon, 
  ClockIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  BuildingOfficeIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export default function ServiceRequestForm() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    equipmentType: '',
    model: '',
    serialNumber: '',
    serviceNeeded: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
    urgency: 'normal'
  });

  // Form validation
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    equipmentType: '',
    serviceNeeded: '',
    preferredDate: ''
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

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    }

    if (!formData.equipmentType.trim()) {
      newErrors.equipmentType = 'Equipment type is required';
      valid = false;
    }

    if (!formData.serviceNeeded.trim()) {
      newErrors.serviceNeeded = 'Service needed is required';
      valid = false;
    }

    if (!formData.preferredDate.trim()) {
      newErrors.preferredDate = 'Preferred date is required';
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
        address: '',
        city: '',
        state: '',
        zip: '',
        equipmentType: '',
        model: '',
        serialNumber: '',
        serviceNeeded: '',
        preferredDate: '',
        preferredTime: '',
        message: '',
        urgency: 'normal'
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('error');
    }
  };

  // Calculate minimum date for date picker (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
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
              Request Service
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Need service for your pressure washing equipment? Complete this form to schedule a service appointment with our expert technicians.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-blue-600 opacity-5 pattern-diagonal-lines pattern-white pattern-bg-transparent pattern-size-4 pattern-opacity-10"></div>
      </section>

      {/* Service Request Form and Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Service Information */}
            <div className="lg:w-1/3">
              <div className={`rounded-xl shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="bg-blue-600 py-6 px-8 text-white">
                  <h2 className="text-2xl font-bold">Service Information</h2>
                  <p className="mt-2 text-blue-100">Our service department is ready to assist you</p>
                </div>
                <div className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-blue-100'} mr-4`}>
                        <PhoneIcon className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Service Hotline</h3>
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
                        <ClockIcon className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Service Hours</h3>
                        <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Monday - Friday: 8:00 AM - 5:00 PM<br />
                          Saturday: Closed<br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-blue-100'} mr-4`}>
                        <BuildingOfficeIcon className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Service Depot</h3>
                        <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          3300 Steeles Ave. West #27<br />
                          Concord, ON L4K 2Y4<br />
                          Canada
                        </p>
                      </div>
                    </div>

                    <div className={`mt-8 p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                      <div className="flex items-start">
                        <InformationCircleIcon className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mr-2 flex-shrink-0 mt-0.5`} />
                        <div>
                          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Service Policy</h3>
                          <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Our service technicians are factory-trained and equipped to handle all your maintenance and repair needs. Emergency service is available for critical situations. For warranty service, please have your serial number ready.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Request Form */}
            <div className="lg:w-2/3">
              <div className={`rounded-xl shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="p-8">
                  <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Schedule Service</h2>
                  
                  {formStatus === 'success' ? (
                    <div className={`rounded-lg ${isDarkMode ? 'bg-green-900' : 'bg-green-100'} p-6 text-center`}>
                      <CheckCircleIcon className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                      <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Service Request Submitted!</h3>
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Thank you for your service request. Our service department will contact you within 24 business hours to confirm your appointment details.
                      </p>
                      <button
                        onClick={() => setFormStatus('idle')}
                        className={`mt-4 px-6 py-2 cursor-pointer rounded-lg ${isDarkMode ? 'bg-green-700 text-white' : 'bg-green-600 text-white'} hover:bg-opacity-90 transition`}
                      >
                        Submit Another Request
                      </button>
                    </div>
                  ) : formStatus === 'error' ? (
                    <div className={`rounded-lg ${isDarkMode ? 'bg-red-900' : 'bg-red-100'} p-6 text-center`}>
                      <div className="mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-red-500/20">
                        <span className="text-3xl">❌</span>
                      </div>
                      <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Something went wrong!</h3>
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        There was an error submitting your service request. Please try again or call our service hotline directly.
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
                        {/* Contact Information */}
                        <div className="md:col-span-2">
                          <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Contact Information</h3>
                        </div>
                        
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
                            Phone Number <span className="text-red-500">*</span>
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
                          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                        </div>
                        
                        {/* Service Location */}
                        <div className="md:col-span-2 pt-4">
                          <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Service Location</h3>
                        </div>
                        
                        <div className="md:col-span-2">
                          <label htmlFor="address" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Street Address
                          </label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg ${isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-gray-50 border-gray-300 text-gray-900'
                            } border focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="123 Main St"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="city" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            City
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg ${isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-gray-50 border-gray-300 text-gray-900'
                            } border focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="Toronto"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="state" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Province/State
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg ${isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-gray-50 border-gray-300 text-gray-900'
                            } border focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="Ontario"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="zip" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Postal/ZIP Code
                          </label>
                          <input
                            type="text"
                            id="zip"
                            name="zip"
                            value={formData.zip}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg ${isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-gray-50 border-gray-300 text-gray-900'
                            } border focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="M5V 2H1"
                          />
                        </div>
                        
                        {/* Equipment Information */}
                        <div className="md:col-span-2 pt-4">
                          <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Equipment Information</h3>
                        </div>
                        
                        <div>
                          <label htmlFor="equipmentType" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Equipment Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="equipmentType"
                            name="equipmentType"
                            value={formData.equipmentType}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 cursor-pointer rounded-lg ${isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-gray-50 border-gray-300 text-gray-900'
                            } border focus:ring-blue-500 focus:border-blue-500`}
                          >
                            <option value="">Select Equipment Type</option>
                            <option value="Hot Water Pressure Washer">Hot Water Pressure Washer</option>
                            <option value="Cold Water Pressure Washer">Cold Water Pressure Washer</option>
                            <option value="Steam Cleaner">Steam Cleaner</option>
                            <option value="Waste Water Treatment System">Waste Water Treatment System</option>
                            <option value="Water Reclaim System">Water Reclaim System</option>
                            <option value="Other">Other</option>
                          </select>
                          {errors.equipmentType && <p className="mt-1 text-sm text-red-500">{errors.equipmentType}</p>}
                        </div>
                        
                        <div>
                          <label htmlFor="model" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Model Number
                          </label>
                          <input
                            type="text"
                            id="model"
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg ${isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-gray-50 border-gray-300 text-gray-900'
                            } border focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="e.g. PSC-2000HW"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="serialNumber" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Serial Number
                          </label>
                          <input
                            type="text"
                            id="serialNumber"
                            name="serialNumber"
                            value={formData.serialNumber}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg ${isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-gray-50 border-gray-300 text-gray-900'
                            } border focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="e.g. PSC12345678"
                          />
                        </div>
                        
                        {/* Service Details */}
                        <div className="md:col-span-2 pt-4">
                          <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Service Details</h3>
                        </div>
                        
                        <div className="md:col-span-2">
                          <label htmlFor="serviceNeeded" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Service Needed <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="serviceNeeded"
                            name="serviceNeeded"
                            value={formData.serviceNeeded}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 cursor-pointer rounded-lg ${isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-gray-50 border-gray-300 text-gray-900'
                            } border focus:ring-blue-500 focus:border-blue-500`}
                          >
                            <option value="">Select Service Type</option>
                            <option value="Repair">Repair</option>
                            <option value="Maintenance">Routine Maintenance</option>
                            <option value="Inspection">Inspection</option>
                            <option value="Installation">Installation</option>
                            <option value="Warranty">Warranty Claim</option>
                            <option value="Other">Other</option>
                          </select>
                          {errors.serviceNeeded && <p className="mt-1 text-sm text-red-500">{errors.serviceNeeded}</p>}
                        </div>
                        
                        <div>
                          <label htmlFor="urgency" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Service Urgency
                          </label>
                          <select
                            id="urgency"
                            name="urgency"
                            value={formData.urgency}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 cursor-pointer rounded-lg ${isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-gray-50 border-gray-300 text-gray-900'
                            } border focus:ring-blue-500 focus:border-blue-500`}
                          >
                            <option value="normal">Normal - Schedule Next Available</option>
                            <option value="high">High - As Soon As Possible</option>
                            <option value="emergency">Emergency - Production Down</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="preferredDate" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Preferred Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            id="preferredDate"
                            name="preferredDate"
                            value={formData.preferredDate}
                            onChange={handleChange}
                            min={getMinDate()}
                            className={`w-full px-4 py-3 rounded-lg ${isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-gray-50 border-gray-300 text-gray-900'
                            } border focus:ring-blue-500 focus:border-blue-500`}
                          />
                          {errors.preferredDate && <p className="mt-1 text-sm text-red-500">{errors.preferredDate}</p>}
                        </div>
                        
                        <div>
                          <label htmlFor="preferredTime" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Preferred Time
                          </label>
                          <select
                            id="preferredTime"
                            name="preferredTime"
                            value={formData.preferredTime}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 cursor-pointer rounded-lg ${isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-gray-50 border-gray-300 text-gray-900'
                            } border focus:ring-blue-500 focus:border-blue-500`}
                          >
                            <option value="">Select Time Range</option>
                            <option value="8:00 AM - 10:00 AM">8:00 AM - 10:00 AM</option>
                            <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                            <option value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</option>
                            <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
                          </select>
                        </div>
                        
                        <div className="md:col-span-2">
                          <label htmlFor="message" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Problem Description
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
                            placeholder="Please describe the issue you're experiencing with your equipment"
                          ></textarea>
                        </div>
                      </div>
                      
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'} mt-6 mb-6`}>
                        <div className="flex items-start">
                          <InformationCircleIcon className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mr-2 flex-shrink-0 mt-0.5`} />
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            A service coordinator will contact you within 24 business hours to confirm your appointment. 
                            For emergency service, please call our service hotline at (800) 246-9689.
                          </p>
                        </div>
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
                              Processing...
                            </>
                          ) : (
                            <>
                              Submit Service Request
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

      {/* FAQ Section */}
      <section className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-2xl font-bold mb-12 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Frequently Asked Service Questions
          </h2>
          <div className="max-w-3xl mx-auto divide-y divide-gray-200 dark:divide-gray-700" itemScope itemType="https://schema.org/FAQPage">
            <div className="py-6" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} itemProp="name">
                What should I do if my equipment needs immediate attention?
              </h3>
              <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} itemProp="text">
                  For emergency service, please call our service hotline directly at (800) 246-9689. Our service coordinators will work to get a technician to you as quickly as possible.
                </p>
              </div>
            </div>
            
            <div className="py-6" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} itemProp="name">
                How long does a typical service appointment take?
              </h3>
              <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} itemProp="text">
                  Service appointment duration varies depending on the type of service needed. Routine maintenance typically takes 1-2 hours, while repairs can take 2-4 hours depending on complexity. Our technician will provide a time estimate when your appointment is confirmed.
                </p>
              </div>
            </div>
            
            <div className="py-6" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} itemProp="name">
                Is there a service warranty on repairs?
              </h3>
              <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} itemProp="text">
                  Yes, all our repair work comes with a 90-day warranty on labor and parts replaced. If you experience the same issue within 90 days of service, we&apos;ll return to resolve it at no additional charge.
                </p>
              </div>
            </div>
            
            <div className="py-6" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} itemProp="name">
                Do you offer maintenance service plans?
              </h3>
              <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} itemProp="text">
                  Yes, we offer preventative maintenance service plans to keep your equipment running at peak performance. These plans include scheduled maintenance visits, priority service, and discounts on parts and repairs. Contact our service department for details.
                </p>
              </div>
            </div>
            
            <div className="py-6" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} itemProp="name">
                What information should I have ready when the technician arrives?
              </h3>
              <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} itemProp="text">
                  Please have your equipment&apos;s model and serial number available, as well as a description of any issues you&apos;re experiencing. If the equipment is under warranty, having proof of purchase or warranty information is also helpful.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}