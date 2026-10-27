"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { mockPharmacies, mockDrugs } from "@/lib/mock-data"
import type { Pharmacy, Drug } from "@/lib/types"
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  Package, 
  Search,
  Locate,
  CheckCircle,
  XCircle,
  Filter,
  Star,
  Route
} from "lucide-react"

interface PharmacyFinderProps {
  onSelectPharmacy?: (pharmacy: Pharmacy) => void
  selectedDrug?: Drug | null
  patientLocation?: { lat: number; lng: number } | null
}

export function PharmacyFinder({ onSelectPharmacy, selectedDrug, patientLocation }: PharmacyFinderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(patientLocation || null)
  const [isLocating, setIsLocating] = useState(false)
  const [sortBy, setSortBy] = useState<"distance" | "stock" | "rating">("distance")
  const [pharmaciesWithDistance, setPharmaciesWithDistance] = useState<(Pharmacy & { distance?: number })[]>([])

  // Regions in Jordan
  const regions = [
    { value: "all", label: "جميع المناطق" },
    { value: "amman", label: "عمان" },
    { value: "irbid", label: "إربد" },
    { value: "zarqa", label: "الزرقاء" },
    { value: "aqaba", label: "العقبة" },
    { value: "madaba", label: "مادبا" },
    { value: "salt", label: "السلط" },
  ]

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371 // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Get user's current location
  const getCurrentLocation = () => {
    setIsLocating(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          setIsLocating(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          // Default to Amman center if geolocation fails
          setUserLocation({ lat: 31.9454, lng: 35.9284 })
          setIsLocating(false)
        }
      )
    } else {
      // Default to Amman center
      setUserLocation({ lat: 31.9454, lng: 35.9284 })
      setIsLocating(false)
    }
  }

  // Update pharmacies with distance calculation
  useEffect(() => {
    let filtered = [...mockPharmacies]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by region
    if (selectedRegion !== "all") {
      filtered = filtered.filter(p => p.region === selectedRegion)
    }

    // Filter by drug availability if a drug is selected
    if (selectedDrug) {
      filtered = filtered.filter(p => {
        const stockItem = p.inventory.find(i => i.drugId === selectedDrug.id)
        return stockItem && stockItem.quantity > 0
      })
    }

    // Calculate distances if user location is available
    if (userLocation) {
      filtered = filtered.map(p => ({
        ...p,
        distance: calculateDistance(userLocation.lat, userLocation.lng, p.location.lat, p.location.lng)
      }))
    }

    // Sort pharmacies
    if (sortBy === "distance" && userLocation) {
      filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0))
    } else if (sortBy === "stock" && selectedDrug) {
      filtered.sort((a, b) => {
        const stockA = a.inventory.find(i => i.drugId === selectedDrug.id)?.quantity || 0
        const stockB = b.inventory.find(i => i.drugId === selectedDrug.id)?.quantity || 0
        return stockB - stockA
      })
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    setPharmaciesWithDistance(filtered)
  }, [searchQuery, selectedRegion, userLocation, selectedDrug, sortBy])

  const getStockForDrug = (pharmacy: Pharmacy, drugId: string) => {
    const item = pharmacy.inventory.find(i => i.drugId === drugId)
    return item ? item.quantity : 0
  }

  const formatDistance = (distance?: number) => {
    if (!distance) return "غير محدد"
    if (distance < 1) return `${Math.round(distance * 1000)} متر`
    return `${distance.toFixed(1)} كم`
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            البحث عن الصيدليات القريبة
          </CardTitle>
          <CardDescription>
            ابحث عن أقرب صيدلية تتوفر فيها الأدوية المطلوبة
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Location Button */}
          <div className="flex gap-2">
            <Button 
              onClick={getCurrentLocation} 
              disabled={isLocating}
              variant="outline"
              className="flex-1 bg-transparent"
            >
              <Locate className="h-4 w-4 ml-2" />
              {isLocating ? "جاري تحديد الموقع..." : "تحديد موقعي الحالي"}
            </Button>
            {userLocation && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                تم تحديد الموقع
              </Badge>
            )}
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن صيدلية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <Filter className="h-4 w-4 ml-2" />
                <SelectValue placeholder="اختر المنطقة" />
              </SelectTrigger>
              <SelectContent>
                {regions.map(region => (
                  <SelectItem key={region.value} value={region.value}>
                    {region.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger>
                <SelectValue placeholder="ترتيب حسب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">الأقرب</SelectItem>
                <SelectItem value="stock">المخزون الأعلى</SelectItem>
                <SelectItem value="rating">التقييم</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Selected Drug Info */}
          {selectedDrug && (
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4 text-primary" />
                <span className="font-medium">البحث عن:</span>
                <Badge>{selectedDrug.nameAr}</Badge>
                <span className="text-muted-foreground">({selectedDrug.name})</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pharmacies List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              الصيدليات المتاحة ({pharmaciesWithDistance.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {pharmaciesWithDistance.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>لا توجد صيدليات مطابقة للبحث</p>
                </div>
              ) : (
                pharmaciesWithDistance.map((pharmacy, index) => (
                  <Card 
                    key={pharmacy.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      index === 0 && userLocation ? "border-primary bg-primary/5" : ""
                    }`}
                    onClick={() => onSelectPharmacy?.(pharmacy)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{pharmacy.name}</h3>
                            {index === 0 && userLocation && (
                              <Badge variant="default" className="text-xs">
                                الأقرب
                              </Badge>
                            )}
                            {pharmacy.rating && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                {pharmacy.rating}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {pharmacy.address}
                          </div>
                          
                          <div className="flex flex-wrap gap-3 text-sm">
                            {pharmacy.distance !== undefined && (
                              <div className="flex items-center gap-1 text-primary">
                                <Route className="h-3 w-3" />
                                {formatDistance(pharmacy.distance)}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {pharmacy.phone}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {pharmacy.workingHours}
                            </div>
                          </div>

                          {/* Drug Stock Info */}
                          {selectedDrug && (
                            <div className="pt-2">
                              <Separator className="mb-2" />
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                <span className="text-sm">
                                  المخزون: 
                                  <span className={`font-bold mr-1 ${
                                    getStockForDrug(pharmacy, selectedDrug.id) > 10 
                                      ? "text-green-600" 
                                      : getStockForDrug(pharmacy, selectedDrug.id) > 0 
                                        ? "text-yellow-600" 
                                        : "text-red-600"
                                  }`}>
                                    {getStockForDrug(pharmacy, selectedDrug.id)} وحدة
                                  </span>
                                </span>
                                {getStockForDrug(pharmacy, selectedDrug.id) > 0 ? (
                                  <Badge variant="outline" className="text-green-600 border-green-600">
                                    <CheckCircle className="h-3 w-3 ml-1" />
                                    متوفر
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-red-600 border-red-600">
                                    <XCircle className="h-3 w-3 ml-1" />
                                    غير متوفر
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelectPharmacy?.(pharmacy)
                          }}
                        >
                          اختيار
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Simple Map Placeholder */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            خريطة الصيدليات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-[300px] bg-muted rounded-lg overflow-hidden">
            {/* Map visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 mx-auto text-primary/30 mb-2" />
                <p className="text-muted-foreground text-sm">
                  خريطة تفاعلية للصيدليات
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  (يمكن دمج Google Maps أو Mapbox لاحقاً)
                </p>
              </div>
            </div>
            
            {/* Pharmacy markers simulation */}
            <div className="absolute inset-4">
              {pharmaciesWithDistance.slice(0, 5).map((pharmacy, index) => (
                <div
                  key={pharmacy.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{
                    left: `${20 + (index * 15)}%`,
                    top: `${30 + (index * 10)}%`
                  }}
                >
                  <div className={`
                    p-1 rounded-full shadow-lg transition-transform group-hover:scale-110
                    ${index === 0 ? "bg-primary text-primary-foreground" : "bg-background border-2 border-primary"}
                  `}>
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                      {pharmacy.name}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* User location marker */}
              {userLocation && (
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: "50%", top: "50%" }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-25" />
                    <div className="relative p-2 bg-blue-500 rounded-full text-white">
                      <Locate className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
