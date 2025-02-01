import { useState } from "react"
import type { TaxInput, TaxOutput, TaxBreakdown } from "../types/tax"

const calculateTax = (income: number, regime: "old" | "new"): number => {
  let tax = 0
  if (regime === "old") {
    if (income > 1000000) tax += (income - 1000000) * 0.3
    if (income > 500000) tax += Math.min(income - 500000, 500000) * 0.2
    if (income > 250000) tax += Math.min(income - 250000, 250000) * 0.05
  } else {
    if (income > 2400000) tax += (income - 2400000) * 0.3
    if (income > 2000000) tax += Math.min(income - 2000000, 400000) * 0.25
    if (income > 1600000) tax += Math.min(income - 1600000, 400000) * 0.2
    if (income > 1200000) tax += Math.min(income - 1200000, 400000) * 0.15
    if (income > 800000) tax += Math.min(income - 800000, 400000) * 0.1
    if (income > 400000) tax += Math.min(income - 400000, 400000) * 0.05
  }
  return tax
}

const calculateCess = (tax: number): number => tax * 0.04

const calculateSurcharge = (income: number, tax: number): number => {
  if (income > 50000000) return tax * 0.37
  if (income > 20000000) return tax * 0.25
  if (income > 10000000) return tax * 0.15
  if (income > 5000000) return tax * 0.1
  return 0
}

const calculateRebate = (income: number, regime: "old" | "new", tax: number, cess: number): number => {
  if (regime === "old" && income <= 500000) return Math.min(12500, tax + cess)
  if (regime === "new" && income <= 1200000) return Math.min(80000, tax + cess)
  return 0
}

export const useTaxCalculator = () => {
  const [taxBreakdown, setTaxBreakdown] = useState<TaxBreakdown | null>(null)

  const calculateTaxBreakdown = (input: TaxInput): TaxBreakdown => {
    const calculateForRegime = (regime: "old" | "new"): TaxOutput => {
      let netTaxableIncome = input.grossIncome
      console.log("Initial Net Taxable Income:", netTaxableIncome)

      // Apply standard deduction based on regime
      const standardDeduction = regime === "old" ? 50000 : 75000
      netTaxableIncome -= standardDeduction
      console.log("After Standard Deduction:", netTaxableIncome)

      if (regime === "old") {
        // Calculate HRA exemption
        const hraExemption = Math.min(
          input.hraReceived > 0 ? input.hraReceived : 0,
          input.rentPaid > 0 ? input.rentPaid * 12 - 0.1 * input.grossIncome : 0,
          input.grossIncome > 0 ? 0.5 * input.grossIncome : 0,
        )
        console.log("HRA Exemption:", hraExemption)

        // Subtract HRA exemption from net taxable income
        netTaxableIncome = Math.max(0, netTaxableIncome - hraExemption)
        console.log("After HRA Exemption:", netTaxableIncome)

        // Apply other deductions
        netTaxableIncome -= Math.min(input.deduction80C, 150000)
        netTaxableIncome -= Math.min(input.deduction80CCD1B, 50000)
        netTaxableIncome -= Math.min(input.deduction80D, 75000)

        // Apply Home Loan Interest Deduction for old regime
        const homeLoanInterestDeduction = Math.min(input.homeLoanInterest, 200000)
        netTaxableIncome -= homeLoanInterestDeduction
        console.log("After Home Loan Interest Deduction:", netTaxableIncome)

        // Apply other deductions
        netTaxableIncome -= input.otherDeductions
        console.log("After Other Deductions:", netTaxableIncome)
      }

      // Ensure netTaxableIncome is not less than 0
      netTaxableIncome = Math.max(0, netTaxableIncome)
      console.log("Final Net Taxable Income:", netTaxableIncome)

      const taxPayable = calculateTax(netTaxableIncome, regime)
      const cess = calculateCess(taxPayable)
      const surcharge = calculateSurcharge(netTaxableIncome, taxPayable)
      const rebate = calculateRebate(netTaxableIncome, regime, taxPayable, cess)
      const finalTaxPayable = Math.max(0, taxPayable + cess + surcharge - rebate)

      return {
        netTaxableIncome,
        taxPayable,
        cess,
        surcharge,
        rebate,
        finalTaxPayable,
        standardDeduction,
        homeLoanInterestDeduction: regime === "old" ? Math.min(input.homeLoanInterest, 200000) : 0,
      }
    }

    const breakdown: TaxBreakdown = {
      old: calculateForRegime("old"),
      new: calculateForRegime("new"),
    }

    setTaxBreakdown(breakdown)
    return breakdown
  }

  return { taxBreakdown, calculateTaxBreakdown }
}

