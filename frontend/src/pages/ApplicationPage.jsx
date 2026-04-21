import React, { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  PlusCircle,
  Trash2,
  CheckCircle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useApplication } from "@/contexts/ApplicationContext";
import BackToHomeButton from "../components/BackHomePage";
import { getActiveApplicationFields } from "@/api/applicationApi";

const SECTIONS = [
  { id: "travel", title: "1. Travel Details" },
  { id: "financial", title: "2. Financial Documents" },
  { id: "review", title: "3. Review" },
];

const createTraveler = (id) => ({
  id,
  fullName: "",
  dateOfBirth: "",
  passportFrontFile: null,
  passportBackFile: null,
  photoFile: null,
  email: "",
  phone: "",
  maritalStatus: "",
  occupation: "",
  sponsorship: "self",
});
const isLoggedIn = Boolean(localStorage.getItem("authToken"));

const fileInfo = (file) =>
  file
    ? { name: file.name, type: file.type, size: file.size, _file: file }
    : null;

const toSerializableFieldValue = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) =>
      item && typeof item === "object" && item.name
        ? { name: item.name, type: item.type || "", size: item.size || 0 }
        : item
    );
  }

  if (value && typeof value === "object" && value.name) {
    return { name: value.name, type: value.type || "", size: value.size || 0 };
  }

  return value;
};

const hasDynamicValue = (field, value) => {
  if (field.fieldType === "file") {
    if (field.multiple) {
      return Array.isArray(value) && value.length > 0;
    }
    return Boolean(value && value.name);
  }

  if (typeof value === "number") return true;
  return String(value || "").trim().length > 0;
};

const formatText = (value) => {
  if (!value) return "-";
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const buildFinancialDocuments = (traveler) => {
  const baseKey = `traveler_${traveler.id}`;

  switch (traveler.occupation) {
    case "employed":
      return [
        {
          key: `${baseKey}_salary_slip`,
          name: "Salary Slips",
          description: "Last 3 months",
        },
        {
          key: `${baseKey}_leave_letter`,
          name: "Leave Approval Letter",
          description: "From employer",
        },
      ];
    case "self-employed":
      return [
        {
          key: `${baseKey}_gst_proof`,
          name: "GST / Business Registration",
          description: "Proof of business",
        },
        {
          key: `${baseKey}_business_bank_statement`,
          name: "Business Bank Statement",
          description: "Last 6 months",
        },
      ];
    case "freelancer":
      return [
        {
          key: `${baseKey}_contract`,
          name: "Contract / Work Agreement",
          description: "Proof of freelance work",
        },
        {
          key: `${baseKey}_personal_bank_statement`,
          name: "Personal Bank Statement",
          description: "Last 6 months",
        },
      ];
    case "student":
    case "retired":
    case "unemployed":
      if (traveler.sponsorship === "sponsored") {
        return [
          {
            key: `${baseKey}_sponsor_letter`,
            name: "Sponsorship Letter",
            description: "From sponsor",
          },
          {
            key: `${baseKey}_sponsor_id`,
            name: "Sponsor's ID Proof",
            description: "Passport or valid ID",
          },
          {
            key: `${baseKey}_sponsor_financials`,
            name: "Sponsor's Financials",
            description: "Bank statement / IT return",
          },
        ];
      }
      return [
        {
          key: `${baseKey}_funds_proof`,
          name: "Proof of Funds",
          description: "Bank statement",
        },
      ];
    default:
      return [
        {
          key: `${baseKey}_financial_doc`,
          name: "Financial Document",
          description: "Bank statement or equivalent",
        },
      ];
  }
};

function ApplicationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { startApplication, updateCurrentApplication, currentApplication } =
    useApplication();

  const applicationState = useMemo(
    () => location.state || {},
    [location.state]
  );
  const destination = applicationState.destination || "Visa";
  const hasPricingInfo = !!applicationState.visaDetails;

  const [activeSection, setActiveSection] = useState("travel");
  const [travelDates, setTravelDates] = useState({ from: "", to: "" });
  const [travelers, setTravelers] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [dynamicFieldDefinitions, setDynamicFieldDefinitions] = useState([]);
  const [dynamicApplicationValues, setDynamicApplicationValues] = useState({});
  const [dynamicTravelerValues, setDynamicTravelerValues] = useState({});
  const didInitialize = useRef(false);

  useEffect(() => {
    if (didInitialize.current) return;
    didInitialize.current = true;

    if (currentApplication?.travelers?.length) {
      setTravelers(currentApplication.travelers);
      setTravelDates({
        from: currentApplication.travelDates?.from || "",
        to: currentApplication.travelDates?.to || "",
      });
      setUploadedFiles(currentApplication.financialDocuments || {});
      setDynamicApplicationValues(
        currentApplication.dynamicFields?.application || {}
      );
      setDynamicTravelerValues(
        currentApplication.dynamicFields?.travelers || {}
      );
      return;
    }

    const travelerCount = Math.max(
      parseInt(applicationState.travelers, 10) || 1,
      1
    );
    const initialTravelers = Array.from({ length: travelerCount }, (_, index) =>
      createTraveler(Date.now() + index)
    );
    setTravelers(initialTravelers);
    startApplication({
      ...applicationState,
      travelers: initialTravelers,
      travelDates: { from: "", to: "" },
      dynamicFields: { application: {}, travelers: {} },
    });
  }, [applicationState, currentApplication, startApplication]);

  useEffect(() => {
    const loadDynamicFields = async () => {
      try {
        const fields = await getActiveApplicationFields();
        setDynamicFieldDefinitions(fields || []);
      } catch (error) {
        console.error("Failed to load dynamic form fields", error);
      }
    };

    loadDynamicFields();
  }, []);

  const documentLists = useMemo(
    () =>
      travelers.map((traveler) => ({
        travelerId: traveler.id,
        documents: buildFinancialDocuments(traveler),
      })),
    [travelers]
  );

  const applicationTravelFields = useMemo(
    () =>
      dynamicFieldDefinitions.filter(
        (field) => field.section === "travel" && field.target === "application"
      ),
    [dynamicFieldDefinitions]
  );

  const travelerTravelFields = useMemo(
    () =>
      dynamicFieldDefinitions.filter(
        (field) => field.section === "travel" && field.target === "traveler"
      ),
    [dynamicFieldDefinitions]
  );

  const applicationFinancialFields = useMemo(
    () =>
      dynamicFieldDefinitions.filter(
        (field) =>
          field.section === "financial" && field.target === "application"
      ),
    [dynamicFieldDefinitions]
  );

  const travelerFinancialFields = useMemo(
    () =>
      dynamicFieldDefinitions.filter(
        (field) => field.section === "financial" && field.target === "traveler"
      ),
    [dynamicFieldDefinitions]
  );

  const updateApplicationDynamicField = (fieldKey, value) => {
    setDynamicApplicationValues((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  const updateTravelerDynamicField = (travelerId, fieldKey, value) => {
    setDynamicTravelerValues((prev) => ({
      ...prev,
      [travelerId]: {
        ...(prev[travelerId] || {}),
        [fieldKey]: value,
      },
    }));
  };

  const completedRequired = useMemo(() => {
    let completed = 0;
    if (travelDates.from && travelDates.to) completed += 1;

    travelers.forEach((traveler) => {
      if (traveler.fullName) completed += 1;
      if (traveler.dateOfBirth) completed += 1;
      if (traveler.passportFrontFile) completed += 1;
      if (traveler.passportBackFile) completed += 1;
      if (traveler.photoFile) completed += 1;
      if (traveler.email) completed += 1;
      if (traveler.phone) completed += 1;
      if (traveler.maritalStatus) completed += 1;
      if (traveler.occupation) completed += 1;
      if (traveler.sponsorship) completed += 1;
    });

    documentLists.forEach((list) => {
      list.documents.forEach((doc) => {
        if (uploadedFiles[doc.key]) completed += 1;
      });
    });

    applicationTravelFields.forEach((field) => {
      if (hasDynamicValue(field, dynamicApplicationValues[field.key]))
        completed += 1;
    });
    applicationFinancialFields.forEach((field) => {
      if (hasDynamicValue(field, dynamicApplicationValues[field.key]))
        completed += 1;
    });

    travelers.forEach((traveler) => {
      travelerTravelFields.forEach((field) => {
        if (
          hasDynamicValue(
            field,
            dynamicTravelerValues[traveler.id]?.[field.key]
          )
        )
          completed += 1;
      });
      travelerFinancialFields.forEach((field) => {
        if (
          hasDynamicValue(
            field,
            dynamicTravelerValues[traveler.id]?.[field.key]
          )
        )
          completed += 1;
      });
    });

    return completed;
  }, [
    travelDates,
    travelers,
    documentLists,
    uploadedFiles,
    applicationTravelFields,
    applicationFinancialFields,
    travelerTravelFields,
    travelerFinancialFields,
    dynamicApplicationValues,
    dynamicTravelerValues,
  ]);

  const totalRequired = useMemo(() => {
    const travelerFields = 1 + travelers.length * 10;
    const docs = documentLists.reduce(
      (sum, list) => sum + list.documents.length,
      0
    );
    const dynamicApplicationCount =
      applicationTravelFields.length + applicationFinancialFields.length;
    const dynamicTravelerCount =
      travelers.length *
      (travelerTravelFields.length + travelerFinancialFields.length);
    return (
      travelerFields + docs + dynamicApplicationCount + dynamicTravelerCount
    );
  }, [
    travelers,
    documentLists,
    applicationTravelFields,
    applicationFinancialFields,
    travelerTravelFields,
    travelerFinancialFields,
  ]);

  const progress =
    totalRequired === 0
      ? 0
      : Math.round((completedRequired / totalRequired) * 100);

  const updateTraveler = (id, field, value) => {
    setTravelers((prev) =>
      prev.map((traveler) =>
        traveler.id === id ? { ...traveler, [field]: value } : traveler
      )
    );
  };

  const addTraveler = () => {
    setTravelers((prev) => [...prev, createTraveler(Date.now())]);
  };

  const removeTraveler = (id) => {
    if (travelers.length <= 1) {
      toast({
        title: "At least one traveler is required.",
        variant: "destructive",
      });
      return;
    }

    setTravelers((prev) => prev.filter((traveler) => traveler.id !== id));
    setUploadedFiles((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (key.startsWith(`traveler_${id}_`)) delete next[key];
      });
      return next;
    });

    setDynamicTravelerValues((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const validateTravel = () => {
    if (!travelDates.from || !travelDates.to) {
      toast({ title: "Please select travel dates.", variant: "destructive" });
      return false;
    }

    for (const [index, traveler] of travelers.entries()) {
      if (
        !traveler.passportFrontFile ||
        !traveler.passportBackFile ||
        !traveler.photoFile
      ) {
        toast({
          title: `Upload all passport/photo files for Traveler ${index + 1}.`,
          variant: "destructive",
        });
        return false;
      }
      if (
        !traveler.fullName ||
        !traveler.dateOfBirth ||
        !traveler.email ||
        !traveler.phone ||
        !traveler.maritalStatus ||
        !traveler.occupation
      ) {
        toast({
          title: `Complete all details for Traveler ${index + 1}.`,
          variant: "destructive",
        });
        return false;
      }

      for (const field of travelerTravelFields) {
        if (
          field.required &&
          !hasDynamicValue(
            field,
            dynamicTravelerValues[traveler.id]?.[field.key]
          )
        ) {
          toast({
            title: `Complete required field \"${field.label}\" for Traveler ${index + 1}.`,
            variant: "destructive",
          });
          return false;
        }
      }
    }

    for (const field of applicationTravelFields) {
      if (
        field.required &&
        !hasDynamicValue(field, dynamicApplicationValues[field.key])
      ) {
        toast({
          title: `Complete required field \"${field.label}\".`,
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const validateFinancial = () => {
    for (const list of documentLists) {
      for (const doc of list.documents) {
        if (!uploadedFiles[doc.key]) {
          const travelerIndex = travelers.findIndex(
            (traveler) => traveler.id === list.travelerId
          );
          toast({
            title: `Upload "${doc.name}" for Traveler ${travelerIndex + 1}.`,
            variant: "destructive",
          });
          return false;
        }
      }
    }

    for (const field of applicationFinancialFields) {
      if (
        field.required &&
        !hasDynamicValue(field, dynamicApplicationValues[field.key])
      ) {
        toast({
          title: `Upload or fill required field \"${field.label}\".`,
          variant: "destructive",
        });
        return false;
      }
    }

    for (const [index, traveler] of travelers.entries()) {
      for (const field of travelerFinancialFields) {
        if (
          field.required &&
          !hasDynamicValue(
            field,
            dynamicTravelerValues[traveler.id]?.[field.key]
          )
        ) {
          toast({
            title: `Upload or fill \"${field.label}\" for Traveler ${index + 1}.`,
            variant: "destructive",
          });
          return false;
        }
      }
    }

    return true;
  };

  const goToSection = (sectionId) => {
    if (sectionId === "travel") {
      setActiveSection("travel");
      return;
    }

    if (sectionId === "financial") {
      if (!validateTravel()) return;
      updateCurrentApplication({ travelers, travelDates });
      setActiveSection("financial");
      return;
    }

    if (!validateTravel()) {
      setActiveSection("travel");
      return;
    }
    if (!validateFinancial()) {
      setActiveSection("financial");
      return;
    }

    updateCurrentApplication({
      travelers,
      travelDates,
      financialDocuments: uploadedFiles,
    });
    setActiveSection("review");
  };

  const submitApplication = (event) => {
    event.preventDefault();

    if (!validateTravel()) {
      setActiveSection("travel");
      return;
    }
    if (!validateFinancial()) {
      setActiveSection("financial");
      return;
    }

    updateCurrentApplication({
      travelers,
      travelDates,
      financialDocuments: uploadedFiles,
    });
    navigate("/payment", {
      state: {
        ...(currentApplication || {}),
        ...applicationState,
        travelers,
        travelDates,
        financialDocuments: uploadedFiles,
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>Apply for {destination} - Stamp2Fly</title>
        <meta
          name="description"
          content="Complete your application in three simple sections."
        />
      </Helmet>

      <Header />
      {isLoggedIn ? (
        <main className="bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50 min-h-screen">
          <section className="py-14">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <Button
                onClick={() =>
                  hasPricingInfo
                    ? navigate("/pricing", { state: applicationState })
                    : navigate("/")
                }
                variant="outline"
                className="mb-8 bg-white"
              >
                {hasPricingInfo ? (
                  <ArrowLeft className="w-4 h-4 mr-2" />
                ) : (
                  <Home className="w-4 h-4 mr-2" />
                )}
                {hasPricingInfo ? "Back to Pricing" : "Back to Home"}
              </Button>

              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10">
                <h1 className="text-3xl font-bold text-gray-900 text-center">
                  Apply for {destination} Visa
                </h1>
                <p className="text-gray-600 text-center mt-2">
                  One page, three sections, easy to complete.
                </p>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Completion</span>
                    <span className="font-semibold">{progress}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-gray-200">
                    <div
                      className="h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                  {SECTIONS.map((section) => (
                    <Button
                      key={section.id}
                      type="button"
                      variant="outline"
                      className={`justify-start text-left h-auto py-3 ${activeSection === section.id ? "border-emerald-500 bg-emerald-50" : ""}`}
                      onClick={() => goToSection(section.id)}
                    >
                      {section.title}
                    </Button>
                  ))}
                </div>

                <form className="mt-8 space-y-8" onSubmit={submitApplication}>
                  {activeSection === "travel" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-semibold text-gray-900">
                        Travel Details
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="travel-from">Travel From</Label>
                          <Input
                            id="travel-from"
                            type="date"
                            value={travelDates.from}
                            onChange={(event) =>
                              setTravelDates((prev) => ({
                                ...prev,
                                from: event.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="travel-to">Travel To</Label>
                          <Input
                            id="travel-to"
                            type="date"
                            value={travelDates.to}
                            onChange={(event) =>
                              setTravelDates((prev) => ({
                                ...prev,
                                to: event.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>

                      {travelers.map((traveler, index) => (
                        <div
                          key={traveler.id}
                          className="rounded-2xl border border-gray-200 p-5 bg-gray-50/70 space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">
                              Traveler {index + 1}
                            </h3>
                            {travelers.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeTraveler(traveler.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label>Passport Front</Label>
                              <Input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(event) =>
                                  updateTraveler(
                                    traveler.id,
                                    "passportFrontFile",
                                    fileInfo(event.target.files?.[0])
                                  )
                                }
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                {traveler.passportFrontFile?.name ||
                                  "Not uploaded"}
                              </p>
                            </div>
                            <div>
                              <Label>Passport Back</Label>
                              <Input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(event) =>
                                  updateTraveler(
                                    traveler.id,
                                    "passportBackFile",
                                    fileInfo(event.target.files?.[0])
                                  )
                                }
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                {traveler.passportBackFile?.name ||
                                  "Not uploaded"}
                              </p>
                            </div>
                            <div>
                              <Label>Photo</Label>
                              <Input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                onChange={(event) =>
                                  updateTraveler(
                                    traveler.id,
                                    "photoFile",
                                    fileInfo(event.target.files?.[0])
                                  )
                                }
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                {traveler.photoFile?.name || "Not uploaded"}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Full Name</Label>
                              <Input
                                value={traveler.fullName}
                                onChange={(event) =>
                                  updateTraveler(
                                    traveler.id,
                                    "fullName",
                                    event.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label>Date of Birth</Label>
                              <Input
                                type="date"
                                value={traveler.dateOfBirth}
                                onChange={(event) =>
                                  updateTraveler(
                                    traveler.id,
                                    "dateOfBirth",
                                    event.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label>Email</Label>
                              <Input
                                type="email"
                                value={traveler.email}
                                onChange={(event) =>
                                  updateTraveler(
                                    traveler.id,
                                    "email",
                                    event.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label>Phone</Label>
                              <Input
                                type="tel"
                                value={traveler.phone}
                                onChange={(event) =>
                                  updateTraveler(
                                    traveler.id,
                                    "phone",
                                    event.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label>Marital Status</Label>
                              <Select
                                value={traveler.maritalStatus}
                                onValueChange={(value) =>
                                  updateTraveler(
                                    traveler.id,
                                    "maritalStatus",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <SelectItem value="single">Single</SelectItem>
                                  <SelectItem value="married">
                                    Married
                                  </SelectItem>
                                  <SelectItem value="divorced">
                                    Divorced
                                  </SelectItem>
                                  <SelectItem value="widowed">
                                    Widowed
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Occupation</Label>
                              <Select
                                value={traveler.occupation}
                                onValueChange={(value) =>
                                  updateTraveler(
                                    traveler.id,
                                    "occupation",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select occupation" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <SelectItem value="employed">
                                    Employed
                                  </SelectItem>
                                  <SelectItem value="self-employed">
                                    Self-Employed
                                  </SelectItem>
                                  <SelectItem value="freelancer">
                                    Freelancer
                                  </SelectItem>
                                  <SelectItem value="student">
                                    Student
                                  </SelectItem>
                                  <SelectItem value="retired">
                                    Retired
                                  </SelectItem>
                                  <SelectItem value="unemployed">
                                    Unemployed/Homemaker
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="md:col-span-2">
                              <Label>Sponsorship</Label>
                              <Select
                                value={traveler.sponsorship}
                                onValueChange={(value) =>
                                  updateTraveler(
                                    traveler.id,
                                    "sponsorship",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <SelectItem value="self">
                                    Self-Sponsored
                                  </SelectItem>
                                  <SelectItem value="sponsored">
                                    Sponsored by someone
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {travelerTravelFields.length > 0 && (
                              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 mt-4 border-t border-dashed border-gray-300">
                                {travelerTravelFields.map((field) => (
                                  <div key={field.key} className="space-y-2">
                                    <Label className="flex items-center gap-1 text-emerald-700 font-medium">
                                      {field.label}{" "}
                                      {field.required && (
                                        <span className="text-red-500">*</span>
                                      )}
                                    </Label>

                                    {field.fieldType === "text" && (
                                      <Input
                                        className="bg-white border-emerald-100 focus:border-emerald-500"
                                        placeholder={
                                          field.placeholder ||
                                          `Enter ${field.label}`
                                        }
                                        value={
                                          dynamicTravelerValues[traveler.id]?.[
                                            field.key
                                          ] || ""
                                        }
                                        onChange={(e) =>
                                          updateTravelerDynamicField(
                                            traveler.id,
                                            field.key,
                                            e.target.value
                                          )
                                        }
                                      />
                                    )}

                                    {field.fieldType === "dropdown" && (
                                      <Select
                                        value={
                                          dynamicTravelerValues[traveler.id]?.[
                                            field.key
                                          ] || ""
                                        }
                                        onValueChange={(val) =>
                                          updateTravelerDynamicField(
                                            traveler.id,
                                            field.key,
                                            val
                                          )
                                        }
                                      >
                                        <SelectTrigger className="bg-white border-emerald-100">
                                          <SelectValue
                                            placeholder={
                                              field.placeholder ||
                                              "Select option"
                                            }
                                          />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                          {field.options?.map((opt) => (
                                            <SelectItem key={opt} value={opt}>
                                              {opt}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-dashed border-emerald-600 text-emerald-700"
                        onClick={addTraveler}
                      >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add Another Traveler
                      </Button>

                      <div className="flex justify-end pt-3 border-t">
                        <Button
                          type="button"
                          onClick={() => goToSection("financial")}
                        >
                          Continue to Financial Documents
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {activeSection === "financial" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-semibold text-gray-900">
                        Financial Documents
                      </h2>
                      {documentLists.map((list, index) => (
                        <div
                          key={list.travelerId}
                          className="rounded-2xl border border-gray-200 p-5 bg-gray-50/70 space-y-3"
                        >
                          <h3 className="font-semibold text-gray-900">
                            Traveler {index + 1}
                          </h3>
                          {list.documents.map((doc) => (
                            <div
                              key={doc.key}
                              className="rounded-lg border bg-white p-4"
                            >
                              <p className="font-medium text-gray-900">
                                {doc.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {doc.description}
                              </p>
                              <Input
                                className="mt-2"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(event) =>
                                  setUploadedFiles((prev) => ({
                                    ...prev,
                                    [doc.key]: fileInfo(
                                      event.target.files?.[0]
                                    ),
                                  }))
                                }
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                {uploadedFiles[doc.key]?.name || "Not uploaded"}
                              </p>
                            </div>
                          ))}
                        </div>
                      ))}

                      <div className="flex justify-between gap-3 pt-3 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setActiveSection("travel")}
                        >
                          Back to Travel Details
                        </Button>
                        <Button
                          type="button"
                          onClick={() => goToSection("review")}
                        >
                          Continue to Review
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {activeSection === "review" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-semibold text-gray-900">
                        Review
                      </h2>
                      <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                        <p className="font-medium text-gray-900">
                          Travel Dates
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {travelDates.from && travelDates.to
                            ? `${travelDates.from} to ${travelDates.to}`
                            : "Not selected"}
                        </p>
                      </div>

                      {travelers.map((traveler, index) => {
                        const travelerDocs =
                          documentLists.find(
                            (list) => list.travelerId === traveler.id
                          )?.documents || [];
                        return (
                          <div
                            key={traveler.id}
                            className="rounded-xl border border-gray-200 p-4 bg-gray-50 space-y-3"
                          >
                            <p className="font-semibold text-gray-900">
                              Traveler {index + 1}
                            </p>
                            <p className="text-sm text-gray-700">
                              <span className="font-medium text-gray-900">
                                Full Name:
                              </span>{" "}
                              {traveler.fullName || "-"}
                            </p>
                            <p className="text-sm text-gray-700">
                              <span className="font-medium text-gray-900">
                                Date of Birth:
                              </span>{" "}
                              {traveler.dateOfBirth || "-"}
                            </p>
                            <p className="text-sm text-gray-700">
                              <span className="font-medium text-gray-900">
                                Email:
                              </span>{" "}
                              {traveler.email || "-"}
                            </p>
                            <p className="text-sm text-gray-700">
                              <span className="font-medium text-gray-900">
                                Phone:
                              </span>{" "}
                              {traveler.phone || "-"}
                            </p>
                            <p className="text-sm text-gray-700">
                              <span className="font-medium text-gray-900">
                                Marital Status:
                              </span>{" "}
                              {formatText(traveler.maritalStatus)}
                            </p>
                            <p className="text-sm text-gray-700">
                              <span className="font-medium text-gray-900">
                                Occupation:
                              </span>{" "}
                              {formatText(traveler.occupation)}
                            </p>
                            <p className="text-sm text-gray-700">
                              <span className="font-medium text-gray-900">
                                Sponsorship:
                              </span>{" "}
                              {traveler.sponsorship === "self"
                                ? "Self-Sponsored"
                                : "Sponsored"}
                            </p>
                            <p className="text-sm text-gray-700">
                              <span className="font-medium text-gray-900">
                                Passport Front:
                              </span>{" "}
                              {traveler.passportFrontFile?.name ||
                                "Not uploaded"}
                            </p>
                            <p className="text-sm text-gray-700">
                              <span className="font-medium text-gray-900">
                                Passport Back:
                              </span>{" "}
                              {traveler.passportBackFile?.name ||
                                "Not uploaded"}
                            </p>
                            <p className="text-sm text-gray-700">
                              <span className="font-medium text-gray-900">
                                Photo:
                              </span>{" "}
                              {traveler.photoFile?.name || "Not uploaded"}
                            </p>
                            <div className="pt-1">
                              <p className="text-sm font-medium text-gray-900">
                                Financial Documents
                              </p>
                              {travelerDocs.map((doc) => (
                                <p
                                  key={doc.key}
                                  className="text-sm text-gray-700"
                                >
                                  <span className="font-medium text-gray-900">
                                    {doc.name}:
                                  </span>{" "}
                                  {uploadedFiles[doc.key]?.name ||
                                    "Not uploaded"}
                                </p>
                              ))}
                            </div>
                          </div>
                        );
                      })}

                      <div className="flex justify-between gap-3 pt-3 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setActiveSection("financial")}
                        >
                          Back to Financial Documents
                        </Button>
                        <Button type="submit">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Proceed to Payment
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </section>
          <BackToHomeButton />
        </main>
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <p className="text-lg font-medium text-gray-700 mb-4">
            Please login to continue your application
          </p>

          <Button
            onClick={() => navigate("/login")}
            className="bg-blue-500 text-white hover:bg-blue-600 border border-2"
          >
            Go to Login
          </Button>
        </div>
      )}
      <Footer />
    </>
  );
}

export default ApplicationPage;
