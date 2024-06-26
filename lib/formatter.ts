const currency_formatter = Intl.NumberFormat("en-IN", {
  currency: "INR",
  style: "currency",
  minimumFractionDigits: 0,
})
const number_formatter = Intl.NumberFormat("en-IN")

export const formatCurrency = (curr: number) => currency_formatter.format(curr)
export const formatNumber = (num: number) => number_formatter.format(num)
export const centsToINR = (dollar: number) => (dollar * 83.5) / 100
export const INRtoCents = (inr: number) => (inr / 83.5) * 100
