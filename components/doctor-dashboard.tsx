"use client"

import { useState, useMemo } from "react"
import {
  FileText,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  Calendar,
  Pill,
  MapPin,
  Building2,
  Eye,
  Filter,
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/auth-context"
import { mockPrescriptions, mockPatients } from "@/lib/mock-data"
import type { Prescription, PrescriptionStatus } from "@/lib/types"
import { NewPrescriptionForm } from "./new-prescription-form"
import { PrescriptionDetails } from "./prescription-details"

const statusConfig: Record<
  PrescriptionStatus,
  { label: string; color: string; icon: typeof Clock }
> = {
  pending: { label: "قيد الانتظار", color: "bg-amber-100 text-amber-800", icon: Clock },
  reserved: { label: "محجوز", color: "bg-blue-100 text-blue-800", icon: Building2 },
  dispensed: { label: "تم الصرف", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  expired: { label: "منتهي", color: "bg-gray-100 text-gray-800", icon: XCircle },
  cancelled: { label: "ملغي", color: "bg-red-100 text-red-800", icon: XCircle },
}

export function DoctorDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("prescriptions")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [showNewPrescription, setShowNewPrescription] = useState(false)

  // Filter prescriptions for this doctor
  const doctorPrescriptions = useMemo(() => {
    console.log("[v0] User:", user)
    console.log("[v0] All prescriptions:", mockPrescriptions)
    // For demo, show all prescriptions if user is doctor or hospital
    const filtered = mockPrescriptions.filter((p) => {
      const isDoctor = user?.role === "doctor" || user?.role === "hospital"
      return isDoctor
    })
    console.log("[v0] Filtered prescriptions:", filtered)
    return filtered
  }, [user])

  const filteredPrescriptions = useMemo(() => {
    return doctorPrescriptions.filter((prescription) => {
      const matchesSearch =
        prescription.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prescription.prescriptionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prescription.patient.nationalId.includes(searchQuery)

      const matchesStatus = statusFilter === "all" || prescription.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [doctorPrescriptions, searchQuery, statusFilter])

  // Statistics
  const stats = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return {
      total: doctorPrescriptions.length,
      pending: doctorPrescriptions.filter((p) => p.status === "pending").length,
      dispensed: doctorPrescriptions.filter((p) => p.status === "dispensed").length,
      todayCount: doctorPrescriptions.filter((p) => {
        const prescDate = new Date(p.createdAt)
        prescDate.setHours(0, 0, 0, 0)
        return prescDate.getTime() === today.getTime()
      }).length,
      yellowPrescriptions: doctorPrescriptions.filter((p) => p.type === "yellow").length,
    }
  }, [doctorPrescriptions])

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

    if (diff <= 0) return "منتهية الصلاحية"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) return `${hours} ساعة و ${minutes} دقيقة`
    return `${minutes} دقيقة`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {user?.role === "hospital" ? "لوحة تحكم المستشفى" : "لوحة تحكم الطبيب"}
          </h2>
          <p className="text-muted-foreground">مرحباً، {user?.name}</p>
        </div>
        <Dialog open={showNewPrescription} onOpenChange={setShowNewPrescription}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              وصفة طبية جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>إنشاء وصفة طبية جديدة</DialogTitle>
              <DialogDescription>
                أدخل بيانات المريض والأدوية المطلوبة
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh]">
              <NewPrescriptionForm onClose={() => setShowNewPrescription(false)} />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">إجمالي الوصفات</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">قيد الانتظار</p>
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
                <p className="text-2xl font-bold">{stats.dispensed}</p>
                <p className="text-xs text-muted-foreground">تم الصرف</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.todayCount}</p>
                <p className="text-xs text-muted-foreground">اليوم</p>
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
            الوصفات الطبية
          </TabsTrigger>
          <TabsTrigger value="patients" className="gap-2">
            <User className="w-4 h-4" />
            المرضى
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
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="reserved">محجوز</SelectItem>
                <SelectItem value="dispensed">تم الصرف</SelectItem>
                <SelectItem value="expired">منتهي</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
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
                return (
                  <Card
                    key={prescription.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      prescription.type === "yellow" ? "border-yellow-400 border-2" : ""
                    }`}
                    onClick={() => setSelectedPrescription(prescription)}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {prescription.patient.name}
                              </span>
                              {prescription.type === "yellow" && (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                                  وصفة صفراء
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {prescription.prescriptionNumber}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Pill className="w-3 h-3" />
                                {prescription.items.length} أدوية
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(prescription.createdAt)}
                              </span>
                              {prescription.pharmacyName && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {prescription.pharmacyName}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-left">
                            <Badge
                              className={`${statusConfig[prescription.status].color} gap-1`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig[prescription.status].label}
                            </Badge>
                            {prescription.status === "pending" && (
                              <p className="text-xs text-muted-foreground mt-1">
                                ينتهي خلال: {getTimeRemaining(prescription.expiresAt)}
                              </p>
                            )}
                          </div>
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="بحث عن مريض..." className="pr-10" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {mockPatients.map((patient) => (
              <Card key={patient.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">
                        الهوية: {patient.nationalId}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {patient.phone}
                      </p>
                      {patient.allergies && patient.allergies.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-red-600">
                          <AlertTriangle className="w-3 h-3" />
                          حساسية: {patient.allergies.join("، ")}
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setShowNewPrescription(true)
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Prescription Details Dialog */}
      <Dialog
        open={!!selectedPrescription}
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
    </div>
  )
}
