"use client"

import { useState } from "react"
import { Search, Stethoscope, Loader2, MapPin, Phone, Star, Clock, GraduationCap, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface Doctor {
  name: string
  specialty: string
  subSpecialty?: string
  hospital: string
  address: string
  phone: string
  rating: number
  reviewsCount: number
  experience: string
  education: string
  consultationFee: string
  availableDays: string[]
  workingHours: string
}

interface DoctorSearchResult {
  doctors: Doctor[]
  totalFound: number
  city: string
  specialty: string
}

const countries = [
  { value: "egypt", label: "مصر" },
  { value: "saudi", label: "السعودية" },
  { value: "uae", label: "الإمارات" },
  { value: "jordan", label: "الأردن" },
  { value: "kuwait", label: "الكويت" },
]

const citiesByCountry: Record<string, { value: string; label: string }[]> = {
  egypt: [
    { value: "cairo", label: "القاهرة" },
    { value: "giza", label: "الجيزة" },
    { value: "alexandria", label: "الإسكندرية" },
    { value: "mansoura", label: "المنصورة" },
    { value: "tanta", label: "طنطا" },
    { value: "aswan", label: "أسوان" },
    { value: "luxor", label: "الأقصر" },
    { value: "sharm", label: "شرم الشيخ" },
  ],
  saudi: [
    { value: "riyadh", label: "الرياض" },
    { value: "jeddah", label: "جدة" },
    { value: "mecca", label: "مكة المكرمة" },
    { value: "medina", label: "المدينة المنورة" },
    { value: "dammam", label: "الدمام" },
    { value: "khobar", label: "الخبر" },
  ],
  uae: [
    { value: "dubai", label: "دبي" },
    { value: "abudhabi", label: "أبوظبي" },
    { value: "sharjah", label: "الشارقة" },
    { value: "ajman", label: "عجمان" },
  ],
  jordan: [
    { value: "amman", label: "عمّان" },
    { value: "irbid", label: "إربد" },
    { value: "zarqa", label: "الزرقاء" },
    { value: "aqaba", label: "العقبة" },
  ],
  kuwait: [
    { value: "kuwait_city", label: "مدينة الكويت" },
    { value: "hawalli", label: "حولي" },
    { value: "salmiya", label: "السالمية" },
  ],
}

const specialties = [
  { value: "عام", label: "طب عام" },
  { value: "باطنة", label: "الباطنة" },
  { value: "قلب", label: "القلب والأوعية الدموية" },
  { value: "أطفال", label: "طب الأطفال" },
  { value: "نساء وتوليد", label: "النساء والتوليد" },
  { value: "عظام", label: "جراحة العظام" },
  { value: "جلدية", label: "الأمراض الجلدية" },
  { value: "عيون", label: "طب وجراحة العيون" },
  { value: "أنف وأذن", label: "الأنف والأذن والحنجرة" },
  { value: "أسنان", label: "طب الأسنان" },
  { value: "نفسية", label: "الطب النفسي" },
  { value: "مخ وأعصاب", label: "المخ والأعصاب" },
  { value: "جراحة عامة", label: "الجراحة العامة" },
  { value: "مسالك بولية", label: "المسالك البولية" },
  { value: "تغذية", label: "التغذية العلاجية" },
  { value: "علاج طبيعي", label: "العلاج الطبيعي" },
]

export function DoctorSearch() {
  const [country, setCountry] = useState("egypt")
  const [city, setCity] = useState("")
  const [specialty, setSpecialty] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<DoctorSearchResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const cities = citiesByCountry[country] || []

  const handleSearch = async () => {
    if (!city || !specialty) return

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const cityLabel = cities.find((c) => c.value === city)?.label || city
      const specialtyLabel = specialties.find((s) => s.value === specialty)?.label || specialty

      const response = await fetch("/api/search-doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: cityLabel, specialty: specialtyLabel, country }),
      })

      if (!response.ok) {
        throw new Error("فشل في البحث، يرجى المحاولة مرة أخرى")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCountryChange = (value: string) => {
    setCountry(value)
    setCity("")
    setResult(null)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
          />
        ))}
        <span className="text-sm text-muted-foreground mr-1">({rating.toFixed(1)})</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">البلد</label>
              <Select value={country} onValueChange={handleCountryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر البلد" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">المدينة</label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المدينة" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">التخصص</label>
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر التخصص" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleSearch} disabled={isLoading || !city || !specialty} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                جاري البحث...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 ml-2" />
                بحث عن أطباء
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6 text-center text-destructive">{error}</CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              أطباء {result.specialty} في {result.city}
            </h3>
            <Badge variant="secondary">{result.totalFound} طبيب</Badge>
          </div>

          <div className="grid gap-4">
            {result.doctors.map((doctor, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Doctor Avatar */}
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="w-8 h-8 text-primary" />
                    </div>

                    {/* Doctor Info */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h4 className="text-xl font-bold text-foreground">{doctor.name}</h4>
                        <p className="text-primary font-medium">{doctor.specialty}</p>
                        {doctor.subSpecialty && <p className="text-sm text-muted-foreground">{doctor.subSpecialty}</p>}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        {renderStars(doctor.rating)}
                        <span className="text-sm text-muted-foreground">({doctor.reviewsCount} تقييم)</span>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span>{doctor.hospital}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{doctor.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span dir="ltr">{doctor.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{doctor.workingHours}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-muted-foreground" />
                          <span>{doctor.experience} خبرة</span>
                        </div>
                      </div>

                      {/* Available Days */}
                      <div className="flex flex-wrap gap-2">
                        {doctor.availableDays.map((day, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {day}
                          </Badge>
                        ))}
                      </div>

                      {/* Fee & Actions */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div>
                          <span className="text-sm text-muted-foreground">سعر الكشف: </span>
                          <span className="font-bold text-primary">{doctor.consultationFee}</span>
                        </div>
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4 ml-2" />
                          اتصل الآن
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <Stethoscope className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">ابحث عن طبيب</h3>
            <p className="text-sm text-muted-foreground">اختر المدينة والتخصص للعثور على أفضل الأطباء في منطقتك</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
