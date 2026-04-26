import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createApplicationField,
  deleteApplicationField,
  getCountries,
  getApplicationFieldsAdmin,
  updateApplicationField,
} from "@/api/adminApi";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, PlusCircle, Trash2, X } from "lucide-react";

const FIELD_TYPES = [
  "text",
  "textarea",
  "number",
  "date",
  "select",
  "file",
  "email",
  "tel",
];
const SECTIONS = ["travel", "financial"];
const TARGETS = ["application", "traveler"];

const defaultForm = {
  key: "",
  label: "",
  section: "travel",
  target: "application",
  fieldType: "text",
  required: false,
  placeholder: "",
  optionsInput: "",
  accept: ".pdf,.jpg,.jpeg,.png",
  multiple: false,
  order: 0,
  isActive: true,
  isGlobal: true,
  country: "",
  dependsOnFieldId: "",
  dependsOnValue: "",
};

function FormFieldsView() {
  const { toast } = useToast();
  const [fields, setFields] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);

  const countriesById = useMemo(() => {
    return new Map((countries || []).map((country) => [String(country._id), country]));
  }, [countries]);

  const loadFields = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getApplicationFieldsAdmin();
      setFields(data || []);
    } catch (error) {
      toast({
        title: "Failed to load form fields",
        description: error?.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadFields();
  }, [loadFields]);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await getCountries();
        setCountries(Array.isArray(data) ? data : []);
      } catch (error) {
        toast({
          title: "Failed to load countries",
          description: error?.response?.data?.message || "Please try again.",
          variant: "destructive",
        });
      }
    };

    loadCountries();
  }, [toast]);

  const grouped = useMemo(() => {
    return fields.reduce((acc, field) => {
      const key = `${field.section}:${field.target}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(field);
      return acc;
    }, {});
  }, [fields]);

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId(null);
  };

  const startEdit = (field) => {
    const firstDependency = Array.isArray(field.dependsOn)
      ? field.dependsOn[0]
      : null;

    setEditingId(field._id);
    setForm({
      key: field.key || "",
      label: field.label || "",
      section: field.section || "travel",
      target: field.target || "application",
      fieldType: field.fieldType || "text",
      required: Boolean(field.required),
      placeholder: field.placeholder || "",
      //   helpText: field.helpText || "",
      optionsInput: (field.options || []).join(", "),
      accept: field.accept || ".pdf,.jpg,.jpeg,.png",
      multiple: Boolean(field.multiple),
      order: Number(field.order || 0),
      isActive: field.isActive !== false,
      isGlobal: !field.country,
      country: field.country ? String(field.country) : "",
      dependsOnFieldId: firstDependency?.fieldId
        ? String(firstDependency.fieldId)
        : "",
      dependsOnValue:
        firstDependency?.value !== undefined && firstDependency?.value !== null
          ? String(firstDependency.value)
          : "",
    });
  };

  const submit = async (event) => {
    event.preventDefault();

    const dependsOnFieldId = String(form.dependsOnFieldId || "").trim();
    const dependsOnValue = String(form.dependsOnValue || "").trim();

    if ((dependsOnFieldId && !dependsOnValue) || (!dependsOnFieldId && dependsOnValue)) {
      toast({
        title: "Complete follow-up logic",
        description: "Select a parent question and enter the expected value, or leave both empty.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      key: form.key,
      label: form.label,
      section: form.section,
      target: form.target,
      fieldType: form.fieldType,
      required: form.required,
      placeholder: form.placeholder,
      helpText: form.helpText,
      options: form.optionsInput
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      accept: form.accept,
      multiple: form.multiple,
      order: Number(form.order || 0),
      isActive: form.isActive,
      isGlobal: form.isGlobal,
      country: form.isGlobal ? undefined : form.country,
      dependsOn:
        dependsOnFieldId && dependsOnValue
          ? [
              {
                fieldId: dependsOnFieldId,
                value: dependsOnValue,
              },
            ]
          : [],
    };

    try {
      if (editingId) {
        await updateApplicationField(editingId, payload);
        toast({ title: "Field updated" });
      } else {
        await createApplicationField(payload);
        toast({ title: "Field created" });
      }

      resetForm();
      await loadFields();
    } catch (error) {
      toast({
        title: "Failed to save field",
        description: error?.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeField = async (id) => {
    try {
      await deleteApplicationField(id);
      toast({ title: "Field deleted" });
      await loadFields();
    } catch (error) {
      toast({
        title: "Failed to delete field",
        description: error?.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-gray-800">Form Engine Fields</h1>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <form
          onSubmit={submit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div>
            <Label>Key</Label>
            <Input
              value={form.key}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, key: event.target.value }))
              }
              placeholder="fathers_name"
              required
            />
          </div>
          <div>
            <Label>Label</Label>
            <Input
              value={form.label}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, label: event.target.value }))
              }
              placeholder="Father's Name"
              required
            />
          </div>
          <div>
            <Label>Order</Label>
            <Input
              type="number"
              value={form.order}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  order: Number(event.target.value),
                }))
              }
            />
          </div>

          <div>
            <Label>Section</Label>
            <Select
              value={form.section}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, section: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {SECTIONS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isGlobal}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isGlobal: e.target.checked }))
                }
              />
              Global Field
            </label>
          </div>

          {!form.isGlobal && (
            <div>
              <Label>Country ID</Label>
              <Input
                value={form.country}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, country: e.target.value }))
                }
                placeholder="Paste country ObjectId"
              />
            </div>
          )} */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isGlobal}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  isGlobal: e.target.checked,
                  country: "", // reset when switching
                }))
              }
            />
            Global Field
          </label>
          {!form.isGlobal && (
            <div>
              <Label>Country</Label>

              <Select
                value={form.country}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, country: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>

                <SelectContent className="bg-white">
                  {countries.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.countryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}  

          {/* <div>
            <Label>Target</Label>
            <Select
              value={form.target}
              onValueChange={(value) => setForm((prev) => ({ ...prev, target: value }))}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="bg-white">
                {TARGETS.map((item) => (
                  <SelectItem key={item} value={item}>{item}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          <div>
            <Label>Field Type</Label>
            <Select
              value={form.fieldType}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, fieldType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {FIELD_TYPES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label>Placeholder</Label>
            <Input
              value={form.placeholder}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  placeholder: event.target.value,
                }))
              }
            />
          </div>

          {/* <div>
            <Label>Help Text</Label>
            <Input
              value={form.helpText}
              onChange={(event) => setForm((prev) => ({ ...prev, helpText: event.target.value }))}
            />
          </div> */}

          <div className="md:col-span-2">
            <Label>Options (comma separated, for select)</Label>
            <Input
              value={form.optionsInput}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  optionsInput: event.target.value,
                }))
              }
              placeholder="single, married, divorced"
            />
          </div>

          <div className="md:col-span-3">
            <Label>Follow-up Logic (Optional)</Label>

            <div className="flex gap-2">
              <Select
                value={form.dependsOnFieldId}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, dependsOnFieldId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent question" />
                </SelectTrigger>

                <SelectContent className="bg-white">
                  {fields
                    .filter((f) => f._id !== editingId)
                    .map((f) => (
                      <SelectItem key={f._id} value={f._id}>
                        {f.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Value (e.g. yes)"
                value={form.dependsOnValue}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    dependsOnValue: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div>
            <Label>Accept (for files)</Label>
            <Input
              value={form.accept}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, accept: event.target.value }))
              }
            />
          </div>

          <div className="flex items-center gap-4 md:col-span-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.required}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    required: event.target.checked,
                  }))
                }
              />
              Required
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.multiple}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    multiple: event.target.checked,
                  }))
                }
              />
              Multiple files
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    isActive: event.target.checked,
                  }))
                }
              />
              Active
            </label>
          </div>

          <div className="md:col-span-3 flex gap-2">
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              {editingId ? "Update Field" : "Create Field"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                <X className="w-4 h-4 mr-2" />
                Cancel Edit
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Configured Fields
        </h2>
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : fields.length === 0 ? (
          <p className="text-sm text-gray-500">
            No form fields configured yet.
          </p>
        ) : (
          Object.keys(grouped)
            .sort()
            .map((groupKey) => (
              <div key={groupKey} className="space-y-2">
                <p className="text-sm font-semibold text-gray-600 uppercase">
                  {groupKey}
                </p>
                {grouped[groupKey].map((field) => (
                  <div
                    key={field._id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {field.label} ({field.key})
                      </p>
                      <p className="text-xs text-gray-500">
                        {field.fieldType}{" "}
                        {field.required ? "• required" : "• optional"}
                        {field.isActive ? " • active" : " • inactive"}
                        {field.country
                          ? ` • ${countriesById.get(String(field.country))?.countryName || "Unknown country"}`
                          : " • global"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(field)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeField(field._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ))
        )}
      </div>
    </motion.div>
  );
}

export default FormFieldsView;
