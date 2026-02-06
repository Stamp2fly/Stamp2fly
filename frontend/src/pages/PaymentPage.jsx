import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const applicationData = location.state || {};

  const totalCost = applicationData.selectedPlans?.reduce((acc, plan) => acc + plan.price, 0) || 0;
  const currency = applicationData.selectedPlans?.[0]?.currency || 'USD';

  const handlePayment = () => {
    toast({
      title: "🚧 Payment Gateway Not Implemented",
      description: "This is a demo. In a real app, you would be redirected to a payment provider. You can request Stripe integration in the next prompt!",
      variant: "destructive"
    });
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
              onClick={() => navigate('/documents', { state: applicationData })}
              variant="outline"
              className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Documents</span>
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

              <div className="mt-8">
                <Button
                  onClick={handlePayment}
                  className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <Lock className="w-5 h-5" />
                  <span>Pay Securely</span>
                </Button>
              </div>
              <p className="text-center text-xs text-gray-500 mt-4">
                All transactions are secure and encrypted.
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