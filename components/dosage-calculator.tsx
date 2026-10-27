"use client"

import { useState, useMemo } from "react"
import {
  Calculator,
  Search,
  Pill,
  Scale,
  Baby,
  User,
  Users,
  AlertTriangle,
  Info,
  RotateCcw,
  BookOpen,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { mockDrugs } from "@/lib/mock-data"
import type { Drug } from "@/lib/types"

// Extended dosage database
const dosageDatabase: Record<
  string,
  {
    pediatric?: {
      formula: string
      dosePerKg: number
      unit: string
      frequency: string
      maxDose: number
      minAge: number
      maxAge: number
      notes?: string
    }
    adult?: {
      standardDose: number
      unit: string
      frequency: string
      maxDailyDose: number
      notes?: string
    }
    renalAdjustment?: string
    hepaticAdjustment?: string
    pregnancyCategory?: string
    contraindications?: string[]
  }
> = {
  باراسيتامول: {
    pediatric: {
      formula: "10-15 مجم/كجم",
      dosePerKg: 15,
      unit: "مجم",
      frequency: "كل 4-6 ساعات",
      maxDose: 75,
      minAge: 0,
      maxAge: 12,
      notes: "لا يتجاوز 5 جرعات في 24 ساعة",
    },
    adult: {
      standardDose: 1000,
      unit: "مجم",
      frequency: "كل 4-6 ساعات",
      maxDailyDose: 4000,
      notes: "لا يتجاوز 4 جرام يوميًا",
    },
    renalAdjustment: "CrCl < 10: إطالة الفترة إلى كل 8 ساعات",
    hepaticAdjustment: "تجنب في حالات أمراض الكبد الحادة",
    pregnancyCategory: "B",
  },
  أموكسيسيلين: {
    pediatric: {
      formula: "25-50 مجم/كجم/يوم",
      dosePerKg: 40,
      unit: "مجم",
      frequency: "مقسمة على 3 جرعات",
      maxDose: 100,
      minAge: 0,
      maxAge: 12,
      notes: "للعدوى الشديدة: 80-100 مجم/كجم/يوم",
    },
    adult: {
      standardDose: 500,
      unit: "مجم",
      frequency: "كل 8 ساعات",
      maxDailyDose: 3000,
      notes: "يمكن زيادتها إلى 1000 مجم للعدوى الشديدة",
    },
    renalAdjustment: "CrCl 10-30: كل 12 ساعة | CrCl < 10: كل 24 ساعة",
    pregnancyCategory: "B",
    contraindications: ["حساسية البنسلين", "كريات الدم البيضاء المعدية"],
  },
  ميتفورمين: {
    adult: {
      standardDose: 500,
      unit: "مجم",
      frequency: "مرتين يوميًا مع الطعام",
      maxDailyDose: 2550,
      notes: "البدء بجرعة منخفضة وزيادتها تدريجيًا",
    },
    renalAdjustment: "CrCl 30-45: تقليل الجرعة | CrCl < 30: ممنوع الاستخدام",
    hepaticAdjustment: "تجنب في أمراض الكبد الحادة",
    pregnancyCategory: "B",
    contraindications: ["الحماض الكيتوني", "فشل كلوي حاد", "فشل قلبي حاد"],
  },
  بيسوبرولول: {
    adult: {
      standardDose: 5,
      unit: "مجم",
      frequency: "مرة واحدة يوميًا",
      maxDailyDose: 20,
      notes: "البدء بـ 2.5 مجم في حالات فشل القلب",
    },
    renalAdjustment: "CrCl < 20: الحد الأقصى 10 مجم يوميًا",
    hepaticAdjustment: "فشل كبدي حاد: الحد الأقصى 10 مجم",
    pregnancyCategory: "C",
    contraindications: ["بطء القلب الشديد", "الربو غير المسيطر عليه", "صدمة قلبية"],
  },
  سيتريزين: {
    pediatric: {
      formula: "0.25 مجم/كجم",
      dosePerKg: 0.25,
      unit: "مجم",
      frequency: "مرة واحدة يوميًا",
      maxDose: 10,
      minAge: 2,
      maxAge: 12,
      notes: "2-6 سنوات: 2.5-5 مجم | 6-12 سنة: 5-10 مجم",
    },
    adult: {
      standardDose: 10,
      unit: "مجم",
      frequency: "مرة واحدة يوميًا",
      maxDailyDose: 10,
    },
    renalAdjustment: "CrCl < 30: 5 مجم يوميًا",
    pregnancyCategory: "B",
  },
  سالبوتامول: {
    pediatric: {
      formula: "0.1 مجم/كجم",
      dosePerKg: 0.1,
      unit: "مجم",
      frequency: "كل 4-6 ساعات عند الحاجة",
      maxDose: 8,
      minAge: 0,
      maxAge: 12,
      notes: "بخاخ: 1-2 بخة | رذاذ: 2.5-5 مجم",
    },
    adult: {
      standardDose: 2,
      unit: "بخة",
      frequency: "كل 4-6 ساعات عند الحاجة",
      maxDailyDose: 8,
      notes: "لا يتجاوز 8 بخات في 24 ساعة",
    },
    pregnancyCategory: "C",
    contraindications: ["حساسية للسالبوتامول", "عدم انتظام ضربات القلب غير المسيطر عليه"],
  },
}

type AgeGroup = "infant" | "child" | "adult" | "elderly"

export function DosageCalculator() {
  const [activeTab, setActiveTab] = useState("calculator")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null)
  const [patientWeight, setPatientWeight] = useState<string>("")
  const [patientAge, setPatientAge] = useState<string>("")
  const [ageUnit, setAgeUnit] = useState<"years" | "months">("years")
  const [renalFunction, setRenalFunction] = useState<string>("normal")
  const [calculatedDose, setCalculatedDose] = useState<{
    dose: number
    unit: string
    frequency: string
    maxDaily: number
    warnings: string[]
  } | null>(null)

  const filteredDrugs = useMemo(() => {
    if (!searchQuery) return []
    return mockDrugs.filter(
      (d) =>
        d.nameAr.includes(searchQuery) ||
        d.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.activeIngredient.includes(searchQuery)
    )
  }, [searchQuery])

  const getAgeGroup = (age: number, unit: "years" | "months"): AgeGroup => {
    const ageInYears = unit === "months" ? age / 12 : age
    if (ageInYears < 1) return "infant"
    if (ageInYears < 12) return "child"
    if (ageInYears < 65) return "adult"
    return "elderly"
  }

  const handleSelectDrug = (drug: Drug) => {
    setSelectedDrug(drug)
    setSearchQuery("")
    setCalculatedDose(null)
  }

  const calculateDose = () => {
    if (!selectedDrug || !patientWeight || !patientAge) return

    const weight = parseFloat(patientWeight)
    const age = parseFloat(patientAge)
    const ageGroup = getAgeGroup(age, ageUnit)

    const dosageInfo = dosageDatabase[selectedDrug.activeIngredient]
    if (!dosageInfo) {
      setCalculatedDose({
        dose: 0,
        unit: "",
        frequency: "",
        maxDaily: 0,
        warnings: ["لا تتوفر معلومات جرعات لهذا الدواء في قاعدة البيانات"],
      })
      return
    }

    const warnings: string[] = []
    let dose = 0
    let unit = ""
    let frequency = ""
    let maxDaily = 0

    if (ageGroup === "infant" || ageGroup === "child") {
      if (dosageInfo.pediatric) {
        dose = Math.round(weight * dosageInfo.pediatric.dosePerKg)
        if (dose > dosageInfo.pediatric.maxDose * weight) {
          dose = dosageInfo.pediatric.maxDose * weight
          warnings.push("تم تحديد الجرعة بالحد الأقصى المسموح")
        }
        unit = dosageInfo.pediatric.unit
        frequency = dosageInfo.pediatric.frequency
        maxDaily = dosageInfo.pediatric.maxDose * weight

        if (dosageInfo.pediatric.notes) {
          warnings.push(dosageInfo.pediatric.notes)
        }
      } else {
        warnings.push("هذا الدواء غير معتمد للأطفال")
      }
    } else {
      if (dosageInfo.adult) {
        dose = dosageInfo.adult.standardDose
        unit = dosageInfo.adult.unit
        frequency = dosageInfo.adult.frequency
        maxDaily = dosageInfo.adult.maxDailyDose

        if (dosageInfo.adult.notes) {
          warnings.push(dosageInfo.adult.notes)
        }
      }
    }

    // Renal adjustment warnings
    if (renalFunction !== "normal" && dosageInfo.renalAdjustment) {
      warnings.push(`تعديل الجرعة الكلوية: ${dosageInfo.renalAdjustment}`)
    }

    // Elderly warnings
    if (ageGroup === "elderly") {
      warnings.push("كبار السن: يفضل البدء بجرعات أقل ومراقبة التحمل")
    }

    // Controlled drug warning
    if (selectedDrug.requiresYellowPrescription) {
      warnings.push("هذا دواء مقيد يتطلب وصفة صفراء")
    }

    setCalculatedDose({ dose, unit, frequency, maxDaily, warnings })
  }

  const resetCalculator = () => {
    setSelectedDrug(null)
    setPatientWeight("")
    setPatientAge("")
    setRenalFunction("normal")
    setCalculatedDose(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Calculator className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">حاسبة الجرعات الدوائية</h2>
          <p className="text-sm text-muted-foreground">
            احسب الجرعة المناسبة بناءً على وزن وعمر المريض
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="calculator" className="gap-2">
            <Calculator className="w-4 h-4" />
            الحاسبة
          </TabsTrigger>
          <TabsTrigger value="reference" className="gap-2">
            <BookOpen className="w-4 h-4" />
            مرجع الجرعات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Drug Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Pill className="w-4 h-4" />
                  اختيار الدواء
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="بحث بالاسم أو المادة الفعالة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>

                {searchQuery && filteredDrugs.length > 0 && (
                  <div className="border rounded-lg divide-y max-h-48 overflow-auto">
                    {filteredDrugs.map((drug) => (
                      <div
                        key={drug.id}
                        className="p-3 hover:bg-muted cursor-pointer flex items-center justify-between"
                        onClick={() => handleSelectDrug(drug)}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{drug.nameAr}</span>
                            {drug.requiresYellowPrescription && (
                              <Badge
                                variant="outline"
                                className="bg-yellow-50 text-yellow-700 text-xs"
                              >
                                مقيد
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {drug.activeIngredient} - {drug.strength}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedDrug && (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{selectedDrug.nameAr}</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedDrug.activeIngredient}
                          </p>
                          <p className="text-sm">{selectedDrug.strength}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={resetCalculator}>
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* Patient Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="w-4 h-4" />
                  بيانات المريض
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <Scale className="w-3 h-3" />
                      الوزن (كجم)
                    </Label>
                    <Input
                      type="number"
                      placeholder="70"
                      value={patientWeight}
                      onChange={(e) => setPatientWeight(e.target.value)}
                      min={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      العمر
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="25"
                        value={patientAge}
                        onChange={(e) => setPatientAge(e.target.value)}
                        min={0}
                        className="flex-1"
                      />
                      <Select
                        value={ageUnit}
                        onValueChange={(v) => setAgeUnit(v as "years" | "months")}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="years">سنة</SelectItem>
                          <SelectItem value="months">شهر</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>وظائف الكلى</Label>
                  <Select value={renalFunction} onValueChange={setRenalFunction}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">طبيعية (CrCl &gt; 60)</SelectItem>
                      <SelectItem value="mild">قصور خفيف (CrCl 30-60)</SelectItem>
                      <SelectItem value="moderate">قصور متوسط (CrCl 10-30)</SelectItem>
                      <SelectItem value="severe">قصور شديد (CrCl &lt; 10)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full"
                  onClick={calculateDose}
                  disabled={!selectedDrug || !patientWeight || !patientAge}
                >
                  <Calculator className="w-4 h-4 ml-2" />
                  حساب الجرعة
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          {calculatedDose && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="text-base">نتيجة حساب الجرعة</CardTitle>
                <CardDescription>
                  {selectedDrug?.nameAr} - {selectedDrug?.activeIngredient}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {calculatedDose.dose > 0 ? (
                  <>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-primary/10 rounded-lg">
                        <p className="text-3xl font-bold text-primary">
                          {calculatedDose.dose}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {calculatedDose.unit} / جرعة
                        </p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-lg font-medium">{calculatedDose.frequency}</p>
                        <p className="text-sm text-muted-foreground">التكرار</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-lg font-medium">
                          {calculatedDose.maxDaily} {calculatedDose.unit}
                        </p>
                        <p className="text-sm text-muted-foreground">الحد الأقصى اليومي</p>
                      </div>
                    </div>

                    {calculatedDose.warnings.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          {calculatedDose.warnings.map((warning, index) => (
                            <Alert
                              key={index}
                              variant={
                                warning.includes("مقيد") || warning.includes("ممنوع")
                                  ? "destructive"
                                  : "default"
                              }
                            >
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>{warning}</AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>تنبيه</AlertTitle>
                    <AlertDescription>
                      {calculatedDose.warnings[0]}
                    </AlertDescription>
                  </Alert>
                )}

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    هذه الحاسبة للاسترشاد فقط. يجب دائمًا مراجعة الجرعة مع المراجع الطبية
                    المعتمدة والتأكد من ملاءمتها للحالة السريرية للمريض.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reference" className="space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="بحث في مرجع الجرعات..." className="pr-10" />
          </div>

          <div className="space-y-3">
            {Object.entries(dosageDatabase).map(([drugName, info]) => (
              <Collapsible key={drugName}>
                <Card>
                  <CollapsibleTrigger className="w-full">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          <Pill className="w-4 h-4" />
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{drugName}</p>
                          <div className="flex gap-2 mt-1">
                            {info.pediatric && (
                              <Badge variant="outline" className="text-xs">
                                <Baby className="w-3 h-3 ml-1" />
                                أطفال
                              </Badge>
                            )}
                            {info.adult && (
                              <Badge variant="outline" className="text-xs">
                                <User className="w-3 h-3 ml-1" />
                                بالغين
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4" />
                    </CardContent>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-4">
                      <Separator />

                      {info.pediatric && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="font-medium flex items-center gap-2 mb-2">
                            <Baby className="w-4 h-4" />
                            جرعة الأطفال
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">الجرعة: </span>
                              {info.pediatric.formula}
                            </div>
                            <div>
                              <span className="text-muted-foreground">التكرار: </span>
                              {info.pediatric.frequency}
                            </div>
                            <div>
                              <span className="text-muted-foreground">الحد الأقصى: </span>
                              {info.pediatric.maxDose} {info.pediatric.unit}/كجم/يوم
                            </div>
                            <div>
                              <span className="text-muted-foreground">العمر: </span>
                              {info.pediatric.minAge}-{info.pediatric.maxAge} سنة
                            </div>
                          </div>
                          {info.pediatric.notes && (
                            <p className="text-xs text-muted-foreground mt-2">
                              ملاحظة: {info.pediatric.notes}
                            </p>
                          )}
                        </div>
                      )}

                      {info.adult && (
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="font-medium flex items-center gap-2 mb-2">
                            <User className="w-4 h-4" />
                            جرعة البالغين
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">الجرعة: </span>
                              {info.adult.standardDose} {info.adult.unit}
                            </div>
                            <div>
                              <span className="text-muted-foreground">التكرار: </span>
                              {info.adult.frequency}
                            </div>
                            <div>
                              <span className="text-muted-foreground">الحد الأقصى: </span>
                              {info.adult.maxDailyDose} {info.adult.unit}/يوم
                            </div>
                          </div>
                          {info.adult.notes && (
                            <p className="text-xs text-muted-foreground mt-2">
                              ملاحظة: {info.adult.notes}
                            </p>
                          )}
                        </div>
                      )}

                      {(info.renalAdjustment || info.hepaticAdjustment) && (
                        <div className="p-3 bg-amber-50 rounded-lg">
                          <p className="font-medium mb-2">تعديلات الجرعة</p>
                          <div className="space-y-1 text-sm">
                            {info.renalAdjustment && (
                              <p>
                                <span className="text-muted-foreground">الكلى: </span>
                                {info.renalAdjustment}
                              </p>
                            )}
                            {info.hepaticAdjustment && (
                              <p>
                                <span className="text-muted-foreground">الكبد: </span>
                                {info.hepaticAdjustment}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {info.contraindications && info.contraindications.length > 0 && (
                        <div className="p-3 bg-red-50 rounded-lg">
                          <p className="font-medium text-red-800 mb-2">موانع الاستعمال</p>
                          <ul className="text-sm text-red-700 list-disc list-inside">
                            {info.contraindications.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {info.pregnancyCategory && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">فئة الحمل:</span>
                          <Badge variant="outline">{info.pregnancyCategory}</Badge>
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
