export interface TaxInput {
  grossIncome: number
  hraReceived: number
  rentPaid: number
  deduction80C: number
  deduction80CCD1B: number
  deduction80D: number
  homeLoanInterest: number
  otherDeductions: number
}

export interface TaxOutput {
  netTaxableIncome: number
  taxPayable: number
  cess: number
  surcharge: number
  rebate: number
  finalTaxPayable: number
  standardDeduction: number
  homeLoanInterestDeduction: number
}

export interface TaxBreakdown {
  old: TaxOutput
  new: TaxOutput
}

