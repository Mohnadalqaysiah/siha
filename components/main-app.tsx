"use client"

import { useState } from "react"
import { 
  Pill, 
  Stethoscope, 
  Building2, 
  Warehouse, 
  Calculator,
  LogIn,
  LogOut,
  User,
  Hospital,
  Store
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DrugSearch } from "./drug-search"
import { DoctorSearch } from "./doctor-search"
import { PharmacySearch } from "./pharmacy-search"
import { LoginPage } from "./login-page"
import { DoctorDashboard } from "./doctor-dashboard"
import { PharmacyPanel } from "./pharmacy-panel"
import { WarehouseDashboard } from "./warehouse-dashboard"
import { DosageCalculator } from "./dosage-calculator"
import { useAuth } from "@/contexts/auth-context"

export function MainApp() {
  const { user, logout, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState("drugs")
  const [showLogin, setShowLogin] = useState(false)

  console.log("[v0] MainApp - isAuthenticated:", isAuthenticated, "user:", user, "activeTab:", activeTab)

  const getUserTypeLabel = (role: string) => {
    switch (role) {
      case "doctor": return "طبيب"
      case "hospital": return "مستشفى"
      case "pharmacy": return "صيدلية"
      case "warehouse": return "مستودع"
      case "pharma_company": return "شركة أدوية"
      default: return "مستخدم"
    }
  }

  const getUserTypeIcon = (role: string) => {
    switch (role) {
      case "doctor": return <Stethoscope className="h-4 w-4" />
      case "hospital": return <Hospital className="h-4 w-4" />
      case "pharmacy": return <Store className="h-4 w-4" />
      case "warehouse": return <Warehouse className="h-4 w-4" />
      case "pharma_company": return <Building2 className="h-4 w-4" />
      default: return <User className="h-4 w-4" />
    }
  }

  const getIcon = () => {
    switch (activeTab) {
      case "drugs":
        return <Pill className="w-8 h-8 text-primary" />
      case "doctors":
        return <Stethoscope className="w-8 h-8 text-primary" />
      case "pharmacies":
        return <Building2 className="w-8 h-8 text-primary" />
      case "doctor-dashboard":
        return <Stethoscope className="w-8 h-8 text-primary" />
      case "pharmacy-panel":
        return <Store className="w-8 h-8 text-primary" />
      case "warehouse":
        return <Warehouse className="w-8 h-8 text-primary" />
      case "calculator":
        return <Calculator className="w-8 h-8 text-primary" />
      default:
        return <Pill className="w-8 h-8 text-primary" />
    }
  }

  const getTitle = () => {
    switch (activeTab) {
      case "drugs":
        return "ابحث عن الأدوية والأسعار"
      case "doctors":
        return "ابحث عن أطباء في منطقتك"
      case "pharmacies":
        return "اعثر على أقرب صيدلية"
      case "doctor-dashboard":
        return "لوحة تحكم الطبيب / المستشفى"
      case "pharmacy-panel":
        return "لوحة تحكم الصيدلية"
      case "warehouse":
        return "لوحة تحكم المستودع / شركة الأدوية"
      case "calculator":
        return "حاسبة الجرعات الدوائية"
      default:
        return "دليلك الطبي الذكي"
    }
  }

  // Show login page if requested
  if (showLogin && !isAuthenticated) {
    return <LoginPage onBack={() => setShowLogin(false)} />
  }

  // Determine available tabs based on user type
  const getAvailableTabs = () => {
    const baseTabs = [
      { id: "drugs", label: "الأدوية", icon: Pill },
      { id: "doctors", label: "الأطباء", icon: Stethoscope },
      { id: "pharmacies", label: "الصيدليات", icon: Building2 },
      { id: "calculator", label: "حاسبة الجرعات", icon: Calculator },
    ]

    if (!isAuthenticated) return baseTabs

    switch (user?.role) {
      case "doctor":
      case "hospital":
        return [
          ...baseTabs,
          { id: "doctor-dashboard", label: "لوحة التحكم", icon: Stethoscope },
        ]
      case "pharmacy":
        return [
          ...baseTabs,
          { id: "pharmacy-panel", label: "لوحة التحكم", icon: Store },
        ]
      case "warehouse":
      case "pharma_company":
        return [
          ...baseTabs,
          { id: "warehouse", label: "لوحة التحكم", icon: Warehouse },
        ]
      default:
        return baseTabs
    }
  }

  const availableTabs = getAvailableTabs()

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
            {getIcon()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">دليلك الطبي الذكي</h1>
            <p className="text-sm text-muted-foreground">{getTitle()}</p>
          </div>
        </div>
        
        {/* User Menu */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  {getUserTypeIcon(user?.role || "")}
                  <span className="hidden sm:inline">{user?.name}</span>
                  <Badge variant="secondary" className="hidden md:flex">
                    {getUserTypeLabel(user?.role || "")}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <span>{user?.name}</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      {user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="h-4 w-4 ml-2" />
                  الملف الشخصي
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="h-4 w-4 ml-2" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => setShowLogin(true)} className="gap-2">
              <LogIn className="h-4 w-4" />
              تسجيل الدخول
            </Button>
          )}
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full mb-6 ${
          availableTabs.length <= 4 ? "grid-cols-4" : "grid-cols-5"
        }`}>
          {availableTabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id} className="gap-2 text-xs sm:text-sm">
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="drugs">
          <DrugSearch />
        </TabsContent>

        <TabsContent value="doctors">
          <DoctorSearch />
        </TabsContent>

        <TabsContent value="pharmacies">
          <PharmacySearch />
        </TabsContent>

        <TabsContent value="calculator">
          <DosageCalculator />
        </TabsContent>

        <TabsContent value="doctor-dashboard">
          <DoctorDashboard />
        </TabsContent>

        <TabsContent value="pharmacy-panel">
          <PharmacyPanel />
        </TabsContent>

        <TabsContent value="warehouse">
          <WarehouseDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
