"use client"

import { useState } from "react"
import {
  Search,
  Plus,
  Trash2,
  AlertTriangle,
  User,
  MapPin,
  Building2,
  CheckCircle2,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { mockPatients, mockDrugs, mockPharmacies, findNearestPharmacies } from "@/lib/mock-data"
import { useAuth } from "@/contexts/auth-context"
import type { Patient, Drug, Pharmacy, PrescriptionItem } from "@/lib/types"

interface NewPrescriptionFormProps {
  onClose: () => void
}

export function NewPrescriptionForm({ onClose }: NewPrescriptionFormProps) {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [searchPatient, setSearchPatient] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [searchDrug, setSearchDrug] = useState("")
  const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([])
  const [diagnosis, setDiagnosis] = useState("")
  const [notes, setNotes] = useState("")
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null)
  const [usePatientLocation, setUsePatientLocation] = useState(true)
  const [nearbyPharmacies, setNearbyPharmacies] = useState<Pharmacy[]>([])
  const [isYellowPrescription, setIsYellowPrescription] = useState(false)

  // Filter patients by search
  const filteredPatients = mockPatients.filter(
    (p) =>
      p.name.includes(searchPatient) ||
      p.nationalId.includes(searchPatient) ||
      p.phone.includes(searchPatient)
  )

  // Filter drugs by search
  const filteredDrugs = mockDrugs.filter(
    (d) =>
      d.nameAr.includes(searchDrug) ||
      d.nameEn.toLowerCase().includes(searchDrug.toLowerCase()) ||
      d.activeIngredient.includes(searchDrug)
  )

  // Check if any drug requires yellow prescription
  const hasControlledDrug = prescriptionItems.some((item) => item.isControlled)

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    if (patient.location) {
      const nearest = findNearestPharmacies(
        patient.location.lat,
        patient.location.lng,
        5
      )
      setNearbyPharmacies(nearest)
    }
    setStep(2)
  }

  const handleAddDrug = (drug: Drug) => {
    if (prescriptionItems.find((item) => item.drugId === drug.id)) {
      return
    }

    const newItem: PrescriptionItem = {
      drugId: drug.id,
      drugName: `${drug.nameAr} ${drug.strength}`,
      activeIngredient: drug.activeIngredient,
      dosage: drug.strength,
      frequency: "",
      duration: "",
      quantity: 1,
      instructions: "",
      isControlled: drug.isControlled,
    }

    setPrescriptionItems([...prescriptionItems, newItem])
    setSearchDrug("")

    if (drug.requiresYellowPrescription) {
      setIsYellowPrescription(true)
    }
  }

  const handleUpdateItem = (
    index: number,
    field: keyof PrescriptionItem,
    value: string | number
  ) => {
    const updated = [...prescriptionItems]
    updated[index] = { ...updated[index], [field]: value }
    setPrescriptionItems(updated)
  }

  const handleRemoveItem = (index: number) => {
    const updated = prescriptionItems.filter((_, i) => i !== index)
    setPrescriptionItems(updated)

    // Check if we still need yellow prescription
    const stillHasControlled = updated.some((item) => item.isControlled)
    if (!stillHasControlled) {
      setIsYellowPrescription(false)
    }
  }

  const handleSubmit = () => {
    // In real app, this would send to API
    console.log({
      patient: selectedPatient,
      items: prescriptionItems,
      diagnosis,
      notes,
      pharmacy: selectedPharmacy,
      isYellowPrescription,
      doctor: user,
    })
    onClose()
  }

  return (
    <div className="space-y-6 p-1">
      {/* Progress Steps */}
      <div className="flex items-center justify-between px-4">
        {[
          { num: 1, label: "المريض" },
          { num: 2, label: "الأدوية" },
          { num: 3, label: "الصيدلية" },
          { num: 4, label: "تأكيد" },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                step >= s.num
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
            </div>
            <span className="text-xs text-muted-foreground mr-2 hidden sm:inline">
              {s.label}
            </span>
            {i < 3 && (
              <div
                className={`w-8 sm:w-16 h-0.5 mx-2 ${
                  step > s.num ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select Patient */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="بحث بالاسم أو رقم الهوية أو رقم الجوال..."
              value={searchPatient}
              onChange={(e) => setSearchPatient(e.target.value)}
              className="pr-10"
            />
          </div>

          <div className="space-y-2">
            {filteredPatients.map((patient) => (
              <Card
                key={patient.id}
                className={`cursor-pointer transition-all hover:border-primary ${
                  selectedPatient?.id === patient.id ? "border-primary" : ""
                }`}
                onClick={() => handleSelectPatient(patient)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">
                        الهوية: {patient.nationalId} | {patient.phone}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {patient.address}
                      </p>
                      {patient.allergies && patient.allergies.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                          <AlertTriangle className="w-3 h-3" />
                          حساسية: {patient.allergies.join("، ")}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Add Medications */}
      {step === 2 && selectedPatient && (
        <div className="space-y-4">
          {/* Patient Info Banner */}
          <Alert>
            <User className="h-4 w-4" />
            <AlertDescription>
              <span className="font-medium">{selectedPatient.name}</span> -{" "}
              {selectedPatient.nationalId}
              {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                <span className="text-red-600 mr-2">
                  | حساسية: {selectedPatient.allergies.join("، ")}
                </span>
              )}
            </AlertDescription>
          </Alert>

          {isYellowPrescription && (
            <Alert className="border-yellow-400 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                هذه الوصفة تحتوي على أدوية مقيدة وستكون <strong>وصفة صفراء</strong>
              </AlertDescription>
            </Alert>
          )}

          {/* Drug Search */}
          <div className="space-y-2">
            <Label>إضافة دواء</Label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم التجاري أو المادة الفعالة..."
                value={searchDrug}
                onChange={(e) => setSearchDrug(e.target.value)}
                className="pr-10"
              />
            </div>

            {searchDrug && (
              <div className="border rounded-lg divide-y max-h-48 overflow-auto">
                {filteredDrugs.map((drug) => (
                  <div
                    key={drug.id}
                    className="p-3 hover:bg-muted cursor-pointer flex items-center justify-between"
                    onClick={() => handleAddDrug(drug)}
                  >
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
                    <div className="text-left">
                      <p className="text-sm font-medium">{drug.price} ر.س</p>
                      <p className="text-xs text-muted-foreground">
                        متوفر: {drug.stockQuantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Added Medications */}
          {prescriptionItems.length > 0 && (
            <div className="space-y-3">
              <Label>الأدوية المضافة ({prescriptionItems.length})</Label>
              {prescriptionItems.map((item, index) => (
                <Card key={item.drugId} className={item.isControlled ? "border-yellow-400" : ""}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.drugName}</span>
                        {item.isControlled && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                            مقيد
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <Label className="text-xs">التكرار</Label>
                        <Select
                          value={item.frequency}
                          onValueChange={(v) => handleUpdateItem(index, "frequency", v)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="اختر" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="مرة واحدة يوميًا">مرة واحدة يوميًا</SelectItem>
                            <SelectItem value="مرتين يوميًا">مرتين يوميًا</SelectItem>
                            <SelectItem value="3 مرات يوميًا">3 مرات يوميًا</SelectItem>
                            <SelectItem value="4 مرات يوميًا">4 مرات يوميًا</SelectItem>
                            <SelectItem value="كل 4 ساعات">كل 4 ساعات</SelectItem>
                            <SelectItem value="كل 6 ساعات">كل 6 ساعات</SelectItem>
                            <SelectItem value="كل 8 ساعات">كل 8 ساعات</SelectItem>
                            <SelectItem value="عند الحاجة">عند الحاجة</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs">المدة</Label>
                        <Select
                          value={item.duration}
                          onValueChange={(v) => handleUpdateItem(index, "duration", v)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="اختر" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3 أيام">3 أيام</SelectItem>
                            <SelectItem value="5 أيام">5 أيام</SelectItem>
                            <SelectItem value="7 أيام">7 أيام</SelectItem>
                            <SelectItem value="10 أيام">10 أيام</SelectItem>
                            <SelectItem value="14 يوم">14 يوم</SelectItem>
                            <SelectItem value="21 يوم">21 يوم</SelectItem>
                            <SelectItem value="30 يوم">30 يوم</SelectItem>
                            <SelectItem value="حسب الحاجة">حسب الحاجة</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs">الكمية</Label>
                        <Input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateItem(index, "quantity", parseInt(e.target.value) || 1)
                          }
                          className="h-9"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">تعليمات</Label>
                        <Input
                          placeholder="مع الطعام..."
                          value={item.instructions}
                          onChange={(e) =>
                            handleUpdateItem(index, "instructions", e.target.value)
                          }
                          className="h-9"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Diagnosis */}
          <div className="space-y-2">
            <Label>التشخيص</Label>
            <Textarea
              placeholder="أدخل التشخيص الطبي..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>ملاحظات إضافية</Label>
            <Textarea
              placeholder="أي ملاحظات للصيدلي..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>
              السابق
            </Button>
            <Button
              className="flex-1"
              onClick={() => setStep(3)}
              disabled={prescriptionItems.length === 0 || !diagnosis}
            >
              التالي - اختيار الصيدلية
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Select Pharmacy */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="useLocation"
              checked={usePatientLocation}
              onCheckedChange={(checked) => setUsePatientLocation(!!checked)}
            />
            <Label htmlFor="useLocation">استخدام موقع المريض لتحديد أقرب صيدلية</Label>
          </div>

          {usePatientLocation && selectedPatient?.location && (
            <Alert>
              <MapPin className="h-4 w-4" />
              <AlertDescription>
                موقع المريض: {selectedPatient.location.area}، {selectedPatient.location.city}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>اختر الصيدلية</Label>
            {(usePatientLocation ? nearbyPharmacies : mockPharmacies).map((pharmacy) => (
              <Card
                key={pharmacy.id}
                className={`cursor-pointer transition-all hover:border-primary ${
                  selectedPharmacy?.id === pharmacy.id ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => setSelectedPharmacy(pharmacy)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{pharmacy.name}</span>
                          {pharmacy.isOpen ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                              مفتوح
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700 text-xs">
                              مغلق
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{pharmacy.address}</p>
                        <p className="text-xs text-muted-foreground">
                          ساعات العمل: {pharmacy.openingHours} | {pharmacy.phone}
                        </p>
                      </div>
                    </div>
                    {selectedPharmacy?.id === pharmacy.id && (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              سيتم حجز الأدوية في الصيدلية المختارة لمدة <strong>24 ساعة</strong> من الآن
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(2)}>
              السابق
            </Button>
            <Button
              className="flex-1"
              onClick={() => setStep(4)}
              disabled={!selectedPharmacy}
            >
              التالي - مراجعة وتأكيد
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && selectedPatient && selectedPharmacy && (
        <div className="space-y-4">
          {isYellowPrescription && (
            <Alert className="border-yellow-400 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                هذه <strong>وصفة صفراء</strong> تحتوي على أدوية مقيدة. سيتم التحقق من هوية المريض عند الصرف.
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">بيانات المريض</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>الاسم:</strong> {selectedPatient.name}</p>
              <p><strong>رقم الهوية:</strong> {selectedPatient.nationalId}</p>
              <p><strong>الجوال:</strong> {selectedPatient.phone}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">الأدوية ({prescriptionItems.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {prescriptionItems.map((item) => (
                <div key={item.drugId} className="flex justify-between text-sm">
                  <span>
                    {item.drugName} {item.isControlled && "(مقيد)"}
                  </span>
                  <span className="text-muted-foreground">
                    {item.frequency} - {item.quantity} وحدة
                  </span>
                </div>
              ))}
              <Separator />
              <p><strong>التشخيص:</strong> {diagnosis}</p>
              {notes && <p><strong>ملاحظات:</strong> {notes}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">الصيدلية</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{selectedPharmacy.name}</p>
              <p className="text-sm text-muted-foreground">{selectedPharmacy.address}</p>
              <p className="text-sm text-muted-foreground">{selectedPharmacy.phone}</p>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(3)}>
              السابق
            </Button>
            <Button className="flex-1" onClick={handleSubmit}>
              <CheckCircle2 className="w-4 h-4 ml-2" />
              إرسال الوصفة
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
