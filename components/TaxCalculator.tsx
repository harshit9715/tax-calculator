"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTaxCalculator } from "../hooks/useTaxCalculator"
import { TaxResults } from "./TaxResults"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { generateTaxReport } from "../utils/generateTaxReport"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DEFAULT_EPF, taxInputSchema, type TaxInputSchemaType } from "@/lib/validations/tax"
import { useEffect } from "react"
import { InputWithMax } from "@/components/ui/input-with-max"

export function TaxCalculator() {
  const form = useForm<TaxInputSchemaType>({
    resolver: zodResolver(taxInputSchema),
    defaultValues: {
      salaryType: "GROSS",
      grossIncome: 0,
      hraReceived: 0,
      rentPaid: 0,
      deduction80C: 0,
      deduction80CCD1B: 0,
      deduction80D: 0,
      homeLoanInterest: 0,
      epf: DEFAULT_EPF,
      ctc: 0,
      otherDeductions: 0,
    },
  })

  const salaryType = form.watch("salaryType")
  const ctc = form.watch("ctc")
  const epf = form.watch("epf")

  useEffect(() => {
    if (salaryType === "CTC" && ctc && epf) {
      form.setValue("grossIncome", ctc - epf)
    }
  }, [salaryType, ctc, epf, form])

  const { taxBreakdown, calculateTaxBreakdown } = useTaxCalculator()

  const handleSubmit = (values: TaxInputSchemaType) => {
    calculateTaxBreakdown(values)
  }

  const handleDownload = () => {
    if (taxBreakdown) {
      const report = generateTaxReport(taxBreakdown)
      const blob = new Blob([report], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "tax_report.txt"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <TooltipProvider>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Indian Tax Calculator</CardTitle>
          <CardDescription>Calculate your taxes under both Old and New Regimes</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="salaryType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-bold">Salary Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="GROSS" id="gross" />
                          <label htmlFor="gross">Gross</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="CTC" id="ctc" />
                          <label htmlFor="ctc">CTC</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {salaryType === "CTC" ? (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ctc"
                    render={({ field }) => (
                      <FormItem>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <FormLabel className="font-bold">CTC</FormLabel>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Your total Cost to Company</p>
                          </TooltipContent>
                        </Tooltip>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            placeholder="Enter your CTC"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="epf"
                    render={({ field }) => (
                      <FormItem>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <FormLabel className="font-bold">EPF/VPF</FormLabel>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Employee Provident Fund contribution</p>
                          </TooltipContent>
                        </Tooltip>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            placeholder="Enter EPF amount"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="grossIncome"
                  render={({ field }) => (
                    <FormItem>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FormLabel className="font-bold">Gross Income</FormLabel>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your total income before any deductions</p>
                        </TooltipContent>
                      </Tooltip>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="Enter your gross income"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hraReceived"
                  render={({ field }) => (
                    <FormItem>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FormLabel className="font-bold">HRA Received</FormLabel>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{"Enter the HRA amount you've received"}</p>
                        </TooltipContent>
                      </Tooltip>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="Enter HRA received"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rentPaid"
                  render={({ field }) => (
                    <FormItem>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FormLabel className="font-bold">Rent Paid</FormLabel>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter the total rent paid for the year</p>
                        </TooltipContent>
                      </Tooltip>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="Enter annual rent paid"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="deduction80C"
                  render={({ field }) => (
                    <FormItem>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FormLabel className="font-bold">80C Deductions</FormLabel>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter total 80C deductions (max ₹1.5 Lakh)</p>
                        </TooltipContent>
                      </Tooltip>
                      <FormControl>
                        <InputWithMax
                          type="number"
                          step="any"
                          placeholder="Enter 80C deductions"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          onMax={() => field.onChange(150000)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deduction80D"
                  render={({ field }) => (
                    <FormItem>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FormLabel className="font-bold">80D Health Insurance</FormLabel>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter 80D health insurance premium (max ₹75,000)</p>
                        </TooltipContent>
                      </Tooltip>
                      <FormControl>
                        <InputWithMax
                          type="number"
                          step="any"
                          placeholder="Enter health insurance premium"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          onMax={() => field.onChange(75000)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="deduction80CCD1B"
                  render={({ field }) => (
                    <FormItem>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FormLabel className="font-bold">80CCD(1B) NPS</FormLabel>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter 80CCD(1B) NPS contribution (max ₹50,000)</p>
                        </TooltipContent>
                      </Tooltip>
                      <FormControl>
                        <InputWithMax
                          type="number"
                          step="any"
                          placeholder="Enter NPS contribution"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          onMax={() => field.onChange(50000)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="homeLoanInterest"
                  render={({ field }) => (
                    <FormItem>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FormLabel className="font-bold">Home Loan Interest Paid</FormLabel>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter home loan interest paid (max deduction ₹2,00,000 for old regime)</p>
                        </TooltipContent>
                      </Tooltip>
                      <FormControl>
                        <InputWithMax
                          type="number"
                          step="any"
                          placeholder="Enter home loan interest paid"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          onMax={() => field.onChange(200000)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="otherDeductions"
                render={({ field }) => (
                  <FormItem>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FormLabel className="font-bold">Other Deductions</FormLabel>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enter any other tax deductions not covered above</p>
                      </TooltipContent>
                    </Tooltip>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="Enter other deductions"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Calculate Tax</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch">
          {taxBreakdown && (
            <>
              <TaxResults breakdown={taxBreakdown} />
              <Button onClick={handleDownload} className="mt-4">
                Download Tax Report
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </TooltipProvider>
  )
}

