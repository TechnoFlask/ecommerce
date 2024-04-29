import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatCurrency, formatNumber } from "@/lib/formatter"
import db from "@/lib/prisma"

async function getSalesData() {
  const { _count, _sum } = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true,
  })
  const dollarToRupee = 84
  return {
    totalUnits: _count,
    totalSales: ((_sum.pricePaidInCents || 0) / 100) * dollarToRupee,
  }
}

async function getCustomersData() {
  const [customerCount, orderSum] = await Promise.all([
    await db.customer.count(),
    db.order.aggregate({
      _avg: { pricePaidInCents: true },
    }),
  ])

  return {
    totalCustomers: customerCount,
    averageCustomerValue:
      customerCount === 0
        ? 0
        : (orderSum._avg.pricePaidInCents || 0) / 100 / customerCount,
  }
}

async function getProductsData() {
  const [activeProductCount, inactiveProductCount] = await Promise.all([
    db.product.count({ where: { purchasable: true } }),
    db.product.count({ where: { purchasable: false } }),
  ])
  return { activeProductCount, inactiveProductCount }
}

export default async function AdminPage() {
  const [salesData, customerData, productsData] = await Promise.all([
    getSalesData(),
    getCustomersData(),
    getProductsData(),
  ])
  return (
    <>
      <h1 className="text-3xl mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminDashboardCard
          title="Sales"
          subtitle={`${formatNumber(salesData.totalUnits)} Orders`}
          content={formatCurrency(salesData.totalSales)}
        />
        <AdminDashboardCard
          title="Customers"
          subtitle={`${formatNumber(customerData.totalCustomers)} Customers`}
          content={`${formatCurrency(
            customerData.averageCustomerValue
          )} average value`}
        />
        <AdminDashboardCard
          title="Products"
          subtitle={`${formatNumber(
            productsData.inactiveProductCount
          )} Inactive`}
          content={formatNumber(productsData.activeProductCount)}
        />
      </div>
    </>
  )
}

type DashboardCardProps = {
  title: string
  subtitle: string
  content: string
}

export function AdminDashboardCard({
  title,
  subtitle,
  content,
}: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  )
}
