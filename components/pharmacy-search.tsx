"use client"

import { useState, useEffect } from "react"
import { MapPin, Phone, Clock, Navigation, Search, Star, Pill, Building2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// بيانات تجريبية للصيدليات
const pharmaciesData = [
  // مصر - القاهرة
  {
    id: "1",
    name: "صيدلية الدواء",
    country: "مصر",
    city: "القاهرة",
    area: "مدينة نصر",
    address: "شارع عباس العقاد، مدينة نصر",
    phone: "01012345678",
    phone2: "0222741234",
    rating: 4.8,
    reviews: 245,
    isOpen: true,
    hours: "24 ساعة",
    lat: 30.0511,
    lng: 31.3656,
    hasDelivery: true,
    drugs: ["باراسيتامول", "أموكسيسيلين", "أوميبرازول"],
  },
  {
    id: "2",
    name: "صيدليات العزبي",
    country: "مصر",
    city: "القاهرة",
    area: "المعادي",
    address: "شارع 9، المعادي",
    phone: "01098765432",
    phone2: "0223456789",
    rating: 4.6,
    reviews: 189,
    isOpen: true,
    hours: "8 ص - 12 م",
    lat: 29.9602,
    lng: 31.2569,
    hasDelivery: true,
    drugs: ["ديكلوفيناك", "أزيثروميسين", "بانتوبرازول"],
  },
  {
    id: "3",
    name: "صيدلية سيف",
    country: "مصر",
    city: "القاهرة",
    area: "الدقي",
    address: "شارع التحرير، الدقي",
    phone: "01234567890",
    phone2: "",
    rating: 4.5,
    reviews: 156,
    isOpen: false,
    hours: "9 ص - 11 م",
    lat: 30.038,
    lng: 31.2118,
    hasDelivery: true,
    drugs: ["لوسارتان", "ميتفورمين", "أتورفاستاتين"],
  },
  {
    id: "4",
    name: "صيدلية رشدي",
    country: "مصر",
    city: "الإسكندرية",
    area: "سموحة",
    address: "شارع فوزي معاذ، سموحة",
    phone: "01111222333",
    phone2: "034567890",
    rating: 4.7,
    reviews: 201,
    isOpen: true,
    hours: "24 ساعة",
    lat: 31.2156,
    lng: 29.9553,
    hasDelivery: true,
    drugs: ["سيتريزين", "مونتيلوكاست", "فلوكسيتين"],
  },
  // السعودية
  {
    id: "5",
    name: "صيدليات النهدي",
    country: "السعودية",
    city: "الرياض",
    area: "العليا",
    address: "طريق الملك فهد، العليا",
    phone: "0551234567",
    phone2: "0112345678",
    rating: 4.9,
    reviews: 523,
    isOpen: true,
    hours: "24 ساعة",
    lat: 24.7136,
    lng: 46.6753,
    hasDelivery: true,
    drugs: ["باراسيتامول", "أيبوبروفين", "أموكسيسيلين"],
  },
  {
    id: "6",
    name: "صيدليات الدواء",
    country: "السعودية",
    city: "الرياض",
    area: "الملز",
    address: "شارع الستين، الملز",
    phone: "0559876543",
    phone2: "",
    rating: 4.7,
    reviews: 312,
    isOpen: true,
    hours: "8 ص - 12 م",
    lat: 24.6748,
    lng: 46.7219,
    hasDelivery: true,
    drugs: ["أوميبرازول", "ديكلوفيناك", "سيتريزين"],
  },
  {
    id: "7",
    name: "صيدلية كيان",
    country: "السعودية",
    city: "جدة",
    area: "الحمراء",
    address: "شارع فلسطين، الحمراء",
    phone: "0561122334",
    phone2: "0126543210",
    rating: 4.6,
    reviews: 178,
    isOpen: true,
    hours: "9 ص - 11 م",
    lat: 21.5433,
    lng: 39.1728,
    hasDelivery: false,
    drugs: ["ميتفورمين", "لوسارتان", "أتورفاستاتين"],
  },
  // الإمارات
  {
    id: "8",
    name: "صيدلية الشفاء",
    country: "الإمارات",
    city: "دبي",
    area: "ديرة",
    address: "شارع الرقة، ديرة",
    phone: "0501234567",
    phone2: "042345678",
    rating: 4.8,
    reviews: 289,
    isOpen: true,
    hours: "24 ساعة",
    lat: 25.2697,
    lng: 55.3095,
    hasDelivery: true,
    drugs: ["باراسيتامول", "أموكسيسيلين", "بانتوبرازول"],
  },
  {
    id: "9",
    name: "صيدليات بن سينا",
    country: "الإمارات",
    city: "دبي",
    area: "البرشاء",
    address: "مول الإمارات، البرشاء",
    phone: "0509876543",
    phone2: "",
    rating: 4.9,
    reviews: 445,
    isOpen: true,
    hours: "10 ص - 10 م",
    lat: 25.1181,
    lng: 55.2006,
    hasDelivery: true,
    drugs: ["سيتريزين", "فلوكسيتين", "أزيثروميسين"],
  },
  {
    id: "10",
    name: "صيدلية الحياة",
    country: "الإمارات",
    city: "أبوظبي",
    area: "الخالدية",
    address: "شارع الخليج، الخالدية",
    phone: "0521122334",
    phone2: "026543210",
    rating: 4.5,
    reviews: 156,
    isOpen: false,
    hours: "8 ص - 10 م",
    lat: 24.4539,
    lng: 54.3773,
    hasDelivery: true,
    drugs: ["أيبوبروفين", "أوميبرازول", "ديكلوفيناك"],
  },
  // الأردن
  {
    id: "11",
    name: "صيدلية الحكمة",
    country: "الأردن",
    city: "عمان",
    area: "الشميساني",
    address: "شارع الملكة رانيا، الشميساني",
    phone: "0791234567",
    phone2: "065678901",
    rating: 4.7,
    reviews: 198,
    isOpen: true,
    hours: "24 ساعة",
    lat: 31.9539,
    lng: 35.9106,
    hasDelivery: true,
    drugs: ["باراسيتامول", "أموكسيسيلين", "ميتفورمين"],
  },
  {
    id: "12",
    name: "صيدليات فارمسي ون",
    country: "الأردن",
    city: "عمان",
    area: "الصويفية",
    address: "شارع الوكالات، الصويفية",
    phone: "0799876543",
    phone2: "",
    rating: 4.6,
    reviews: 167,
    isOpen: true,
    hours: "9 ص - 11 م",
    lat: 31.9565,
    lng: 35.8612,
    hasDelivery: false,
    drugs: ["لوسارتان", "أتورفاستاتين", "سيتريزين"],
  },
  // الكويت
  {
    id: "13",
    name: "صيدلية الجابرية",
    country: "الكويت",
    city: "الكويت",
    area: "الجابرية",
    address: "شارع مكة، الجابرية",
    phone: "99123456",
    phone2: "25678901",
    rating: 4.8,
    reviews: 234,
    isOpen: true,
    hours: "24 ساعة",
    lat: 29.3117,
    lng: 48.0161,
    hasDelivery: true,
    drugs: ["باراسيتامول", "أزيثروميسين", "بانتوبرازول"],
  },
  {
    id: "14",
    name: "صيدلية السالمية",
    country: "الكويت",
    city: "الكويت",
    area: "السالمية",
    address: "شارع سالم المبارك، السالمية",
    phone: "99876543",
    phone2: "",
    rating: 4.5,
    reviews: 145,
    isOpen: true,
    hours: "8 ص - 12 م",
    lat: 29.3348,
    lng: 48.0758,
    hasDelivery: true,
    drugs: ["أيبوبروفين", "ديكلوفيناك", "فلوكسيتين"],
  },
]

const countries = ["مصر", "السعودية", "الإمارات", "الأردن", "الكويت"]

const citiesByCountry: Record<string, string[]> = {
  مصر: ["القاهرة", "الإسكندرية", "الجيزة"],
  السعودية: ["الرياض", "جدة", "مكة", "المدينة"],
  الإمارات: ["دبي", "أبوظبي", "الشارقة"],
  الأردن: ["عمان", "إربد", "الزرقاء"],
  الكويت: ["الكويت", "الأحمدي", "الجهراء"],
}

interface UserLocation {
  lat: number
  lng: number
}

export function PharmacySearch() {
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [searchDrug, setSearchDrug] = useState("")
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState("")
  const [filteredPharmacies, setFilteredPharmacies] = useState(pharmaciesData)
  const [useGPS, setUseGPS] = useState(false)

  // حساب المسافة بين نقطتين
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371 // نصف قطر الأرض بالكيلومترات
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // الحصول على موقع المستخدم
  const getUserLocation = () => {
    setLocationLoading(true)
    setLocationError("")

    if (!navigator.geolocation) {
      setLocationError("المتصفح لا يدعم تحديد الموقع")
      setLocationLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setUseGPS(true)
        setLocationLoading(false)
      },
      (error) => {
        setLocationError("فشل في تحديد الموقع. يرجى اختيار المدينة يدوياً")
        setLocationLoading(false)
      },
    )
  }

  // تصفية الصيدليات
  useEffect(() => {
    let results = [...pharmaciesData]

    if (useGPS && userLocation) {
      // ترتيب حسب المسافة
      results = results
        .map((pharmacy) => ({
          ...pharmacy,
          distance: calculateDistance(userLocation.lat, userLocation.lng, pharmacy.lat, pharmacy.lng),
        }))
        .sort((a, b) => (a.distance || 0) - (b.distance || 0))
    } else {
      if (selectedCountry) {
        results = results.filter((p) => p.country === selectedCountry)
      }
      if (selectedCity) {
        results = results.filter((p) => p.city === selectedCity)
      }
    }

    if (searchDrug) {
      results = results.filter((p) => p.drugs.some((drug) => drug.toLowerCase().includes(searchDrug.toLowerCase())))
    }

    setFilteredPharmacies(results)
  }, [selectedCountry, selectedCity, searchDrug, userLocation, useGPS])

  const resetToManual = () => {
    setUseGPS(false)
    setUserLocation(null)
  }

  return (
    <div className="space-y-6">
      {/* خيارات البحث */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            البحث عن صيدليات قريبة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* زر تحديد الموقع */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={getUserLocation}
              disabled={locationLoading}
              variant={useGPS ? "default" : "outline"}
              className="flex-1 gap-2"
            >
              <Navigation className="w-4 h-4" />
              {locationLoading ? "جاري تحديد الموقع..." : "استخدام موقعي الحالي (GPS)"}
            </Button>
            {useGPS && (
              <Button variant="outline" onClick={resetToManual} className="gap-2 bg-transparent">
                <MapPin className="w-4 h-4" />
                اختيار يدوي
              </Button>
            )}
          </div>

          {locationError && <p className="text-sm text-destructive">{locationError}</p>}

          {useGPS && userLocation && (
            <Badge variant="secondary" className="gap-1">
              <MapPin className="w-3 h-3" />
              تم تحديد موقعك - يتم عرض الصيدليات الأقرب
            </Badge>
          )}

          {/* الاختيار اليدوي */}
          {!useGPS && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>البلد</Label>
                <Select
                  value={selectedCountry}
                  onValueChange={(v) => {
                    setSelectedCountry(v)
                    setSelectedCity("")
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر البلد" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>المدينة</Label>
                <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المدينة" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCountry &&
                      citiesByCountry[selectedCountry]?.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* البحث عن دواء معين */}
          <div className="space-y-2">
            <Label>البحث عن صيدلية بها دواء معين (اختياري)</Label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="اكتب اسم الدواء..."
                value={searchDrug}
                onChange={(e) => setSearchDrug(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* نتائج الصيدليات */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">الصيدليات المتاحة ({filteredPharmacies.length})</h3>

        {filteredPharmacies.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              لم يتم العثور على صيدليات. جرب تغيير معايير البحث.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredPharmacies.map((pharmacy) => (
              <Card key={pharmacy.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-lg">{pharmacy.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {pharmacy.area}، {pharmacy.city} - {pharmacy.country}
                          </p>
                        </div>
                        <Badge variant={pharmacy.isOpen ? "default" : "secondary"} className="shrink-0">
                          {pharmacy.isOpen ? "مفتوح الآن" : "مغلق"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-medium">{pharmacy.rating}</span>
                        <span className="text-muted-foreground text-sm">({pharmacy.reviews} تقييم)</span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span>{pharmacy.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4 shrink-0" />
                          <span>{pharmacy.hours}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 shrink-0 text-primary" />
                          <a href={`tel:${pharmacy.phone}`} className="text-primary hover:underline font-medium">
                            {pharmacy.phone}
                          </a>
                          {pharmacy.phone2 && (
                            <>
                              <span className="text-muted-foreground">|</span>
                              <a href={`tel:${pharmacy.phone2}`} className="text-primary hover:underline font-medium">
                                {pharmacy.phone2}
                              </a>
                            </>
                          )}
                        </div>
                      </div>

                      {/* أدوية متوفرة */}
                      <div className="flex flex-wrap gap-2">
                        <span className="text-sm text-muted-foreground">أدوية متوفرة:</span>
                        {pharmacy.drugs.slice(0, 3).map((drug) => (
                          <Badge key={drug} variant="outline" className="gap-1">
                            <Pill className="w-3 h-3" />
                            {drug}
                          </Badge>
                        ))}
                      </div>

                      {/* المسافة إذا كان GPS مفعل */}
                      {useGPS && userLocation && "distance" in pharmacy && (
                        <Badge variant="secondary" className="gap-1">
                          <Navigation className="w-3 h-3" />
                          {(pharmacy as any).distance.toFixed(1)} كم
                        </Badge>
                      )}
                    </div>

                    <div className="flex sm:flex-col gap-2 sm:justify-start">
                      <Button variant="default" size="sm" className="gap-2" asChild>
                        <a href={`tel:${pharmacy.phone}`}>
                          <Phone className="w-4 h-4" />
                          اتصل
                        </a>
                      </Button>
                      {pharmacy.hasDelivery && (
                        <Badge variant="outline" className="justify-center">
                          توصيل متاح
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
