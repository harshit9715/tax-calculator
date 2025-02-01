import type { TaxBreakdown } from "../types/tax"

export function generateTaxReport(breakdown: TaxBreakdown): string {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount)
  }

  const report = `
Tax Calculation Report

Old Regime:
Standard Deduction: ${formatCurrency(breakdown.old.standardDeduction)}
Home Loan Interest Deduction: ${formatCurrency(breakdown.old.homeLoanInterestDeduction)}
Net Taxable Income: ${formatCurrency(breakdown.old.netTaxableIncome)}
Tax Payable: ${formatCurrency(breakdown.old.taxPayable)}
Cess: ${formatCurrency(breakdown.old.cess)}
Surcharge: ${formatCurrency(breakdown.old.surcharge)}
Rebate: ${formatCurrency(breakdown.old.rebate)}
Final Tax Payable: ${formatCurrency(breakdown.old.finalTaxPayable)}

New Regime:
Standard Deduction: ${formatCurrency(breakdown.new.standardDeduction)}
Net Taxable Income: ${formatCurrency(breakdown.new.netTaxableIncome)}
Tax Payable: ${formatCurrency(breakdown.new.taxPayable)}
Cess: ${formatCurrency(breakdown.new.cess)}
Surcharge: ${formatCurrency(breakdown.new.surcharge)}
Rebate (including Cess): ${formatCurrency(breakdown.new.rebate)}
Final Tax Payable: ${formatCurrency(breakdown.new.finalTaxPayable)}

Regime Comparison:
Recommended Regime: ${breakdown.old.finalTaxPayable <= breakdown.new.finalTaxPayable ? "Old" : "New"}
Tax Saving: ${formatCurrency(Math.abs(breakdown.old.finalTaxPayable - breakdown.new.finalTaxPayable))}
`

  return report
}

