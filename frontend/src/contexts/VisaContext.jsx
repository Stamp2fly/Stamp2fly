import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getAllChecklists, getCountries, getFaqs } from '@/api/adminApi';

const initialVisaData = {
  'United Arab Emirates': {
    isoCode: 'ae',
    flag: '🇦🇪',
    source: "https://u.ae/en/information-and-services/visa-and-emirates-id/do-you-need-an-entry-permit-or-a-visa-to-enter-the-uae",
    options: [
      { id: 1, name: 'Tourist Visa', entry: 'Single', validity: '60 days', duration: '30 days', processingTime: '5 Business Days', price: 6598, fees: { absconding: 'AED 5,000' } },
      { id: 2, name: 'UAE 30 Days Single Entry Super Fast Express', entry: 'Single', validity: '60 days', duration: '30 days', processingTime: '24 Working Hours', price: 17998, fees: { absconding: 'AED 5,000' } },
      { id: 3, name: 'Combo: Express E-Visa + Travel Insurance', entry: 'Single', validity: '60 days', duration: '30 days', processingTime: '48 Working Hours', price: 8607, originalPrice: 8753, fees: { absconding: 'AED 5,000' }, combo: true },
    ],
    checklist: {
      base: [
        { key: 'passport_scan', name: 'Passport Scan', description: 'Bio & last page' },
        { key: 'photo', name: 'Passport Photo', description: 'White background' },
      ],
      employed: [
        { key: 'employment_letter', name: 'Employment Letter', description: 'From your employer' },
        { key: 'bank_statement', name: 'Bank Statement', description: 'Last 3 months' },
      ],
      'self-employed': [
        { key: 'business_reg', name: 'Business Registration', description: 'Proof of ownership' },
      ],
      student: [
        { key: 'student_id', name: 'Student ID', description: 'From your institution' },
      ],
      sponsored: [
        { key: 'sponsor_docs', name: 'Sponsor Documents', description: 'Sponsor\'s ID and financials' },
      ],
    },
    faq: [
      { q: 'Is travel insurance required?', a: 'Yes, travel insurance with COVID-19 coverage is mandatory.' },
      { q: 'Can I extend my visa?', a: 'Yes, tourist visas can be extended for an additional 30 days twice.' }
    ],
  },
  'Singapore': {
    isoCode: 'sg',
    flag: '🇸🇬',
    source: "https://www.ica.gov.sg/enter-transit-depart/entering-singapore/visa_requirements",
    options: [
      { id: 1, name: 'Tourist Visa', entry: 'Single', validity: '30 days', duration: '30 days', processingTime: '3-5 Business Days', price: 3000 },
    ],
    checklist: {
      base: [
        { key: 'form_14a', name: 'Completed Form 14A', description: 'Signed by applicant' },
        { key: 'passport_scan', name: 'Passport Scan', description: 'Bio page' },
        { key: 'photo', name: 'Recent Photo', description: '35x45mm, matte' },
        { key: 'itinerary', name: 'Flight Itinerary', description: 'Confirmed bookings' },
        { key: 'hotel', name: 'Hotel Booking', description: 'Proof of accommodation' },
      ],
      employed: [
        { key: 'cover_letter', name: 'Cover Letter', description: 'On company letterhead' },
      ],
    },
    faq: [
      { q: 'Do I need to complete an SG Arrival Card?', a: 'Yes, all travelers must complete the SG Arrival Card online before arrival.' },
      { q: 'Is an interview required?', a: 'No, interviews are generally not required for tourist visas.' }
    ]
  },
  'United States': {
    isoCode: 'us',
    flag: '🇺🇸',
    source: "https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html",
    options: [
        { id: 1, name: 'B1/B2 Visitor Visa', entry: 'Multiple', validity: 'up to 10 years', duration: 'up to 6 months', processingTime: 'Varies by consulate', price: 15000 },
    ],
    checklist: {
        base: [
            { key: 'ds160', name: 'DS-160 Confirmation', description: 'Confirmation page' },
            { key: 'passport', name: 'Valid Passport', description: 'With 6+ months validity' },
            { key: 'appointment', name: 'Appointment Letter', description: 'Interview confirmation' },
            { key: 'payment_receipt', name: 'Visa Fee Receipt', description: 'Proof of payment' },
            { key: 'cover_letter', name: 'Cover Letter', description: 'Explaining purpose of travel' },
            { key: 'proof_funds', name: 'Proof of Funds', description: 'Bank statements, pay stubs' },
            { key: 'proof_ties', name: 'Proof of Ties', description: 'Employment, property docs' },
        ],
    },
    faq: [
      { q: 'How long is the B-2 visa valid for?', a: 'The visa can be valid for up to 10 years, but the duration of each stay is determined by CBP at the port of entry, typically up to 6 months.' },
      { q: 'Can I work on a visitor visa?', a: 'No, you are not permitted to engage in any employment.' }
    ]
  },
   'Canada': {
    isoCode: 'ca',
    flag: '🇨🇦',
    source: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html",
    options: [
        { id: 1, name: 'Visitor Visa', entry: 'Multiple', validity: 'up to 10 years', duration: 'up to 6 months', processingTime: 'Varies', price: 8500 },
    ],
    checklist: {
        base: [
            { key: 'form_imm5257', name: 'Application Form (IMM 5257)', description: 'Main application form' },
            { key: 'form_imm5707', name: 'Family Information (IMM 5707)', description: 'Family details' },
            { key: 'passport_scans', name: 'Passport Scans', description: 'All stamped pages' },
            { key: 'proof_funds', name: 'Proof of Financial Support', description: 'Bank statements' },
            { key: 'photo', name: 'Digital Photo', description: 'As per specifications' },
            { key: 'purpose_travel', name: 'Purpose of Travel', description: 'Itinerary, flight bookings' },
        ],
        optional: [
            { key: 'proof_ties', name: 'Proof of Ties', description: 'To home country' },
        ]
    },
    faq: [
      { q: 'Do I need to give biometrics?', a: 'Most applicants for a visitor visa need to give biometrics. This is a one-time process valid for 10 years.' },
    ]
  },
  'United Kingdom': {
    isoCode: 'gb',
    flag: '🇬🇧',
    source: "https://www.gov.uk/standard-visitor-visa",
    options: [
        { id: 1, name: 'Standard Visitor', entry: 'Single/Multiple', validity: '6 months', duration: '6 months', processingTime: '3 weeks', price: 11000 },
        { id: 2, name: '2 Year Long-Term Visitor', entry: 'Multiple', validity: '2 years', duration: '6 months per visit', processingTime: '3 weeks', price: 40000 },
    ],
    checklist: {
        base: [
            { key: 'passport', name: 'Valid Passport', description: 'With a blank page' },
            { key: 'financials', name: 'Financial Documents', description: 'Bank statements, payslips' },
            { key: 'accommodation', name: 'Accommodation Details', description: 'Hotel or stay proof' },
            { key: 'itinerary', name: 'Detailed Travel Itinerary', description: 'Day-wise plan' },
        ],
        employed: [
            { key: 'employment_proof', name: 'Proof of Employment', description: 'Letter from employer' },
        ],
        student: [
            { key: 'studies_proof', name: 'Proof of Studies', description: 'Letter from institution' },
        ]
    },
    faq: [
      { q: 'How long can I stay in the UK?', a: 'You can usually stay in the UK for up to 6 months.' },
    ]
  },
  'Australia': {
    isoCode: 'au',  
    flag: '🇦🇺',
    source: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600",
    options: [
        { id: 1, name: 'Visitor (subclass 600)', entry: 'Single/Multiple', validity: 'up to 12 months', duration: 'up to 3 months', processingTime: 'Varies', price: 10000 },
    ],
    checklist: {
        base: [
            { key: 'passport_scan', name: 'Passport Bio Page Scan', description: 'Clear color copy' },
            { key: 'photo', name: 'Recent Photo', description: 'Passport-sized' },
            { key: 'proof_funds', name: 'Proof of Funds', description: 'To cover your trip costs' },
            { key: 'itinerary', name: 'Itinerary', description: 'Planned activities' },
        ],
        optional: [
            { key: 'invitation_letter', name: 'Invitation letter', description: 'From host in Australia' },
        ]
    },
    faq: [
      { q: 'What is the "Genuine Temporary Entrant" requirement?', a: 'You must show that you only intend to visit Australia temporarily for tourism or business purposes.' }
    ]
  }
};

const VisaContext = createContext();

export const VisaProvider = ({ children }) => {
  const [visaData, setVisaData] = useState(() => {
    try {
      const savedData = localStorage.getItem('visaData');
      return savedData ? JSON.parse(savedData) : initialVisaData;
    } catch (error) {
      console.error("Could not parse visa data from localStorage", error);
      return initialVisaData;
    }
  });

  const buildVisaDataFromApi = useCallback(async () => {
    const [countries, checklists, faqs] = await Promise.all([
      getCountries(),
      getAllChecklists(),
      getFaqs(),
    ]);

    const countryIdToName = new Map();

    const mapped = (countries || []).reduce((accumulator, country) => {
      const countryName = country.countryName;
      if (!countryName) {
        return accumulator;
      }

      countryIdToName.set(String(country._id), countryName);

      accumulator[countryName] = {
        _id: country._id,
        isoCode: country.isoCode || '',
        flag: country.flag || '',
        source: country.officialURL || '',
        isRecent: Boolean(country.showOnHomepage),
        options: (country.visaOptions || []).map((option, index) => ({
          id: option.id || index + 1,
          name: option.name || option.visaType || 'Visa Option',
          entry: option.entry || option.entryType || '',
          validity: option.validity || '',
          duration: option.duration || option.stayDuration || '',
          processingTime: option.processingTime || '',
          price: Number(option.price) || 0,
          originalPrice: option.originalPrice,
          combo: Boolean(option.combo ?? option.isCombo),
          alertMessage: option.alertMessage || option.pricingNote || '',
          fees: option.fees || {},
        })),
        checklist: { base: [] },
        faq: [],
      };

      return accumulator;
    }, {});

    (checklists || []).forEach((entry) => {
      const countryName = entry.countryName || countryIdToName.get(String(entry.countryId));
      if (!countryName || !mapped[countryName]) {
        return;
      }

      const category = entry.category || 'base';
      mapped[countryName].checklist = {
        ...(mapped[countryName].checklist || { base: [] }),
        [category]: entry.items || [],
      };
    });

    (faqs || []).forEach((item) => {
      if (item.isGlobal || !item.countryId) {
        return;
      }

      const countryName = countryIdToName.get(String(item.countryId));
      if (!countryName || !mapped[countryName]) {
        return;
      }

      mapped[countryName].faq = [
        ...(mapped[countryName].faq || []),
        {
          q: item.question,
          a: item.answer,
        },
      ];
    });

    return mapped;
  }, []);

  const refreshVisaData = useCallback(async () => {
    try {
      const nextData = await buildVisaDataFromApi();
      if (Object.keys(nextData || {}).length > 0) {
        setVisaData(nextData);
      }
    } catch (error) {
      console.error('Failed to fetch visa data from API', error);
    }
  }, [buildVisaDataFromApi]);

  useEffect(() => {
    localStorage.setItem('visaData', JSON.stringify(visaData));
  }, [visaData]);

  useEffect(() => {
    refreshVisaData();
  }, [refreshVisaData]);

  const updateVisaData = (newData) => {
    setVisaData(newData);
  };

  const value = {
    visaData,
    updateVisaData,
    refreshVisaData,
  };

  return <VisaContext.Provider value={value}>{children}</VisaContext.Provider>;
};

export const useVisa = () => {
  const context = useContext(VisaContext);
  if (!context) {
    throw new Error('useVisa must be used within a VisaProvider');
  }
  return context;
};