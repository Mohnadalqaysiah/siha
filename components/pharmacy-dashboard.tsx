"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Plus,
  Upload,
  Package,
  Save,
  Trash2,
  Edit2,
  FileSpreadsheet,
  AlertCircle,
  Check,
  LogIn,
  LogOut,
  Building2,
  Search,
  Filter,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Drug {
  id: string
  name: string
  activeIngredient: string
  price: number
  quantity: number
  expiryDate: string
  manufacturer: string
}

interface PharmacyInfo {
  id: string
  name: string
  owner: string
  country: string
  city: string
  area: string
  address: string
  phone: string
  phone2: string
  email: string
  hours: string
  hasDelivery: boolean
}

const countries = ["مصر", "السعودية", "الإمارات", "الأردن", "الكويت"]
const citiesByCountry: Record<string, string[]> = {
  مصر: ["القاهرة", "الإسكندرية", "الجيزة"],
  السعودية: ["الرياض", "جدة", "مكة", "المدينة"],
  الإمارات: ["دبي", "أبوظبي", "الشارقة"],
  الأردن: ["عمان", "إربد", "الزرقاء"],
  الكويت: ["الكويت", "الأحمدي", "الجهراء"],
}

export function PharmacyDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState("inventory")
  const [drugs, setDrugs] = useState<Drug[]>([])
  const [pharmacyInfo, setPharmacyInfo] = useState<PharmacyInfo>({
    id: "",
    name: "",
    owner: "",
    country: "",
    city: "",
    area: "",
    address: "",
    phone: "",
    phone2: "",
    email: "",
    hours: "",
    hasDelivery: false,
  })
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerMode, setRegisterMode] = useState(false)
  const [registerForm, setRegisterForm] = useState({
    name: "",
    owner: "",
    email: "",
    password: "",
    country: "",
    city: "",
    area: "",
    address: "",
    phone: "",
    phone2: "",
    hours: "",
    hasDelivery: false,
  })

  // New drug form
  const [newDrug, setNewDrug] = useState<Partial<Drug>>({
    name: "",
    activeIngredient: "",
    price: 0,
    quantity: 0,
    expiryDate: "",
    manufacturer: "",
  })
  const [editingDrug, setEditingDrug] = useState<Drug | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLowStock, setFilterLowStock] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load data from localStorage
  useEffect(() => {
    const savedPharmacy = localStorage.getItem("pharmacyInfo")
    const savedDrugs = localStorage.getItem("pharmacyDrugs")
    const savedLogin = localStorage.getItem("pharmacyLoggedIn")

    if (savedPharmacy) {
      setPharmacyInfo(JSON.parse(savedPharmacy))
    }
    if (savedDrugs) {
      setDrugs(JSON.parse(savedDrugs))
    }
    if (savedLogin === "true") {
      setIsLoggedIn(true)
    }
  }, [])

  // Save data to localStorage
  useEffect(() => {
    if (isLoggedIn && pharmacyInfo.id) {
      localStorage.setItem("pharmacyInfo", JSON.stringify(pharmacyInfo))
      localStorage.setItem("pharmacyDrugs", JSON.stringify(drugs))
    }
  }, [drugs, pharmacyInfo, isLoggedIn])

  // Login handler
  const handleLogin = () => {
    // تسجيل دخول تجريبي
    const savedPharmacy = localStorage.getItem("pharmacyInfo")
    if (savedPharmacy) {
      const pharmacy = JSON.parse(savedPharmacy)
      if (pharmacy.email === loginForm.email) {
        setPharmacyInfo(pharmacy)
        setIsLoggedIn(true)
        localStorage.setItem("pharmacyLoggedIn", "true")
      } else {
        alert("البريد الإلكتروني غير صحيح")
      }
    } else {
      alert("لا يوجد حساب مسجل. يرجى إنشاء حساب جديد.")
    }
  }

  // Register handler
  const handleRegister = () => {
    if (
      !registerForm.name ||
      !registerForm.email ||
      !registerForm.phone ||
      !registerForm.country ||
      !registerForm.city
    ) {
      alert("يرجى ملء جميع الحقول المطلوبة")
      return
    }
    const newPharmacy: PharmacyInfo = {
      id: Date.now().toString(),
      ...registerForm,
    }
    setPharmacyInfo(newPharmacy)
    localStorage.setItem("pharmacyInfo", JSON.stringify(newPharmacy))
    setIsLoggedIn(true)
    localStorage.setItem("pharmacyLoggedIn", "true")
    setRegisterMode(false)
  }

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.setItem("pharmacyLoggedIn", "false")
  }

  // Add drug
  const addDrug = () => {
    if (!newDrug.name || !newDrug.price) {
      alert("يرجى إدخال اسم الدواء والسعر")
      return
    }
    const drug: Drug = {
      id: Date.now().toString(),
      name: newDrug.name || "",
      activeIngredient: newDrug.activeIngredient || "",
      price: newDrug.price || 0,
      quantity: newDrug.quantity || 0,
      expiryDate: newDrug.expiryDate || "",
      manufacturer: newDrug.manufacturer || "",
    }
    setDrugs([...drugs, drug])
    setNewDrug({
      name: "",
      activeIngredient: "",
      price: 0,
      quantity: 0,
      expiryDate: "",
      manufacturer: "",
    })
  }

  // Update drug
  const updateDrug = () => {
    if (!editingDrug) return
    setDrugs(drugs.map((d) => (d.id === editingDrug.id ? editingDrug : d)))
    setEditingDrug(null)
  }

  // Delete drug
  const deleteDrug = (id: string) => {
    setDrugs(drugs.filter((d) => d.id !== id))
  }

  // Handle Excel upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split("\n").filter((line) => line.trim())
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

        const newDrugs: Drug[] = []
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",").map((v) => v.trim())
          if (values.length >= 2) {
            newDrugs.push({
              id: Date.now().toString() + i,
              name: values[headers.indexOf("name") >= 0 ? headers.indexOf("name") : 0] || values[0],
              activeIngredient:
                values[headers.indexOf("activeingredient") >= 0 ? headers.indexOf("activeingredient") : 1] ||
                values[1] ||
                "",
              price: Number.parseFloat(values[headers.indexOf("price") >= 0 ? headers.indexOf("price") : 2]) || 0,
              quantity:
                Number.parseInt(values[headers.indexOf("quantity") >= 0 ? headers.indexOf("quantity") : 3]) || 0,
              expiryDate: values[headers.indexOf("expirydate") >= 0 ? headers.indexOf("expirydate") : 4] || "",
              manufacturer: values[headers.indexOf("manufacturer") >= 0 ? headers.indexOf("manufacturer") : 5] || "",
            })
          }
        }
        setDrugs([...drugs, ...newDrugs])
        alert(`تم استيراد ${newDrugs.length} دواء بنجاح`)
      } catch (error) {
        alert("حدث خطأ في قراءة الملف. تأكد من صيغة CSV صحيحة.")
      }
    }
    reader.readAsText(file)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Filter drugs
  const filteredDrugs = drugs.filter((drug) => {
    const matchesSearch =
      drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = !filterLowStock || drug.quantity < 10
    return matchesSearch && matchesFilter
  })

  // Low stock count
  const lowStockCount = drugs.filter((d) => d.quantity < 10).length

  if (!isLoggedIn) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 mx-auto">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <CardTitle>{registerMode ? "تسجيل صيدلية جديدة" : "تسجيل دخول الصيدلية"}</CardTitle>
          <CardDescription>
            {registerMode ? "أنشئ حساب لصيدليتك لإدارة الأدوية والمخزون" : "سجل دخول للوصول إلى لوحة التحكم"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {registerMode ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>اسم الصيدلية *</Label>
                  <Input
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    placeholder="صيدلية..."
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>اسم المالك</Label>
                  <Input
                    value={registerForm.owner}
                    onChange={(e) => setRegisterForm({ ...registerForm, owner: e.target.value })}
                    placeholder="د. ..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>البلد *</Label>
                  <Select
                    value={registerForm.country}
                    onValueChange={(v) => setRegisterForm({ ...registerForm, country: v, city: "" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>المدينة *</Label>
                  <Select
                    value={registerForm.city}
                    onValueChange={(v) => setRegisterForm({ ...registerForm, city: v })}
                    disabled={!registerForm.country}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      {registerForm.country &&
                        citiesByCountry[registerForm.country]?.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>المنطقة</Label>
                  <Input
                    value={registerForm.area}
                    onChange={(e) => setRegisterForm({ ...registerForm, area: e.target.value })}
                    placeholder="الحي/المنطقة"
                  />
                </div>
                <div className="space-y-2">
                  <Label>أوقات العمل</Label>
                  <Input
                    value={registerForm.hours}
                    onChange={(e) => setRegisterForm({ ...registerForm, hours: e.target.value })}
                    placeholder="24 ساعة / 9ص-11م"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>العنوان التفصيلي</Label>
                  <Input
                    value={registerForm.address}
                    onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                    placeholder="الشارع، رقم المبنى..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>رقم الهاتف *</Label>
                  <Input
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                    placeholder="01xxxxxxxxx"
                  />
                </div>
                <div className="space-y-2">
                  <Label>رقم هاتف إضافي</Label>
                  <Input
                    value={registerForm.phone2}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone2: e.target.value })}
                    placeholder="اختياري"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>البريد الإلكتروني *</Label>
                  <Input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    placeholder="pharmacy@example.com"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>كلمة المرور *</Label>
                  <Input
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    placeholder="********"
                  />
                </div>
              </div>
              <Button onClick={handleRegister} className="w-full gap-2">
                <Check className="w-4 h-4" />
                إنشاء الحساب
              </Button>
              <Button variant="ghost" onClick={() => setRegisterMode(false)} className="w-full">
                لديك حساب؟ سجل دخول
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <Input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="pharmacy@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>كلمة المرور</Label>
                <Input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="********"
                />
              </div>
              <Button onClick={handleLogin} className="w-full gap-2">
                <LogIn className="w-4 h-4" />
                تسجيل الدخول
              </Button>
              <Button variant="ghost" onClick={() => setRegisterMode(true)} className="w-full">
                ليس لديك حساب؟ سجل صيدليتك
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-bold text-xl">{pharmacyInfo.name}</h2>
              <p className="text-sm text-muted-foreground">
                {pharmacyInfo.area}، {pharmacyInfo.city} - {pharmacyInfo.country}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="gap-1">
                <Package className="w-3 h-3" />
                {drugs.length} دواء
              </Badge>
              {lowStockCount > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {lowStockCount} نفاد مخزون
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1">
                <LogOut className="w-4 h-4" />
                خروج
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory" className="gap-2">
            <Package className="w-4 h-4" />
            المخزون
          </TabsTrigger>
          <TabsTrigger value="add" className="gap-2">
            <Plus className="w-4 h-4" />
            إضافة أدوية
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Building2 className="w-4 h-4" />
            الإعدادات
          </TabsTrigger>
        </TabsList>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                إدارة المخزون
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="ابحث عن دواء..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <Button
                  variant={filterLowStock ? "default" : "outline"}
                  onClick={() => setFilterLowStock(!filterLowStock)}
                  className="gap-2"
                >
                  <Filter className="w-4 h-4" />
                  نفاد المخزون فقط
                </Button>
              </div>

              {/* Drugs Table */}
              {filteredDrugs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {drugs.length === 0
                    ? "لم يتم إضافة أدوية بعد. ابدأ بإضافة أدوية من تبويب 'إضافة أدوية'"
                    : "لا توجد نتائج للبحث"}
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>اسم الدواء</TableHead>
                        <TableHead>المادة الفعالة</TableHead>
                        <TableHead>السعر</TableHead>
                        <TableHead>الكمية</TableHead>
                        <TableHead>الصلاحية</TableHead>
                        <TableHead>إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDrugs.map((drug) => (
                        <TableRow key={drug.id}>
                          <TableCell className="font-medium">{drug.name}</TableCell>
                          <TableCell>{drug.activeIngredient}</TableCell>
                          <TableCell>{drug.price}</TableCell>
                          <TableCell>
                            <Badge variant={drug.quantity < 10 ? "destructive" : "secondary"}>{drug.quantity}</Badge>
                          </TableCell>
                          <TableCell>{drug.expiryDate || "-"}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => setEditingDrug({ ...drug })}>
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>تعديل الدواء</DialogTitle>
                                  </DialogHeader>
                                  {editingDrug && (
                                    <div className="space-y-4">
                                      <div className="space-y-2">
                                        <Label>اسم الدواء</Label>
                                        <Input
                                          value={editingDrug.name}
                                          onChange={(e) => setEditingDrug({ ...editingDrug, name: e.target.value })}
                                        />
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label>السعر</Label>
                                          <Input
                                            type="number"
                                            value={editingDrug.price}
                                            onChange={(e) =>
                                              setEditingDrug({
                                                ...editingDrug,
                                                price: Number.parseFloat(e.target.value),
                                              })
                                            }
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>الكمية</Label>
                                          <Input
                                            type="number"
                                            value={editingDrug.quantity}
                                            onChange={(e) =>
                                              setEditingDrug({
                                                ...editingDrug,
                                                quantity: Number.parseInt(e.target.value),
                                              })
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  <DialogFooter>
                                    <Button onClick={updateDrug} className="gap-2">
                                      <Save className="w-4 h-4" />
                                      حفظ التغييرات
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteDrug(drug.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add Drugs Tab */}
        <TabsContent value="add" className="space-y-4">
          {/* Manual Add */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                إضافة دواء يدوياً
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>اسم الدواء *</Label>
                  <Input
                    value={newDrug.name}
                    onChange={(e) => setNewDrug({ ...newDrug, name: e.target.value })}
                    placeholder="باراسيتامول 500mg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>المادة الفعالة</Label>
                  <Input
                    value={newDrug.activeIngredient}
                    onChange={(e) => setNewDrug({ ...newDrug, activeIngredient: e.target.value })}
                    placeholder="Paracetamol"
                  />
                </div>
                <div className="space-y-2">
                  <Label>السعر *</Label>
                  <Input
                    type="number"
                    value={newDrug.price || ""}
                    onChange={(e) => setNewDrug({ ...newDrug, price: Number.parseFloat(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الكمية المتوفرة</Label>
                  <Input
                    type="number"
                    value={newDrug.quantity || ""}
                    onChange={(e) => setNewDrug({ ...newDrug, quantity: Number.parseInt(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>تاريخ الصلاحية</Label>
                  <Input
                    type="date"
                    value={newDrug.expiryDate}
                    onChange={(e) => setNewDrug({ ...newDrug, expiryDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>الشركة المصنعة</Label>
                  <Input
                    value={newDrug.manufacturer}
                    onChange={(e) => setNewDrug({ ...newDrug, manufacturer: e.target.value })}
                    placeholder="فايزر، نوفارتس..."
                  />
                </div>
              </div>
              <Button onClick={addDrug} className="w-full gap-2">
                <Plus className="w-4 h-4" />
                إضافة الدواء
              </Button>
            </CardContent>
          </Card>

          {/* Excel Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                استيراد من ملف Excel/CSV
              </CardTitle>
              <CardDescription>
                ارفع ملف CSV يحتوي على قائمة الأدوية. يجب أن يحتوي على الأعمدة: name, activeIngredient, price, quantity,
                expiryDate, manufacturer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">اسحب ملف CSV هنا أو انقر للاختيار</p>
                <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
                  <Upload className="w-4 h-4" />
                  اختر ملف CSV
                </Button>
              </div>

              {/* Sample CSV format */}
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium mb-2">مثال على صيغة الملف:</p>
                <code className="text-xs block overflow-x-auto whitespace-pre">
                  {`name,activeIngredient,price,quantity,expiryDate,manufacturer
باراسيتامول 500mg,Paracetamol,15,100,2025-12-31,فايزر
أموكسيسيلين 500mg,Amoxicillin,35,50,2025-06-30,GSK`}
                </code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                معلومات الصيدلية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>اسم الصيدلية</Label>
                  <Input
                    value={pharmacyInfo.name}
                    onChange={(e) => setPharmacyInfo({ ...pharmacyInfo, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>اسم المالك</Label>
                  <Input
                    value={pharmacyInfo.owner}
                    onChange={(e) => setPharmacyInfo({ ...pharmacyInfo, owner: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>البلد</Label>
                  <Select
                    value={pharmacyInfo.country}
                    onValueChange={(v) => setPharmacyInfo({ ...pharmacyInfo, country: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>المدينة</Label>
                  <Select
                    value={pharmacyInfo.city}
                    onValueChange={(v) => setPharmacyInfo({ ...pharmacyInfo, city: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {pharmacyInfo.country &&
                        citiesByCountry[pharmacyInfo.country]?.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>المنطقة</Label>
                  <Input
                    value={pharmacyInfo.area}
                    onChange={(e) => setPharmacyInfo({ ...pharmacyInfo, area: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>أوقات العمل</Label>
                  <Input
                    value={pharmacyInfo.hours}
                    onChange={(e) => setPharmacyInfo({ ...pharmacyInfo, hours: e.target.value })}
                  />
                </div>
                <div className="space-y-2 col-span-full">
                  <Label>العنوان التفصيلي</Label>
                  <Input
                    value={pharmacyInfo.address}
                    onChange={(e) => setPharmacyInfo({ ...pharmacyInfo, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>رقم الهاتف الأساسي</Label>
                  <Input
                    value={pharmacyInfo.phone}
                    onChange={(e) => setPharmacyInfo({ ...pharmacyInfo, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>رقم هاتف إضافي</Label>
                  <Input
                    value={pharmacyInfo.phone2}
                    onChange={(e) => setPharmacyInfo({ ...pharmacyInfo, phone2: e.target.value })}
                  />
                </div>
                <div className="space-y-2 col-span-full">
                  <Label>البريد الإلكتروني</Label>
                  <Input
                    value={pharmacyInfo.email}
                    onChange={(e) => setPharmacyInfo({ ...pharmacyInfo, email: e.target.value })}
                  />
                </div>
              </div>
              <Button className="w-full gap-2">
                <Save className="w-4 h-4" />
                حفظ التغييرات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
