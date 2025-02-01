import { z } from "zod";

// Constants for maximum deduction limits
const MAX_80C_LIMIT = 150000; // 1.5 Lakh
const MAX_80D_LIMIT = 100000; // 1 Lakh
const MAX_80CCD1B_LIMIT = 50000; // 50K
export const DEFAULT_EPF = 21600; // Default EPF amount

export const SalaryTypeEnum = z.enum(["GROSS", "CTC"]);
export type SalaryType = z.infer<typeof SalaryTypeEnum>;

export const taxInputSchema = z.object({
  salaryType: SalaryTypeEnum.default("GROSS"),
  ctc: z.number().optional(),
  epf: z.number().optional(),
  grossIncome: z
    .number()
    .positive("Gross income must be greater than 0")
    .min(1, "Gross income cannot be zero"),
  
  hraReceived: z
    .number()
    .min(0, "HRA received cannot be negative")
    .refine((val) => val >= 0, {
      message: "HRA received must be greater than or equal to 0",
    }),
  
  rentPaid: z
    .number()
    .min(0, "Rent paid cannot be negative")
    .refine((val) => val >= 0, {
      message: "Rent paid must be greater than or equal to 0",
    }),
  
  deduction80C: z
    .number()
    .min(0, "Deduction under 80C cannot be negative")
    .max(MAX_80C_LIMIT, `Deduction under 80C cannot exceed ₹${MAX_80C_LIMIT.toLocaleString()}`),
  
  deduction80CCD1B: z
    .number()
    .min(0, "Deduction under 80CCD(1B) cannot be negative")
    .max(MAX_80CCD1B_LIMIT, `Deduction under 80CCD(1B) cannot exceed ₹${MAX_80CCD1B_LIMIT.toLocaleString()}`),
  
  deduction80D: z
    .number()
    .min(0, "Deduction under 80D cannot be negative")
    .max(MAX_80D_LIMIT, `Deduction under 80D cannot exceed ₹${MAX_80D_LIMIT.toLocaleString()}`),
  
  homeLoanInterest: z
    .number()
    .min(0, "Home loan interest cannot be negative")
    .refine((val) => val >= 0, {
      message: "Home loan interest must be greater than or equal to 0",
    }),

  otherDeductions: z
    .number()
    .min(0, "Other deductions cannot be negative")
    .default(0),
}).refine(
  (data) => data.hraReceived <= data.grossIncome,
  {
    message: "HRA received cannot be more than gross income",
    path: ["hraReceived"],
  }
).refine(
  (data) => {
    if (data.salaryType === "CTC") {
      return data.epf! <= data.ctc!;
    }
    return true;
  },
  {
    message: "EPF cannot be more than CTC",
    path: ["epf"],
  }
).refine(
  (data) => {
    if (data.salaryType === "CTC") {
      return data.ctc! > 0;
    }
    return true;
  },
  {
    message: "CTC must be greater than 0",
    path: ["ctc"],
  }
);

// Type inference
export type TaxInputSchemaType = z.infer<typeof taxInputSchema>;

// Validation function
export const validateTaxInput = (data: unknown) => {
  return taxInputSchema.safeParse(data);
}; 