"use client"

import { useState, useEffect } from "react"
import { Search, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DrugResults } from "./drug-results"
import { SearchHistory } from "./search-history"

export interface DrugInfo {
  brandName: string
  activeIngredient: string
  manufacturer: string
  price: string
  country: string
  dosageForm: string
  strength: string
}

export interface DrugSearchResult {
  searchedTerm: string
  activeIngredient: string
  drugs: DrugInfo[]
  alternatives: DrugInfo[]
  interactions: string[]
  warnings: string[]
}

const countries = [
  { value: "egypt", label: "مصر", currency: "ج.م" },
  { value: "saudi", label: "السعودية", currency: "ر.س" },
  { value: "uae", label: "الإمارات", currency: "د.إ" },
  { value: "jordan", label: "الأردن", currency: "د.أ" },
  { value: "kuwait", label: "الكويت", currency: "د.ك" },
]

export function DrugSearch() {
  const [query, setQuery] = useState("")
  const [country, setCountry] = useState("egypt")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<DrugSearchResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchHistory, setSearchHistory] = useState<Array<{ query: string; country: string; timestamp: number }>>([])

  useEffect(() => {
    const saved = localStorage.getItem("drugSearchHistory")
    if (saved) {
      setSearchHistory(JSON.parse(saved))
    }
  }, [])

  const saveToHistory = (query: string, country: string) => {
    const newHistory = [
      { query, country, timestamp: Date.now() },
      ...searchHistory.filter((h) => !(h.query === query && h.country === country)),
    ].slice(0, 20)
    setSearchHistory(newHistory)
    localStorage.setItem("drugSearchHistory", JSON.stringify(newHistory))
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem("drugSearchHistory")
  }

  const handleSearch = async (searchQuery?: string, searchCountry?: string) => {
    const q = searchQuery || query
    const c = searchCountry || country

    if (!q.trim()) return

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/search-drug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, country: c }),
      })

      if (!response.ok) {
        throw new Error("فشل في البحث، يرجى المحاولة مرة أخرى")
      }

      const data = await response.json()
      setResult(data)
      saveToHistory(q, c)
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع")
    } finally {
      setIsLoading(false)
    }
  }

  const handleHistoryClick = (historyQuery: string, historyCountry: string) => {
    setQuery(historyQuery)
    setCountry(historyCountry)
    handleSearch(historyQuery, historyCountry)
  }

  const countryLabel = countries.find((c) => c.value === country)?.label || country

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="اكتب اسم الدواء أو المادة الفعالة..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="text-right"
                  dir="rtl"
                />
              </div>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
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
            <Button onClick={() => handleSearch()} disabled={isLoading || !query.trim()} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جاري البحث...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 ml-2" />
                  بحث
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && <DrugResults result={result} countryLabel={countryLabel} />}

      {/* Search History */}
      {!result && searchHistory.length > 0 && (
        <SearchHistory
          history={searchHistory}
          countries={countries}
          onHistoryClick={handleHistoryClick}
          onClearHistory={clearHistory}
        />
      )}

      {/* Empty State */}
      {!result && !isLoading && searchHistory.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">ابدأ البحث</h3>
            <p className="text-sm text-muted-foreground">اكتب اسم الدواء أو المادة الفعالة للحصول على المعلومات</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
