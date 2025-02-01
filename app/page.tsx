import { TaxCalculator } from "../components/TaxCalculator"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Indian Tax Calculator</h1>
      <TaxCalculator />
    </main>
  )
}

