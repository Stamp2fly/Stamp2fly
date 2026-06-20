import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import {
  PlusCircle,
  Trash2,
  Save,
  ListChecks,
  Flag,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useVisa } from "@/contexts/VisaContext";
import { useNavigate } from "react-router-dom";
import { APPLICANT_TYPE_OPTIONS } from "@/constants/applicantTypes.js";
import { createCountryRecord, updateCountryRecord, deleteCountryRecord } from "@/api/adminApi";

const normalizeOption = (option = {}) => ({
  ...option,
  entry: option.entry ?? option.entryType ?? "",
  duration: option.duration ?? option.stay ?? "",
});

const normalizeVisaData = (data = {}) =>
  Object.fromEntries(
    Object.entries(data).map(([countryName, countryData]) => [
      countryName,
      {
        ...countryData,
        options: (countryData?.options || []).map(normalizeOption),
      },
    ]),
  );

const buildDefaultChecklist = () =>
  APPLICANT_TYPE_OPTIONS.reduce(
    (accumulator, option) => ({
      ...accumulator,
      [option.value]: [],
    }),
    { base: [] },
  );

const VisaManagementView = () => {
  const { visaData, updateVisaData, refreshVisaData } = useVisa();
  const [localVisaData, setLocalVisaData] = useState(() =>
    normalizeVisaData(visaData),
  );
  const [selectedCountry, setSelectedCountry] = useState(
    Object.keys(localVisaData)[0] || "",
  );
  const [isAddCountryModalOpen, setIsAddCountryModalOpen] = useState(false);
  const [newCountryName, setNewCountryName] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setLocalVisaData(normalizeVisaData(visaData));
    if (!selectedCountry && Object.keys(visaData).length > 0) {
      setSelectedCountry(Object.keys(visaData)[0]);
    }
  }, [visaData, selectedCountry]);

  const handleSave = async () => {
    if (!selectedCountry) {
      return;
    }

    try {
      const countryData = localVisaData[selectedCountry] || {};

      const payload = {
        countryName: selectedCountry,
        flag: countryData.flag || "",
        isoCode: countryData.isoCode || "",
        officialURL: countryData.source || "",
        showOnHomepage: Boolean(countryData.isRecent),
        visaOptions: (countryData.options || []).map((option, index) => ({
          id: option.id || index + 1,
          name: option.name || "Visa Option",
          visaType: option.name || "Visa Option",
          entry: option.entry || "",
          entryType: option.entry || "",
          stayDuration: option.duration || "",
          duration: option.duration || "",
          validity: option.validity || "",
          processingTime: option.processingTime || "",
          price: Number(option.price) || 0,
          originalPrice: option.originalPrice,
          alertMessage: option.alertMessage || "",
          pricingNote: option.alertMessage || "",
          isCombo: Boolean(option.combo),
          combo: Boolean(option.combo),
          fees: option.fees || {},
        })),
      };

      if (countryData._id) {
        await updateCountryRecord(countryData._id, payload);
      } else {
        await createCountryRecord(payload);
      }

      await refreshVisaData();
      toast({
        title: "Visa Info Saved!",
        description: `Changes for ${selectedCountry} are now live on the site.`,
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: error?.response?.data?.message || "Could not save country details.",
        variant: "destructive",
      });
    }
  };

  const handleCountryFieldChange = (field, value) => {
    if (!selectedCountry) return;
    setLocalVisaData((prev) => ({
      ...prev,
      [selectedCountry]: { ...prev[selectedCountry], [field]: value },
    }));
  };

  const handleOptionChange = (index, field, value) => {
    const options = [...(localVisaData[selectedCountry]?.options || [])];
    options[index][field] = value;
    handleCountryFieldChange("options", options);
  };

  const handleAddOption = () => {
    if (!selectedCountry) return;
    const currentOptions = localVisaData[selectedCountry]?.options || [];
    handleCountryFieldChange("options", [
      ...currentOptions,
      {
        id: Date.now(),
        name: "New Visa Type",
        entry: "Single",
        duration: "",
        validity: "",
        processingTime: "",
        price: 0,
        currency: "INR",
        alertMessage: "",
        fees: {
          absconding: "",
        },
      },
    ]);
  };

  const handleOptionFeesChange = (index, feeField, value) => {
    const options = [...(localVisaData[selectedCountry]?.options || [])];
    options[index] = {
      ...options[index],
      fees: {
        ...(options[index]?.fees || {}),
        [feeField]: value,
      },
    };
    handleCountryFieldChange("options", options);
  };

  const handleRemoveOption = (index) => {
    const currentOptions = localVisaData[selectedCountry]?.options || [];
    handleCountryFieldChange(
      "options",
      currentOptions.filter((_, i) => i !== index),
    );
  };

  const handleAddCountry = async () => {
    if (!newCountryName.trim()) {
      toast({
        title: "Error",
        description: "Country name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    try {
      const trimmedName = newCountryName.trim();
      await createCountryRecord({
        countryName: trimmedName,
        flag: "",
        isoCode: "",
        officialURL: "",
        showOnHomepage: false,
        visaOptions: [],
      });

      await refreshVisaData();
      setSelectedCountry(trimmedName);
      setNewCountryName("");
      setIsAddCountryModalOpen(false);
      toast({
        title: "Country Added!",
        description: `${trimmedName} has been added and published.`,
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        title: "Failed to add country",
        description: error?.response?.data?.message || "Could not create country.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCountry = async () => {
    if (!selectedCountry) return;
    const countryData = localVisaData[selectedCountry] || {};

    if (!countryData._id) {
      toast({
        title: "Cannot delete",
        description: "This country hasn't been saved to the server yet.",
        variant: "destructive",
      });
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedCountry}? This cannot be undone.`,
    );
    if (!confirmDelete) return;

    try {
      await deleteCountryRecord(countryData._id);
      await refreshVisaData();
      setSelectedCountry("");
      toast({
        title: "Country deleted",
        description: `${selectedCountry} has been removed.`,
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error?.response?.data?.message || "Could not delete country.",
        variant: "destructive",
      });
    }
  };

  const currentData = localVisaData[selectedCountry] || {
    options: [],
    checklist: {},
    faq: [],
    flag: "",
    source: "",
    isRecent: false,
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Visa Management</h1>
          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700" disabled={!selectedCountry}>
            <Save className="mr-2 h-4 w-4" /> Save & Publish Changes
          </Button>
        </div> */}
        <div className="flex items-center justify-between border-b pb-5">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Visa Management
            </h1>
            <p className="text-sm text-slate-500">
              Manage visa information, pricing, and requirements for each
              country
            </p>
          </div>

          <Button
            onClick={handleSave}
            className="bg-slate-800 hover:bg-slate-900 text-white"
            disabled={!selectedCountry}
          >
            <Save className="mr-2 h-4 w-4" />
            Save & Publish
          </Button>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-6 mb-6">
            <div className="flex-grow max-w-sm">
              <Label htmlFor="country-select" className="font-semibold">
                Select Country to Manage
              </Label>
              <Select
                value={selectedCountry}
                onValueChange={setSelectedCountry}
                disabled={Object.keys(localVisaData).length === 0}
              >
                <SelectTrigger id="country-select">
                  <SelectValue placeholder="Select a country..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(localVisaData).map((country) => (
                    <SelectItem key={country} value={country}>
                      {localVisaData[country].flag} {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAddCountryModalOpen(true)}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Country
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/admin/checklists")}
                disabled={!selectedCountry}
              >
                <ListChecks className="mr-2 h-4 w-4" /> Manage Checklist
              </Button>
              <Button
                variant="outline"
                onClick={handleDeleteCountry}
                disabled={!selectedCountry || !localVisaData[selectedCountry]?._id}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Country
              </Button>
            </div>
          </div>

          {selectedCountry ? (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  General Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 border rounded-lg bg-slate-50">
                  <div>
                    <Label htmlFor="flag">Flag Emoji</Label>
                    <div className="relative">
                      <Flag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="flag"
                        value={currentData.flag || ""}
                        onChange={(e) =>
                          handleCountryFieldChange("flag", e.target.value)
                        }
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="source">Official Source URL</Label>
                    <Input
                      id="source"
                      value={currentData.source || ""}
                      onChange={(e) =>
                        handleCountryFieldChange("source", e.target.value)
                      }
                      placeholder="https://government-visa-website.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="isoCode">ISO Country Code</Label>
                    <Input
                      id="isoCode"
                      value={currentData.isoCode || ""}
                      onChange={(e) =>
                        handleCountryFieldChange("isoCode", e.target.value.toLowerCase())
                      }
                      placeholder="e.g., ae, sg, us"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center space-x-3 border-t pt-4">
                    <Checkbox
                      id="isRecent"
                      checked={Boolean(currentData.isRecent)}
                      onCheckedChange={(checked) =>
                        handleCountryFieldChange("isRecent", Boolean(checked))
                      }
                    />
                    <Label htmlFor="isRecent" className="cursor-pointer">
                      Show this country in homepage Recent Countries carousel
                    </Label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Visa Categories & Pricing
                </h3>
                <div className="space-y-4">
                  {currentData.options &&
                    currentData.options.map((option, index) => (
                      <div
                        key={option.id}
                        className="p-5 border rounded-lg space-y-4 relative bg-slate-50 hover:bg-slate-100 transition"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-3 right-3 hover:bg-red-50"
                          onClick={() => handleRemoveOption(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Visa Type Name</Label>
                            <Input
                              value={option.name}
                              onChange={(e) =>
                                handleOptionChange(
                                  index,
                                  "name",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>Entry Type</Label>
                            <Input
                              value={option.entry || ""}
                              onChange={(e) =>
                                handleOptionChange(
                                  index,
                                  "entry",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g., Single, Multiple"
                            />
                          </div>
                          <div>
                            <Label>Price (INR)</Label>
                            <Input
                              type="number"
                              value={option.price}
                              onChange={(e) =>
                                handleOptionChange(
                                  index,
                                  "price",
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>Stay Duration</Label>
                            <Input
                              value={option.duration || ""}
                              onChange={(e) =>
                                handleOptionChange(
                                  index,
                                  "duration",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g., 30 days"
                            />
                          </div>
                          <div>
                            <Label>Visa Validity</Label>
                            <Input
                              value={option.validity}
                              onChange={(e) =>
                                handleOptionChange(
                                  index,
                                  "validity",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g., 60 days"
                            />
                          </div>
                          <div>
                            <Label>Processing Time</Label>
                            <Input
                              value={option.processingTime || ""}
                              onChange={(e) =>
                                handleOptionChange(
                                  index,
                                  "processingTime",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g., 5 Working Days"
                            />
                          </div>
                          <div>
                            <Label>Original Price (Optional)</Label>
                            <Input
                              type="number"
                              value={option.originalPrice || ""}
                              onChange={(e) =>
                                handleOptionChange(
                                  index,
                                  "originalPrice",
                                  e.target.value ? parseFloat(e.target.value) : undefined,
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>Absconding Fee (Optional)</Label>
                            <Input
                              value={option.fees?.absconding || ""}
                              onChange={(e) =>
                                handleOptionFeesChange(index, "absconding", e.target.value)
                              }
                              placeholder="e.g., AED 5,000"
                            />
                          </div>
                          <div className="md:col-span-3 space-y-2">
                            <Label>Pricing Alert Message (Optional)</Label>
                            <Input
                              value={option.alertMessage || ""}
                              onChange={(e) =>
                                handleOptionChange(
                                  index,
                                  "alertMessage",
                                  e.target.value,
                                )
                              }
                              placeholder="Shown on Pricing page above this option"
                            />
                            <div className="flex items-center space-x-2 pt-1">
                              <Checkbox
                                id={`combo-${option.id}`}
                                checked={Boolean(option.combo)}
                                onCheckedChange={(checked) =>
                                  handleOptionChange(index, "combo", Boolean(checked))
                                }
                              />
                              <Label htmlFor={`combo-${option.id}`}>Mark as Combo Offer</Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  <Button
                    variant="outline"
                    onClick={handleAddOption}
                    className="w-full border-dashed border-2 hover:bg-slate-50"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Visa Category
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 border rounded-lg">
              <p className="text-gray-500 text-lg">No countries to display.</p>
              <p className="text-gray-400 mt-2">
                Click "Add Country" to get started.
              </p>
            </div>
          )}
        </div>
      </motion.div>

      <Dialog
        open={isAddCountryModalOpen}
        onOpenChange={setIsAddCountryModalOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add a New Country</DialogTitle>
            <DialogDescription>
              Enter the name of the new country you want to add for visa
              processing.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="new-country-name">Country Name</Label>
            <Input
              id="new-country-name"
              value={newCountryName}
              onChange={(e) => setNewCountryName(e.target.value)}
              placeholder="e.g., Japan"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddCountryModalOpen(false)}
            >
              Cancel
            </Button>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white" onClick={handleAddCountry}>
              Add Country
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VisaManagementView;
