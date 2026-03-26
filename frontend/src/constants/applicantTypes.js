export const APPLICANT_TYPE_OPTIONS = [
  { value: "employed", label: "Employed" },
  { value: "student", label: "Student" },
  { value: "self-employed", label: "Self-employed" },
  { value: "freelancer", label: "Freelancer" },
  { value: "retired", label: "Retired" },
  { value: "unemployed", label: "Unemployed" },
];

export const APPLICANT_TYPE_LABELS = APPLICANT_TYPE_OPTIONS.reduce(
  (accumulator, option) => ({
    ...accumulator,
    [option.value]: option.label,
  }),
  {},
);
