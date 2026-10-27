"use client"

import { Pill, Building2, DollarSign, RefreshCw, AlertTriangle, FlaskConical } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { DrugSearchResult } from "./drug-search"

interface DrugResultsProps {
  result: DrugSearchResult
  countryLabel: string
}

export function DrugResults({ result, countryLabel }: DrugResultsProps) {
  return (
    <div className="space-y-6">
      {/* Active Ingredient Info */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">المادة الفعالة</p>
              <p className="text-lg font-semibold text-primary">{result.activeIngredient}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warnings */}
      {result.warnings && result.warnings.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>تحذيرات هامة</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside mt-2 space-y-1">
              {result.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs for Results */}
      <Tabs defaultValue="drugs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="drugs">
            <Pill className="w-4 h-4 ml-2" />
            الأدوية ({result.drugs.length})
          </TabsTrigger>
          <TabsTrigger value="alternatives">
            <RefreshCw className="w-4 h-4 ml-2" />
            البدائل ({result.alternatives.length})
          </TabsTrigger>
          <TabsTrigger value="interactions">
            <AlertTriangle className="w-4 h-4 ml-2" />
            التفاعلات ({result.interactions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="drugs" className="mt-4">
          <div className="grid gap-4">
            {result.drugs.map((drug, index) => (
              <DrugCard key={index} drug={drug} />
            ))}
            {result.drugs.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  لم يتم العثور على أدوية مطابقة
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="alternatives" className="mt-4">
          <div className="grid gap-4">
            {result.alternatives.map((drug, index) => (
              <DrugCard key={index} drug={drug} isAlternative />
            ))}
            {result.alternatives.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">لا توجد بدائل متاحة</CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="interactions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                التفاعلات الدوائية
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.interactions.length > 0 ? (
                <ul className="space-y-3">
                  {result.interactions.map((interaction, index) => (
                    <li key={index} className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20">
                      <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                      <span className="text-amber-900 dark:text-amber-100">{interaction}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-muted-foreground py-4">لا توجد تفاعلات دوائية معروفة</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface DrugCardProps {
  drug: {
    brandName: string
    activeIngredient: string
    manufacturer: string
    price: string
    country: string
    dosageForm: string
    strength: string
  }
  isAlternative?: boolean
}

function DrugCard({ drug, isAlternative }: DrugCardProps) {
  return (
    <Card className={isAlternative ? "border-secondary/50" : ""}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-foreground">{drug.brandName}</h3>
            <p className="text-sm text-muted-foreground">
              {drug.strength} - {drug.dosageForm}
            </p>
          </div>
          {isAlternative && <Badge variant="secondary">بديل</Badge>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">الشركة المصنعة</p>
              <p className="text-sm font-medium">{drug.manufacturer}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">السعر</p>
              <p className="text-sm font-medium text-primary">{drug.price}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
