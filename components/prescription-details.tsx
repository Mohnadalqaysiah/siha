"use client"

import {
  User,
  Calendar,
  Clock,
  Building2,
  Pill,
  MapPin,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Phone,
  CreditCard,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Prescription, PrescriptionStatus } from "@/lib/types"

interface PrescriptionDetailsProps {
  prescription: Prescription
}

const statusConfig: Record<
  PrescriptionStatus,
  { label: string; color: string }
> = {
  pending: { label: "قيد الانتظار", color: "bg-amber-100 text-amber-800" },
  reserved: { label: "محجوز", color: "bg-blue-100 text-blue-800" },
  dispensed: { label: "تم الصرف", color: "bg-green-100 text-green-800" },
  expired: { label: "منتهي", color: "bg-gray-100 text-gray-800" },
  cancelled: { label: "ملغي", color: "bg-red-100 text-red-800" },
}

export function PrescriptionDetails({ prescription }: PrescriptionDetailsProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "long",
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
    <div className="space-y-4 p-1">
      {/* Header with Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              prescription.type === "yellow" ? "bg-yellow-100" : "bg-primary/10"
            }`}
          >
            <FileText
              className={`w-6 h-6 ${
                prescription.type === "yellow" ? "text-yellow-600" : "text-primary"
              }`}
            />
          </div>
          <div>
            <p className="font-bold text-lg">{prescription.prescriptionNumber}</p>
            <div className="flex items-center gap-2">
              <Badge className={statusConfig[prescription.status].color}>
                {statusConfig[prescription.status].label}
              </Badge>
              {prescription.type === "yellow" && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-400">
                  وصفة صفراء
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Yellow Prescription Warning */}
      {prescription.type === "yellow" && (
        <Card className="border-yellow-400 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">وصفة صفراء - أدوية مقيدة</p>
                <p className="text-sm text-yellow-700">
                  يجب التحقق من هوية المريض الوطنية قبل الصرف. هذه الوصفة تحتوي على أدوية خاضعة للرقابة.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patient Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4" />
            بيانات المريض
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">الاسم</p>
              <p className="font-medium">{prescription.patient.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">رقم الهوية</p>
              <p className="font-medium flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                {prescription.patient.nationalId}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">الجوال</p>
              <p className="font-medium flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {prescription.patient.phone}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">العنوان</p>
              <p className="font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {prescription.patient.address}
              </p>
            </div>
          </div>
          {prescription.patient.allergies && prescription.patient.allergies.length > 0 && (
            <>
              <Separator />
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">حساسية: {prescription.patient.allergies.join("، ")}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Medications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Pill className="w-4 h-4" />
            الأدوية ({prescription.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {prescription.items.map((item, index) => (
            <div
              key={item.drugId}
              className={`p-3 rounded-lg border ${
                item.isControlled ? "border-yellow-400 bg-yellow-50" : "bg-muted/50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.drugName}</span>
                    {item.isControlled && (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-700 text-xs">
                        مقيد
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{item.activeIngredient}</p>
                </div>
                <Badge variant="secondary">{item.quantity} وحدة</Badge>
              </div>
              <Separator className="my-2" />
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">الجرعة</p>
                  <p>{item.dosage}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">التكرار</p>
                  <p>{item.frequency}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">المدة</p>
                  <p>{item.duration}</p>
                </div>
              </div>
              {item.instructions && (
                <p className="text-xs text-muted-foreground mt-2 bg-background p-2 rounded">
                  تعليمات: {item.instructions}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Diagnosis & Notes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">التشخيص والملاحظات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-xs text-muted-foreground">التشخيص</p>
            <p>{prescription.diagnosis}</p>
          </div>
          {prescription.notes && (
            <div>
              <p className="text-xs text-muted-foreground">ملاحظات</p>
              <p className="text-sm">{prescription.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Doctor & Pharmacy Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4" />
              الطبيب
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{prescription.doctorName}</p>
            {prescription.hospitalName && (
              <p className="text-sm text-muted-foreground">{prescription.hospitalName}</p>
            )}
          </CardContent>
        </Card>

        {prescription.pharmacyName && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                الصيدلية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{prescription.pharmacyName}</p>
              <Badge
                className={
                  prescription.status === "dispensed"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }
              >
                {prescription.status === "dispensed" ? "تم الصرف" : "محجوز"}
              </Badge>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Timestamps */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4" />
            التواريخ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">تاريخ الإنشاء</p>
              <p className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(prescription.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">تاريخ الانتهاء</p>
              <p className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(prescription.expiresAt)}
              </p>
            </div>
            {prescription.status === "pending" && (
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">الوقت المتبقي</p>
                <p className="text-amber-600 font-medium">
                  {getTimeRemaining(prescription.expiresAt)}
                </p>
              </div>
            )}
            {prescription.reservedAt && (
              <div>
                <p className="text-xs text-muted-foreground">تاريخ الحجز</p>
                <p>{formatDate(prescription.reservedAt)}</p>
              </div>
            )}
            {prescription.dispensedAt && (
              <div>
                <p className="text-xs text-muted-foreground">تاريخ الصرف</p>
                <p className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="w-3 h-3" />
                  {formatDate(prescription.dispensedAt)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
