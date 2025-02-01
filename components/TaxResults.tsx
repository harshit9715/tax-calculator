import type { TaxBreakdown } from "../types/tax"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TaxResultsProps {
  breakdown: TaxBreakdown
}

export function TaxResults({ breakdown }: TaxResultsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount)
  }

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Tax Calculation Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Old Regime</h3>
              <p>Standard Deduction: {formatCurrency(breakdown.old.standardDeduction)}</p>
              <p>Home Loan Interest Deduction: {formatCurrency(breakdown.old.homeLoanInterestDeduction)}</p>
              <p>Net Taxable Income: {formatCurrency(breakdown.old.netTaxableIncome)}</p>
              <p>Tax Payable: {formatCurrency(breakdown.old.taxPayable)}</p>
              <p>Cess: {formatCurrency(breakdown.old.cess)}</p>
              <p>Surcharge: {formatCurrency(breakdown.old.surcharge)}</p>
              <p>Rebate: {formatCurrency(breakdown.old.rebate)}</p>
              <p className="font-bold">Final Tax Payable: {formatCurrency(breakdown.old.finalTaxPayable)}</p>
            </div>
            <div>
              <h3 className="font-semibold">New Regime</h3>
              <p>Standard Deduction: {formatCurrency(breakdown.new.standardDeduction)}</p>
              <p>Net Taxable Income: {formatCurrency(breakdown.new.netTaxableIncome)}</p>
              <p>Tax Payable: {formatCurrency(breakdown.new.taxPayable)}</p>
              <p>Cess: {formatCurrency(breakdown.new.cess)}</p>
              <p>Surcharge: {formatCurrency(breakdown.new.surcharge)}</p>
              <p>Rebate (including Cess): {formatCurrency(breakdown.new.rebate)}</p>
              <p className="font-bold">Final Tax Payable: {formatCurrency(breakdown.new.finalTaxPayable)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Regime Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-bold">
            Recommended Regime: {breakdown.old.finalTaxPayable <= breakdown.new.finalTaxPayable ? "Old" : "New"}
          </p>
          <p>Tax Saving: {formatCurrency(Math.abs(breakdown.old.finalTaxPayable - breakdown.new.finalTaxPayable))}</p>
        </CardContent>
      </Card>
    </div>
  )
}

