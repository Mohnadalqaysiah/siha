"use client"

import { useState, useMemo } from "react"
import {
  FileText,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  Calendar,
  Pill,
  Package,
  Bell,
  Eye,
  Filter,
  CreditCard,
  QrCode,
  Scan,
  TrendingUp,
  TrendingDown,
  Box,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { mockPrescriptions, mockDrugs, mockNotifications } from "@/lib/mock-data"
import type { Prescription, PrescriptionStatus, Notification } from "@/lib/types"
import { PrescriptionDetails } from "./prescription-details"

const statusConfig: Record<
  PrescriptionStatus,
  { label: string; color: string; icon: typeof Clock }
> = {
  pending: { label: "جديدة", color: "bg-amber-100 text-amber-800", icon: Clock },
  reserved: { label: "محجوز", color: "bg-blue-100 text-blue-800", icon: Package },
  dispensed: { label: "تم الصرف", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  expired: { label: "منتهي", color: "bg-gray-100 text-gray-800", icon: XCircle },
  cancelled: { label: "ملغي", color: "bg-red-100 text-red-800", icon: XCircle },
}

export function PharmacyPanel() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("prescriptions")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [showDispenseDialog, setShowDispenseDialog] = useState(false)
  const [nationalIdInput, setNationalIdInput] = useState("")
  const [verificationError, setVerificationError] = useState("")
  const [showNotifications, setShowNotifications] = useState(false)

  // Filter prescriptions for this pharmacy or pending ones
  const pharmacyPrescriptions = useMemo(() => {
    console.log("[v0] Pharmacy User:", user)
    console.log("[v0] All prescriptions for pharmacy:", mockPrescriptions)
    // For demo, show all prescriptions for pharmacy users
    const filtered = mockPrescriptions.filter(
      (p) => user?.role === "pharmacy"
    )
    console.log("[v0] Filtered pharmacy prescriptions:", filtered)
    return filtered
  }, [user])

  const filteredPrescriptions = useMemo(() => {
    return pharmacyPrescriptions.filter((prescription) => {
      const matchesSearch =
        prescription.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prescription.prescriptionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prescription.patient.nationalId.includes(searchQuery)

      const matchesStatus = statusFilter === "all" || prescription.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [pharmacyPrescriptions, searchQuery, statusFilter])

  // Statistics
  const stats = useMemo(() => {
    return {
      pending: pharmacyPrescriptions.filter((p) => p.status === "pending").length,
      reserved: pharmacyPrescriptions.filter((p) => p.status === "reserved").length,
      dispensedToday: pharmacyPrescriptions.filter((p) => {
        if (p.status !== "dispensed" || !p.dispensedAt) return false
        const today = new Date()
        const dispensedDate = new Date(p.dispensedAt)
        return dispensedDate.toDateString() === today.toDateString()
      }).length,
      yellowPrescriptions: pharmacyPrescriptions.filter(
        (p) => p.type === "yellow" && (p.status === "pending" || p.status === "reserved")
      ).length,
    }
  }, [pharmacyPrescriptions])

  // Inventory stats
  const inventoryStats = useMemo(() => {
    const lowStock = mockDrugs.filter((d) => d.stockQuantity < 50).length
    const expiringSoon = mockDrugs.filter((d) => {
      const expiryDate = new Date(d.expiryDate)
      const threeMonthsFromNow = new Date()
      threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
      return expiryDate <= threeMonthsFromNow
    }).length
    return { lowStock, expiringSoon, totalDrugs: mockDrugs.length }
  }, [])

  // Notifications for this pharmacy
  const pharmacyNotifications = mockNotifications.filter((n) => n.userId === user?.id)
  const unreadCount = pharmacyNotifications.filter((n) => !n.read).length

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date()
    const expires = new Date(expiresAt)
    const diff = expires.getTime() - now.getTime()

    if (diff <= 0) return "منتهية"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) return `${hours} س ${minutes} د`
    return `${minutes} دقيقة`
  }

  const handleReservePrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription)
    // In real app, this would call API to reserve
    console.log("Reserving prescription:", prescription.id)
  }

  const handleDispensePrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription)
    setShowDispenseDialog(true)
    setNationalIdInput("")
    setVerificationError("")
  }

  const verifyAndDispense = () => {
    if (!selectedPrescription) return

    // Verify national ID for yellow prescriptions
    if (selectedPrescription.type === "yellow") {
      if (nationalIdInput !== selectedPrescription.patient.nationalId) {
        setVerificationError("رقم الهوية غير مطابق لبيانات المريض")
        return
      }
    }

    // In real app, this would call API to dispense
    console.log("Dispensing prescription:", selectedPrescription.id)
    setShowDispenseDialog(false)
    setSelectedPrescription(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">لوحة تحكم الصيدلية</h2>
          <p className="text-muted-foreground">{user?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Scan className="w-4 h-4" />
            مسح الباركود
          </Button>
          <Button
            variant="outline"
            className="relative bg-transparent"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">وصفات جديدة</p>
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
                <p className="text-2xl font-bold">{stats.reserved}</p>
                <p className="text-xs text-muted-foreground">محجوز للصرف</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.dispensedToday}</p>
                <p className="text-xs text-muted-foreground">صرف اليوم</p>
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
                <p className="text-2xl font-bold">{stats.yellowPrescriptions}</p>
                <p className="text-xs text-muted-foreground">وصفات صفراء</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="prescriptions" className="gap-2">
            <FileText className="w-4 h-4" />
            الوصفات الواردة
          </TabsTrigger>
          <TabsTrigger value="inventory" className="gap-2">
            <Box className="w-4 h-4" />
            المخزون
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prescriptions" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث باسم المريض أو رقم الوصفة أو رقم الهوية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue placeholder="حالة الوصفة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">جديدة</SelectItem>
                <SelectItem value="reserved">محجوز</SelectItem>
                <SelectItem value="dispensed">تم الصرف</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Prescriptions List */}
          <div className="space-y-3">
            {filteredPrescriptions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">لا توجد وصفات طبية</p>
                </CardContent>
              </Card>
            ) : (
              filteredPrescriptions.map((prescription) => {
                const StatusIcon = statusConfig[prescription.status].icon
                const isUrgent =
                  prescription.status === "pending" &&
                  new Date(prescription.expiresAt).getTime() - Date.now() < 6 * 60 * 60 * 1000

                return (
                  <Card
                    key={prescription.id}
                    className={`transition-all hover:shadow-md ${
                      prescription.type === "yellow"
                        ? "border-yellow-400 border-2"
                        : isUrgent
                        ? "border-red-300 border"
                        : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-2 rounded-lg ${
                                prescription.type === "yellow"
                                  ? "bg-yellow-100"
                                  : "bg-primary/10"
                              }`}
                            >
                              <FileText
                                className={`w-5 h-5 ${
                                  prescription.type === "yellow"
                                    ? "text-yellow-600"
                                    : "text-primary"
                                }`}
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium">{prescription.patient.name}</span>
                                {prescription.type === "yellow" && (
                                  <Badge
                                    variant="outline"
                                    className="bg-yellow-50 text-yellow-700 border-yellow-300"
                                  >
                                    وصفة صفراء
                                  </Badge>
                                )}
                                {isUrgent && (
                                  <Badge variant="destructive" className="text-xs">
                                    عاجل
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <CreditCard className="w-3 h-3" />
                                {prescription.patient.nationalId}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {prescription.prescriptionNumber}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {prescription.doctorName}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Pill className="w-3 h-3" />
                                  {prescription.items.length} أدوية
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={`${statusConfig[prescription.status].color} gap-1`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig[prescription.status].label}
                            </Badge>
                            {(prescription.status === "pending" ||
                              prescription.status === "reserved") && (
                              <p
                                className={`text-xs ${
                                  isUrgent ? "text-red-600 font-medium" : "text-muted-foreground"
                                }`}
                              >
                                ينتهي: {getTimeRemaining(prescription.expiresAt)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Medications Summary */}
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-2">الأدوية:</p>
                          <div className="flex flex-wrap gap-2">
                            {prescription.items.map((item) => (
                              <Badge
                                key={item.drugId}
                                variant="secondary"
                                className={item.isControlled ? "bg-yellow-100 text-yellow-800" : ""}
                              >
                                {item.drugName} x{item.quantity}
                                {item.isControlled && " (مقيد)"}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPrescription(prescription)}
                          >
                            <Eye className="w-4 h-4 ml-1" />
                            التفاصيل
                          </Button>
                          <div className="flex gap-2">
                            {prescription.status === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReservePrescription(prescription)}
                              >
                                <Package className="w-4 h-4 ml-1" />
                                حجز
                              </Button>
                            )}
                            {(prescription.status === "pending" ||
                              prescription.status === "reserved") && (
                              <Button
                                size="sm"
                                onClick={() => handleDispensePrescription(prescription)}
                              >
                                <CheckCircle2 className="w-4 h-4 ml-1" />
                                صرف
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          {/* Inventory Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Pill className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{inventoryStats.totalDrugs}</p>
                    <p className="text-xs text-muted-foreground">إجمالي الأدوية</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-100">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{inventoryStats.lowStock}</p>
                    <p className="text-xs text-muted-foreground">مخزون منخفض</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-amber-600">{inventoryStats.expiringSoon}</p>
                    <p className="text-xs text-muted-foreground">قارب الانتهاء</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Drug Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="بحث في المخزون..." className="pr-10" />
          </div>

          {/* Drug List */}
          <div className="space-y-2">
            {mockDrugs.map((drug) => {
              const isLowStock = drug.stockQuantity < 50
              const expiryDate = new Date(drug.expiryDate)
              const threeMonthsFromNow = new Date()
              threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
              const isExpiringSoon = expiryDate <= threeMonthsFromNow

              return (
                <Card
                  key={drug.id}
                  className={`${
                    isLowStock ? "border-red-200" : isExpiringSoon ? "border-amber-200" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            drug.requiresYellowPrescription ? "bg-yellow-100" : "bg-muted"
                          }`}
                        >
                          <Pill
                            className={`w-4 h-4 ${
                              drug.requiresYellowPrescription
                                ? "text-yellow-600"
                                : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{drug.nameAr}</span>
                            {drug.requiresYellowPrescription && (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 text-xs">
                                مقيد
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {drug.activeIngredient} - {drug.strength}
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p
                          className={`font-medium ${
                            isLowStock ? "text-red-600" : "text-foreground"
                          }`}
                        >
                          {drug.stockQuantity} وحدة
                        </p>
                        <p
                          className={`text-xs ${
                            isExpiringSoon ? "text-amber-600" : "text-muted-foreground"
                          }`}
                        >
                          انتهاء: {drug.expiryDate}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Prescription Details Dialog */}
      <Dialog
        open={!!selectedPrescription && !showDispenseDialog}
        onOpenChange={() => setSelectedPrescription(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>تفاصيل الوصفة الطبية</DialogTitle>
            <DialogDescription>
              {selectedPrescription?.prescriptionNumber}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            {selectedPrescription && (
              <PrescriptionDetails prescription={selectedPrescription} />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Dispense Dialog with ID Verification */}
      <Dialog open={showDispenseDialog} onOpenChange={setShowDispenseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>صرف الوصفة الطبية</DialogTitle>
            <DialogDescription>
              {selectedPrescription?.prescriptionNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedPrescription?.type === "yellow" && (
              <Alert className="border-yellow-400 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>وصفة صفراء:</strong> يجب التحقق من هوية المريض قبل الصرف
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label>اسم المريض</Label>
              <p className="font-medium">{selectedPrescription?.patient.name}</p>
            </div>

            {selectedPrescription?.type === "yellow" && (
              <div className="space-y-2">
                <Label htmlFor="nationalId">أدخل رقم هوية المريض للتحقق</Label>
                <Input
                  id="nationalId"
                  placeholder="1234567890"
                  value={nationalIdInput}
                  onChange={(e) => {
                    setNationalIdInput(e.target.value)
                    setVerificationError("")
                  }}
                  dir="ltr"
                  className="text-left"
                />
                {verificationError && (
                  <p className="text-sm text-destructive">{verificationError}</p>
                )}
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <Label>الأدوية المصروفة</Label>
              <div className="space-y-1">
                {selectedPrescription?.items.map((item) => (
                  <div key={item.drugId} className="flex justify-between text-sm">
                    <span>{item.drugName}</span>
                    <span className="text-muted-foreground">{item.quantity} وحدة</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDispenseDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={verifyAndDispense}>
              <CheckCircle2 className="w-4 h-4 ml-1" />
              تأكيد الصرف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notifications Panel */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>الإشعارات</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-96">
            <div className="space-y-2">
              {pharmacyNotifications.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">لا توجد إشعارات</p>
              ) : (
                pharmacyNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={!notification.read ? "bg-primary/5" : ""}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-1.5 rounded-full ${
                            notification.type === "prescription"
                              ? "bg-blue-100"
                              : notification.type === "stock"
                              ? "bg-red-100"
                              : "bg-muted"
                          }`}
                        >
                          {notification.type === "prescription" ? (
                            <FileText className="w-3 h-3 text-blue-600" />
                          ) : notification.type === "stock" ? (
                            <AlertTriangle className="w-3 h-3 text-red-600" />
                          ) : (
                            <Bell className="w-3 h-3" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
