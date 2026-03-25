'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Camera, ArrowLeft, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const packages = [
  {
    id: 'prewedding',
    name: 'Pre-Wedding',
    price: 2500000,
    duration: '4-6 hours',
  },
  {
    id: 'wedding',
    name: 'Wedding Day',
    price: 5000000,
    duration: 'Full day',
  },
  {
    id: 'portrait',
    name: 'Portrait',
    price: 750000,
    duration: '1-2 hours',
  },
  {
    id: 'product',
    name: 'Product',
    price: 500000,
    duration: '2-3 hours',
  },
];

const timeSlots = [
  '09:00',
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
];

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div></div>}>
      <BookingContent />
    </Suspense>
  );
}

function BookingContent() {
  const searchParams = useSearchParams();
  const preselectedPackage = searchParams.get('package');

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    packageName: preselectedPackage || '',
    date: '',
    time: '',
    location: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (preselectedPackage) {
      setFormData((prev) => ({ ...prev, packageName: preselectedPackage }));
    }
  }, [preselectedPackage]);

  const selectedPkg = packages.find((p) => p.id === formData.packageName);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalPrice: selectedPkg?.price || 0,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit booking');

      setIsSuccess(true);
      toast.success('Booking submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Booking Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your booking. We will contact you shortly to confirm
            your appointment.
          </p>
          <Link
            href="/"
            className="inline-block bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Link>
          <div className="flex items-center ml-auto">
            <Camera className="w-6 h-6 text-pink-500 mr-2" />
            <span className="font-semibold">Convo Photography</span>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-8 text-white">
            <h1 className="text-3xl font-bold">Book Your Session</h1>
            <p className="text-pink-100 mt-2">
              Fill in the details below to book your photography session
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Package Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Package *
              </label>
              <select
                name="packageName"
                value={formData.packageName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Choose a package</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} - Rp {pkg.price.toLocaleString('id-ID')}
                  </option>
                ))}
              </select>
            </div>

            {selectedPkg && (
              <div className="bg-pink-50 rounded-lg p-4">
                <p className="font-medium text-pink-800">{selectedPkg.name}</p>
                <p className="text-pink-600">
                  Duration: {selectedPkg.duration} | Price: Rp{' '}
                  {selectedPkg.price.toLocaleString('id-ID')}
                </p>
              </div>
            )}

            {/* Personal Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="+62 812 3456 7890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Studio or outdoor location"
                />
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time *
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Select time</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Any special requests or details..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Booking'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
