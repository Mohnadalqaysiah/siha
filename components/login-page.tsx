"use client"

import React from "react"

import { useState } from "react"
import {
  Stethoscope,
  Building2,
  Store,
  Warehouse,
  LogIn,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import type { UserRole } from "@/lib/types"

interface DemoAccount {
  role: UserRole
  email: string
  password: string
  name: string
  icon: typeof Stethoscope
  description: string
}

const demoAccounts: DemoAccount[] = [
  {
    role: "doctor",
    email: "dr.ahmed@clinic.com",
    password: "demo",
    name: "طبيب / عيادة",
    icon: Stethoscope,
    description: "كتابة الوصفات الطبية وإرسالها للصيدليات",
  },
  {
    role: "hospital",
    email: "info@kingdom-hospital.com",
    password: "demo",
    name: "مستشفى",
    icon: Building2,
    description: "إدارة الوصفات ومتابعة المرضى",
  },
  {
    role: "pharmacy",
    email: "shifa@pharmacy.com",
    password: "demo",
    name: "صيدلية",
    icon: Store,
    description: "استلام الوصفات وصرف الأدوية",
  },
  {
    role: "warehouse",
    email: "info@united-pharma.com",
    password: "demo",
    name: "مستودع / شركة أدوية",
    icon: Warehouse,
    description: "متابعة المخزون والتقارير",
  },
]

interface LoginPageProps {
  onBack?: () => void
}

export function LoginPage({ onBack }: LoginPageProps) {
  const { login, isLoading, switchRole } = useAuth()
  const [activeTab, setActiveTab] = useState<"login" | "demo">("demo")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور")
      return
    }

    const success = await login(email, password)
    if (!success) {
      setError("بيانات الدخول غير صحيحة")
    }
  }

  const handleDemoLogin = (account: DemoAccount) => {
    switchRole(account.role)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            العودة
          </Button>
        )}
        
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Stethoscope className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            منظومة الدواء الذكية
          </h1>
          <p className="text-muted-foreground text-sm">
            نظام متكامل لإدارة الوصفات الطبية والأدوية
          </p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">تسجيل الدخول</CardTitle>
            <CardDescription>
              اختر نوع الحساب أو سجل الدخول بحسابك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "login" | "demo")}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="demo">حسابات تجريبية</TabsTrigger>
                <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
              </TabsList>

              <TabsContent value="demo" className="space-y-3">
                <p className="text-xs text-muted-foreground text-center mb-4">
                  اختر نوع الحساب للدخول كمستخدم تجريبي
                </p>
                {demoAccounts.map((account) => {
                  const Icon = account.icon
                  return (
                    <Button
                      key={account.role}
                      variant="outline"
                      className="w-full h-auto py-4 justify-start gap-4 bg-transparent"
                      onClick={() => handleDemoLogin(account)}
                      disabled={isLoading}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-right flex-1">
                        <div className="font-medium">{account.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {account.description}
                        </div>
                      </div>
                    </Button>
                  )
                })}
              </TabsContent>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      dir="ltr"
                      className="text-left"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">كلمة المرور</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        dir="ltr"
                        className="text-left pl-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute left-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">...</span>
                        جاري تسجيل الدخول
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <LogIn className="w-4 h-4" />
                        تسجيل الدخول
                      </span>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          هذه نسخة تجريبية للعرض فقط
        </p>
      </div>
    </div>
  )
}
