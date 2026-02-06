import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  CalendarDays, 
  Landmark, 
  Mail, 
  Image as ImageIcon,
  Plane,
  User,
  Users,
  Briefcase,
  Baby,
  Heart,
  AlertTriangle,
  FileSignature,
  Video,
  Camera,
  Banknote,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InfoCard = ({ icon, title, children }) => {
  const Icon = icon;
  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-6">
        <div className="bg-blue-100 p-3 rounded-full">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="ml-4 text-2xl font-bold text-gray-800">{title}</h2>
      </div>
      <div className="space-y-4 text-gray-700">
        {children}
      </div>
    </motion.div>
  );
};

const BulletPoint = ({ icon, text, subtext }) => {
    const Icon = icon;
    return (
        <div className="flex items-start space-x-4">
            <Icon className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
            <div>
                <p className="font-semibold">{text}</p>
                {subtext && <p className="text-sm text-gray-500">{subtext}</p>}
            </div>
        </div>
    );
};

function SingaporeVisaPage() {
  const navigate = useNavigate();

  const handleApplyNow = () => {
    navigate('/?destination=Singapore');
  }

  return (
    <>
      <Helmet>
        <title>Singapore Visa Requirements - Apply from Mumbai | Stamp2Fly</title>
        <meta name="description" content="Get the latest information on Singapore visa requirements for applications from Mumbai. Checklist, fees, and processing times for travelers applying within 30 days of departure." />
        <link rel="canonical" href="https://www.stamp2fly.com/visa-requirements/singapore" />
      </Helmet>
      <Header />
      <main className="bg-blue-50/50">
        <section className="py-20 bg-gradient-to-br from-blue-100 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                🇸🇬 Singapore Visa — Mumbai
              </h1>
              <p className="mt-4 text-xl text-gray-600">
                Apply 30 Days Before Departure
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <InfoCard icon={FileText} title="Required Documents">
                <BulletPoint icon={FileSignature} text="Visa Form (14A)" subtext="Fill in blue/black ink, sign all pages, surname first. Minor requires both parents’ signatures + passport copies." />
                <BulletPoint icon={User} text="Passport" subtext="Valid ≥6 months from arrival. Provide original & copies of first, last, observation pages. Ensure ≥2 blank pages." />
                <BulletPoint icon={Landmark} text="Bank Statement" subtext="Last 6 months, balance ≥ ₹85,000; stamped & signed. Required even if spouse is a homemaker." />
                <BulletPoint icon={Mail} text="Covering Letter" subtext="On company letterhead (if employed) or individual letter. Include travel dates, purpose, contact info, and stay details." />
                <BulletPoint icon={Users} text="Invitation Letter" subtext="From Singapore. Include V39 form, NRIC/FIN, and invitee’s Passport/Employment Pass copy." />
                <BulletPoint icon={ImageIcon} text="Photos" subtext="2 recent 35×45 mm white-background matte photos; no glasses; tie back hair; name and passport no. on reverse." />
                <BulletPoint icon={Plane} text="Travel Itinerary" subtext="Blocked return air tickets and confirmed hotel booking." />
                <BulletPoint icon={Users} text="Sponsor Documents (if applicable)" subtext="Sponsorship letter, bank statement ≥ ₹85,000 per traveler, salary slip or GST/registration copy, passport copy." />
            </InfoCard>

            <InfoCard icon={Briefcase} title="Special Cases">
                <BulletPoint icon={User} text="Out-of-state passports" subtext="Provide one Maharashtra-area address proof." />
                <BulletPoint icon={Briefcase} text="Self-employed" subtext="GST/registration/invitation copies." />
                <BulletPoint icon={Banknote} text="Salaried" subtext="Last 3 salary slips." />
                <BulletPoint icon={Baby} text="Minors" subtext="Parental passports + NOC + school ID if traveling with others." />
                <BulletPoint icon={Heart} text="Newly married (≤1 year) with missing spouse name" subtext="Marriage certificate or wedding invite + photo." />
            </InfoCard>
            
            <InfoCard icon={AlertTriangle} title="Additional Rules (effective from 17-Mar-2025)">
                <BulletPoint icon={FileSignature} text="Forms" subtext="all pages handwritten (5 signatures)." />
                <BulletPoint icon={Mail} text="Cover letters" subtext="customized per applicant." />
                <BulletPoint icon={Video} text="Video-call verification mandatory." />
                <BulletPoint icon={Camera} text="Camera photos only." />
                <BulletPoint icon={Landmark} text="First-time to Singapore requires bank statements." />
                <BulletPoint icon={CalendarDays} text="E-Visa validity" subtext="5 weeks, 3 months, 1 or 2 years — report discrepancies." />
                <BulletPoint icon={AlertTriangle} text="Emergency medical cases need prior permission." />
            </InfoCard>

            <InfoCard icon={Banknote} title="Fees & Processing Time">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-8">
                    <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-3 rounded-full"><Banknote className="w-7 h-7 text-blue-600"/></div>
                        <div>
                            <p className="text-gray-500">Fee</p>
                            <p className="text-2xl font-bold text-gray-800">₹2,625 <span className="text-base font-normal">+ courier</span></p>
                        </div>
                    </div>
                     <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-3 rounded-full"><Clock className="w-7 h-7 text-blue-600"/></div>
                        <div>
                            <p className="text-gray-500">Processing Time</p>
                            <p className="text-2xl font-bold text-gray-800">5–6 working days</p>
                        </div>
                    </div>
                </div>
            </InfoCard>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all group"
                onClick={handleApplyNow}
              >
                Apply Now for Singapore
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default SingaporeVisaPage;