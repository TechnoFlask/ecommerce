const currency_formatter = Intl.NumberFormat("en-IN", {
  currency: "INR",
  style: "currency",
  minimumFractionDigits: 0,
})
const number_formatter = Intl.NumberFormat("en-IN")

export const formatCurrency = (curr: number) => currency_formatter.format(curr)
export const formatNumber = (num: number) => number_formatter.format(num)
export const dollarToINR = (dollar: number) => dollar * 83.5
