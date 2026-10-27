"use client"

import { useState, useMemo } from "react"
import {
  BarChart3,
  TrendingUp,
  Package,
  Building2,
  Stethoscope,
  Pill,
  FileText,
  Download,
  Calendar,
  Filter,
  Search,
  MapPin,
  AlertTriangle,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useAuth } from "@/contexts/auth-context"
import { mockDrugs, mockPharmacies, mockPrescriptions } from "@/lib/mock-data"

// Mock sales data for warehouse
const mockSalesData = [
  {
    drugId: "drug-1",
    drugName: "بنادول 500 مجم",
    totalSold: 1250,
    revenue: 15625,
    trend: 12,
    pharmacies: [
      { name: "صيدلية الشفاء", quantity: 450, city: "الرياض" },
      { name: "صيدلية النهدي", quantity: 380, city: "جدة" },
      { name: "صيدلية الدواء", quantity: 420, city: "الرياض" },
    ],
  },
  {
    drugId: "drug-2",
    drugName: "أموكسيل 500 مجم",
    totalSold: 890,
    revenue: 24920,
    trend: 8,
    pharmacies: [
      { name: "صيدلية الشفاء", quantity: 320, city: "الرياض" },
      { name: "صيدلية المجتمع", quantity: 280, city: "الرياض" },
      { name: "صيدلية النهدي", quantity: 290, city: "جدة" },
    ],
  },
  {
    drugId: "drug-3",
    drugName: "ترامادول 50 مجم",
    totalSold: 120,
    revenue: 5400,
    trend: -5,
    pharmacies: [
      { name: "صيدلية الشفاء", quantity: 50, city: "الرياض" },
      { name: "صيدلية الدواء", quantity: 70, city: "الرياض" },
    ],
    isControlled: true,
  },
  {
    drugId: "drug-4",
    drugName: "جلوكوفاج 850 مجم",
    totalSold: 2100,
    revenue: 73500,
    trend: 15,
    pharmacies: [
      { name: "صيدلية الشفاء", quantity: 800, city: "الرياض" },
      { name: "صيدلية النهدي", quantity: 750, city: "جدة" },
      { name: "صيدلية الدواء", quantity: 550, city: "الرياض" },
    ],
  },
  {
    drugId: "drug-5",
    drugName: "كونكور 5 مجم",
    totalSold: 650,
    revenue: 35750,
    trend: 3,
    pharmacies: [
      { name: "صيدلية الشفاء", quantity: 280, city: "الرياض" },
      { name: "صيدلية المجتمع", quantity: 220, city: "الرياض" },
      { name: "صيدلية النهدي", quantity: 150, city: "جدة" },
    ],
  },
]

// Mock doctor prescription data
const mockDoctorStats = [
  {
    id: "doc-1",
    name: "د. أحمد محمد السعيد",
    specialty: "طب عام",
    hospital: "عيادة السعادة",
    city: "الرياض",
    prescriptionCount: 145,
    controlledCount: 12,
    topDrugs: ["جلوكوفاج", "كونكور", "زيرتك"],
  },
  {
    id: "doc-2",
    name: "د. فاطمة العلي",
    specialty: "أمراض الصدر",
    hospital: "مستشفى المملكة",
    city: "الرياض",
    prescriptionCount: 98,
    controlledCount: 5,
    topDrugs: ["فنتولين", "زيرتك", "أموكسيل"],
  },
  {
    id: "doc-3",
    name: "د. محمد الراشد",
    specialty: "جراحة",
    hospital: "مستشفى الملك فيصل",
    city: "الرياض",
    prescriptionCount: 67,
    controlledCount: 28,
    topDrugs: ["ترامادول", "بنادول", "أموكسيل"],
  },
]

// Mock yellow prescription stats
const mockYellowPrescriptionStats = {
  total: 45,
  dispensed: 38,
  pending: 5,
  expired: 2,
  drugs: [
    { name: "ترامادول 50 مجم", count: 28 },
    { name: "مورفين 10 مجم", count: 12 },
    { name: "أوكسيكودون 5 مجم", count: 5 },
  ],
}

export function WarehouseDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState("month")
  const [expandedDrug, setExpandedDrug] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Summary stats
  const summaryStats = useMemo(() => {
    const totalRevenue = mockSalesData.reduce((sum, d) => sum + d.revenue, 0)
    const totalSold = mockSalesData.reduce((sum, d) => sum + d.totalSold, 0)
    const controlledSold = mockSalesData
      .filter((d) => d.isControlled)
      .reduce((sum, d) => sum + d.totalSold, 0)

    return {
      totalRevenue,
      totalSold,
      controlledSold,
      pharmacyCount: mockPharmacies.length,
      doctorCount: mockDoctorStats.length,
      avgOrderValue: Math.round(totalRevenue / totalSold),
    }
  }, [])

  const filteredSalesData = useMemo(() => {
    if (!searchQuery) return mockSalesData
    return mockSalesData.filter((d) =>
      d.drugName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("ar-SA").format(num)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            لوحة تحكم المستودع / شركة الأدوية
          </h2>
          <p className="text-muted-foreground">{user?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 ml-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">آخر أسبوع</SelectItem>
              <SelectItem value="month">آخر شهر</SelectItem>
              <SelectItem value="quarter">آخر 3 أشهر</SelectItem>
              <SelectItem value="year">آخر سنة</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-bold">{formatCurrency(summaryStats.totalRevenue)}</p>
                <p className="text-xs text-muted-foreground">إجمالي المبيعات</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-bold">{formatNumber(summaryStats.totalSold)}</p>
                <p className="text-xs text-muted-foreground">وحدات مباعة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-lg font-bold">{formatNumber(summaryStats.controlledSold)}</p>
                <p className="text-xs text-muted-foreground">أدوية مقيدة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold">{summaryStats.pharmacyCount}</p>
                <p className="text-xs text-muted-foreground">صيدلية</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Stethoscope className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-bold">{summaryStats.doctorCount}</p>
                <p className="text-xs text-muted-foreground">طبيب واصف</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-bold">{formatCurrency(summaryStats.avgOrderValue)}</p>
                <p className="text-xs text-muted-foreground">متوسط السعر</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger value="drugs" className="gap-2">
            <Pill className="w-4 h-4" />
            الأدوية
          </TabsTrigger>
          <TabsTrigger value="pharmacies" className="gap-2">
            <Building2 className="w-4 h-4" />
            الصيدليات
          </TabsTrigger>
          <TabsTrigger value="doctors" className="gap-2">
            <Stethoscope className="w-4 h-4" />
            الأطباء
          </TabsTrigger>
          <TabsTrigger value="controlled" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            الوصفات الصفراء
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Selling Drugs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">الأدوية الأكثر مبيعاً</CardTitle>
                <CardDescription>حسب الكمية المباعة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockSalesData
                  .sort((a, b) => b.totalSold - a.totalSold)
                  .slice(0, 5)
                  .map((drug, index) => (
                    <div key={drug.drugId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            {index + 1}.
                          </span>
                          <span className="text-sm font-medium">{drug.drugName}</span>
                          {drug.isControlled && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 text-xs">
                              مقيد
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{formatNumber(drug.totalSold)}</span>
                          <span
                            className={`flex items-center text-xs ${
                              drug.trend > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {drug.trend > 0 ? (
                              <ArrowUpRight className="w-3 h-3" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3" />
                            )}
                            {Math.abs(drug.trend)}%
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={(drug.totalSold / mockSalesData[0].totalSold) * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Revenue by Drug */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">الإيرادات حسب الدواء</CardTitle>
                <CardDescription>إجمالي الإيرادات بالريال</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockSalesData
                  .sort((a, b) => b.revenue - a.revenue)
                  .slice(0, 5)
                  .map((drug, index) => (
                    <div key={drug.drugId} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          {index + 1}.
                        </span>
                        <span className="text-sm">{drug.drugName}</span>
                      </div>
                      <span className="text-sm font-medium">{formatCurrency(drug.revenue)}</span>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Top Pharmacies */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">أكثر الصيدليات طلباً</CardTitle>
                <CardDescription>حسب إجمالي الطلبات</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockPharmacies.map((pharmacy, index) => (
                  <div key={pharmacy.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{pharmacy.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {pharmacy.location.city}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{(5 - index) * 230} وحدة</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Yellow Prescription Summary */}
            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  ملخص الوصفات الصفراء
                </CardTitle>
                <CardDescription>الأدوية المقيدة والخاضعة للرقابة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">{mockYellowPrescriptionStats.total}</p>
                    <p className="text-xs text-muted-foreground">إجمالي الوصفات</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {mockYellowPrescriptionStats.dispensed}
                    </p>
                    <p className="text-xs text-muted-foreground">تم صرفها</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">الأدوية المقيدة الأكثر وصفاً:</p>
                  {mockYellowPrescriptionStats.drugs.map((drug) => (
                    <div key={drug.name} className="flex items-center justify-between text-sm">
                      <span>{drug.name}</span>
                      <Badge variant="outline" className="bg-yellow-50">
                        {drug.count} وصفة
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Drugs Tab */}
        <TabsContent value="drugs" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث عن دواء..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue placeholder="نوع الدواء" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأدوية</SelectItem>
                <SelectItem value="controlled">أدوية مقيدة</SelectItem>
                <SelectItem value="regular">أدوية عادية</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {filteredSalesData.map((drug) => (
              <Collapsible
                key={drug.drugId}
                open={expandedDrug === drug.drugId}
                onOpenChange={() =>
                  setExpandedDrug(expandedDrug === drug.drugId ? null : drug.drugId)
                }
              >
                <Card className={drug.isControlled ? "border-yellow-200" : ""}>
                  <CollapsibleTrigger asChild>
                    <CardContent className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-2 rounded-lg ${
                              drug.isControlled ? "bg-yellow-100" : "bg-primary/10"
                            }`}
                          >
                            <Pill
                              className={`w-5 h-5 ${
                                drug.isControlled ? "text-yellow-600" : "text-primary"
                              }`}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{drug.drugName}</span>
                              {drug.isControlled && (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                                  مقيد
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {drug.pharmacies.length} صيدليات
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-left">
                            <p className="font-medium">{formatNumber(drug.totalSold)}</p>
                            <p className="text-xs text-muted-foreground">وحدة</p>
                          </div>
                          <div className="text-left">
                            <p className="font-medium">{formatCurrency(drug.revenue)}</p>
                            <p className="text-xs text-muted-foreground">إيرادات</p>
                          </div>
                          <div
                            className={`flex items-center gap-1 ${
                              drug.trend > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {drug.trend > 0 ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4" />
                            )}
                            <span>{Math.abs(drug.trend)}%</span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              expandedDrug === drug.drugId ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 pb-4">
                      <Separator className="mb-4" />
                      <p className="text-sm font-medium mb-3">توزيع المبيعات حسب الصيدلية:</p>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>الصيدلية</TableHead>
                            <TableHead>المدينة</TableHead>
                            <TableHead className="text-left">الكمية</TableHead>
                            <TableHead className="text-left">النسبة</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {drug.pharmacies.map((pharmacy) => (
                            <TableRow key={pharmacy.name}>
                              <TableCell>{pharmacy.name}</TableCell>
                              <TableCell>{pharmacy.city}</TableCell>
                              <TableCell className="text-left">
                                {formatNumber(pharmacy.quantity)}
                              </TableCell>
                              <TableCell className="text-left">
                                {Math.round((pharmacy.quantity / drug.totalSold) * 100)}%
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </TabsContent>

        {/* Pharmacies Tab */}
        <TabsContent value="pharmacies" className="space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="بحث عن صيدلية..." className="pr-10" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {mockPharmacies.map((pharmacy, index) => (
              <Card key={pharmacy.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{pharmacy.name}</p>
                        <p className="text-sm text-muted-foreground">{pharmacy.address}</p>
                        <p className="text-sm text-muted-foreground">{pharmacy.phone}</p>
                      </div>
                    </div>
                    <Badge variant={pharmacy.isOpen ? "default" : "secondary"}>
                      {pharmacy.isOpen ? "مفتوح" : "مغلق"}
                    </Badge>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold">{(5 - index) * 230}</p>
                      <p className="text-xs text-muted-foreground">وحدة مشتراة</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">{formatCurrency((5 - index) * 4500)}</p>
                      <p className="text-xs text-muted-foreground">إجمالي المشتريات</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">{(5 - index) * 12}</p>
                      <p className="text-xs text-muted-foreground">طلب</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Doctors Tab */}
        <TabsContent value="doctors" className="space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="بحث عن طبيب..." className="pr-10" />
          </div>

          <div className="space-y-4">
            {mockDoctorStats.map((doctor) => (
              <Card key={doctor.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-purple-100">
                        <Stethoscope className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">{doctor.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doctor.specialty} - {doctor.hospital}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {doctor.city}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-xl font-bold">{doctor.prescriptionCount}</p>
                        <p className="text-xs text-muted-foreground">وصفة</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-yellow-600">{doctor.controlledCount}</p>
                        <p className="text-xs text-muted-foreground">وصفة صفراء</p>
                      </div>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">الأدوية الأكثر وصفاً:</p>
                    <div className="flex flex-wrap gap-2">
                      {doctor.topDrugs.map((drug) => (
                        <Badge key={drug} variant="secondary">
                          {drug}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Controlled Drugs Tab */}
        <TabsContent value="controlled" className="space-y-4">
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                تقرير الأدوية المقيدة (الوصفات الصفراء)
              </CardTitle>
              <CardDescription>
                تتبع صرف الأدوية الخاضعة للرقابة حسب المريض والطبيب والصيدلية
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold">{mockYellowPrescriptionStats.total}</p>
                <p className="text-sm text-muted-foreground">إجمالي الوصفات</p>
              </CardContent>
            </Card>
            <Card className="border-green-200">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-green-600">
                  {mockYellowPrescriptionStats.dispensed}
                </p>
                <p className="text-sm text-muted-foreground">تم صرفها</p>
              </CardContent>
            </Card>
            <Card className="border-amber-200">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-amber-600">
                  {mockYellowPrescriptionStats.pending}
                </p>
                <p className="text-sm text-muted-foreground">قيد الانتظار</p>
              </CardContent>
            </Card>
            <Card className="border-red-200">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-red-600">
                  {mockYellowPrescriptionStats.expired}
                </p>
                <p className="text-sm text-muted-foreground">منتهية</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">سجل الوصفات الصفراء</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الوصفة</TableHead>
                    <TableHead>المريض</TableHead>
                    <TableHead>رقم الهوية</TableHead>
                    <TableHead>الطبيب</TableHead>
                    <TableHead>الدواء</TableHead>
                    <TableHead>الصيدلية</TableHead>
                    <TableHead>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPrescriptions
                    .filter((p) => p.type === "yellow")
                    .map((prescription) => (
                      <TableRow key={prescription.id}>
                        <TableCell className="font-mono text-xs">
                          {prescription.prescriptionNumber}
                        </TableCell>
                        <TableCell>{prescription.patient.name}</TableCell>
                        <TableCell className="font-mono">
                          {prescription.patient.nationalId}
                        </TableCell>
                        <TableCell>{prescription.doctorName}</TableCell>
                        <TableCell>
                          {prescription.items
                            .filter((i) => i.isControlled)
                            .map((i) => i.drugName)
                            .join("، ")}
                        </TableCell>
                        <TableCell>{prescription.pharmacyName || "-"}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              prescription.status === "dispensed"
                                ? "bg-green-100 text-green-800"
                                : prescription.status === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {prescription.status === "dispensed"
                              ? "تم الصرف"
                              : prescription.status === "pending"
                              ? "قيد الانتظار"
                              : prescription.status === "reserved"
                              ? "محجوز"
                              : "منتهي"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
