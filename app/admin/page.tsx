import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { dollarToINR, formatCurrency, formatNumber } from "@/lib/formatter"
import db from "@/lib/prisma"
import AdminHeader from "./_Components/AdminHeader"

async function getSalesData() {
  const { _count, _sum } = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true,
  })
  return {
    totalUnits: _count,
    totalSales: dollarToINR((_sum.pricePaidInCents || 0) / 100),
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
        : dollarToINR(
            (orderSum._avg.pricePaidInCents || 0) / 100 / customerCount
          ),
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
      <AdminHeader>Admin Dashboard</AdminHeader>
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
