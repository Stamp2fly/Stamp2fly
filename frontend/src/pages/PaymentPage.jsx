import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import {
  createApplication,
  updateApplication,
  uploadApplicationDocuments,
  submitApplication,
} from '@/api/applicationApi';
import { processPayment } from '@/services/paymentGateway';

const normalizeOccupation = (occupation) => (occupation === 'employed' ? 'salaried' : occupation);

const parseAge = (dateOfBirth) => {
  if (!dateOfBirth) {
    return undefined;
  }

  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) {
    return undefined;
  }

  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  const dayDiff = now.getDate() - dob.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }
  return age > 0 ? age : undefined;
};

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const applicationData = location.state || {};
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const totalCost = applicationData.selectedPlans?.reduce((acc, plan) => acc + plan.price, 0) || 0;
  const currency = applicationData.selectedPlans?.[0]?.currency || 'USD';
  const payableAmount = Number(totalCost) || 0;

  const getAuthUser = () => {
    try {
      return JSON.parse(localStorage.getItem('authUser') || 'null');
    } catch {
      return null;
    }
  };

  const primaryTraveler = applicationData.travelers?.[0] || {};

  const buildApplicationPayload = (userId, paymentResult) => ({
    userId,
    status: 'draft',
    fullName: primaryTraveler.fullName || '',
    age: parseAge(primaryTraveler.dateOfBirth),
    phone: primaryTraveler.phone || '',
    email: primaryTraveler.email || '',
    country: applicationData.destination || '',
    travelDates: {
      from: applicationData.travelDates?.from || undefined,
      to: applicationData.travelDates?.to || undefined,
    },
    maritalStatus: primaryTraveler.maritalStatus || undefined,
    occupation: normalizeOccupation(primaryTraveler.occupation) || undefined,
    sponsorship: primaryTraveler.sponsorship === 'sponsored' ? 'family' : (primaryTraveler.sponsorship || 'self'),
    financialDetails: {
      employmentType: normalizeOccupation(primaryTraveler.occupation) || undefined,
    },
    paymentStatus: paymentResult.status,
    paymentInfo: {
      provider: paymentResult.provider,
      transactionId: paymentResult.transactionId,
      amount: paymentResult.amount,
      currency: paymentResult.currency,
      paidAt: paymentResult.paidAt,
    },
  });

  const buildUploadFormData = () => {
    const formData = new FormData();

    if (primaryTraveler.passportFrontFile?._file) {
      formData.append('passportFront', primaryTraveler.passportFrontFile._file);
    }
    if (primaryTraveler.passportBackFile?._file) {
      formData.append('passportBack', primaryTraveler.passportBackFile._file);
    }
    if (primaryTraveler.photoFile?._file) {
      formData.append('passportPhoto', primaryTraveler.photoFile._file);
    }

    const financialDocuments = Object.values(applicationData.financialDocuments || {})
      .map((file) => file?._file)
      .filter(Boolean);

    financialDocuments.forEach((file) => {
      formData.append('financialDocs', file);
    });

    return formData;
  };

  const handlePayment = async () => {
    const authUser = getAuthUser();
    if (!authUser?._id) {
      toast({
        title: 'Login required',
        description: 'Please login before making payment.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (!cardHolderName.trim() || !cardNumber.trim() || !expiry.trim() || !cvv.trim()) {
      toast({
        title: 'Missing card details',
        description: 'Please fill all payment fields.',
        variant: 'destructive',
      });
      return;
    }

    if (!primaryTraveler.fullName || !primaryTraveler.phone) {
      toast({
        title: 'Incomplete application',
        description: 'Please complete traveler details before payment.',
        variant: 'destructive',
      });
      navigate('/apply', { state: applicationData });
      return;
    }

    try {
      setIsProcessing(true);

      const paymentResult = await processPayment({
        amount: payableAmount,
        currency,
        cardNumber,
        cardHolderName,
        provider: 'dummy',
      });

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment failed');
      }

      const createdApplication = await createApplication({ userId: authUser._id });

      await updateApplication(
        createdApplication._id,
        buildApplicationPayload(authUser._id, paymentResult)
      );

      const formData = buildUploadFormData();
      if ([...formData.keys()].length > 0) {
        await uploadApplicationDocuments(createdApplication._id, formData);
      }

      await submitApplication(createdApplication._id);

      toast({
        title: 'Payment successful',
        description: 'Your application was submitted successfully. You can track it in your dashboard.',
        className: 'bg-emerald-600 text-white',
      });

      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast({
        title: 'Payment or submission failed',
        description: error?.response?.data?.message || error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Secure Payment - Stamp2Fly</title>
        <meta name="description" content="Complete your payment securely to finalize your visa application." />
      </Helmet>

      <Header />
      <main>
        <section className="py-8 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button
              onClick={() => navigate('/apply', { state: applicationData })}
              variant="outline"
              className="flex items-center space-x-2 bg-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Application</span>
            </Button>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Secure <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">Payment</span>
              </h1>
              <p className="text-xl text-gray-600">
                Finalize your application by completing the payment.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border p-8"
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  {applicationData.selectedPlans?.map(plan => (
                    <div key={plan.id} className="flex justify-between text-gray-600">
                      <span>{plan.name}</span>
                      <span className="font-medium">{new Intl.NumberFormat('en-IN').format(plan.price)} {currency}</span>
                    </div>
                  ))}
                  <hr/>
                  <div className="flex justify-between text-gray-900 font-bold text-xl">
                    <span>Total</span>
                    <span>{new Intl.NumberFormat('en-IN').format(totalCost)} {currency}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="md:col-span-2">
                  <Label htmlFor="card-holder">Card Holder Name</Label>
                  <Input
                    id="card-holder"
                    value={cardHolderName}
                    onChange={(event) => setCardHolderName(event.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    value={cardNumber}
                    onChange={(event) => setCardNumber(event.target.value)}
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                  />
                </div>
                <div>
                  <Label htmlFor="card-expiry">Expiry</Label>
                  <Input
                    id="card-expiry"
                    value={expiry}
                    onChange={(event) => setExpiry(event.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="card-cvv">CVV</Label>
                  <Input
                    id="card-cvv"
                    value={cvv}
                    onChange={(event) => setCvv(event.target.value)}
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>

              <div className="mt-8">
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <Lock className="w-5 h-5" />
                  <span>{isProcessing ? 'Processing...' : 'Pay Securely'}</span>
                </Button>
              </div>
              <p className="text-center text-xs text-gray-500 mt-4">
                Dummy secure gateway enabled. Replace provider in payment service for production integration.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default PaymentPage;
