import { Suspense } from "react"
import { MainApp } from "@/components/main-app"
import { AuthProvider } from "@/contexts/auth-context"

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <main className="min-h-screen bg-background" dir="rtl">
        <Suspense fallback={<LoadingFallback />}>
          <MainApp />
        </Suspense>
      </main>
    </AuthProvider>
  )
}
