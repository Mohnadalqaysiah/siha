"use client"

import { History, X, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SearchHistoryProps {
  history: Array<{ query: string; country: string; timestamp: number }>
  countries: Array<{ value: string; label: string }>
  onHistoryClick: (query: string, country: string) => void
  onClearHistory: () => void
}

export function SearchHistory({ history, countries, onHistoryClick, onClearHistory }: SearchHistoryProps) {
  const getCountryLabel = (value: string) => {
    return countries.find((c) => c.value === value)?.label || value
  }

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "الآن"
    if (minutes < 60) return `منذ ${minutes} دقيقة`
    if (hours < 24) return `منذ ${hours} ساعة`
    return `منذ ${days} يوم`
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="w-5 h-5" />
          سجل البحث
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClearHistory}>
          <X className="w-4 h-4 ml-1" />
          مسح السجل
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {history.map((item, index) => (
            <button
              key={index}
              onClick={() => onHistoryClick(item.query, item.country)}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors text-right"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{item.query}</p>
                  <p className="text-xs text-muted-foreground">{formatTime(item.timestamp)}</p>
                </div>
              </div>
              <Badge variant="outline">{getCountryLabel(item.country)}</Badge>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
