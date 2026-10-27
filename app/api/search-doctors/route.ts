import { GoogleGenerativeAI } from "@google/generative-ai"

const countryNames: Record<string, string> = {
  egypt: "مصر",
  saudi: "السعودية",
  uae: "الإمارات",
  jordan: "الأردن",
  kuwait: "الكويت",
}

export async function POST(req: Request) {
  try {
    const { city, specialty, country } = await req.json()

    if (!city || !specialty || !country) {
      return Response.json({ error: "الرجاء إدخال جميع البيانات" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      return Response.json({ error: "مفتاح Google API غير موجود" }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" })

    const countryName = countryNames[country] || country

    const prompt = `أنت دليل طبي شامل للأطباء في الدول العربية.

المستخدم يبحث عن: أطباء ${specialty}
المدينة: ${city}
البلد: ${countryName}

قدم قائمة بأشهر 8-12 طبيب في هذا التخصص في المدينة المحددة مع معلومات واقعية قدر الإمكان.

أرجع النتيجة بصيغة JSON فقط بدون أي نص إضافي:
{
  "doctors": [
    {
      "name": "اسم الطبيب الكامل مع اللقب",
      "specialty": "التخصص الدقيق",
      "subSpecialty": "التخصص الفرعي إن وجد",
      "hospital": "المستشفى أو العيادة",
      "address": "العنوان التفصيلي",
      "phone": "رقم الهاتف",
      "rating": 4.5,
      "reviewsCount": 150,
      "experience": "سنوات الخبرة",
      "education": "المؤهلات العلمية",
      "consultationFee": "سعر الكشف",
      "availableDays": ["السبت", "الاثنين", "الأربعاء"],
      "workingHours": "9:00 ص - 5:00 م"
    }
  ],
  "totalFound": 12,
  "city": "${city}",
  "specialty": "${specialty}"
}

ملاحظات:
- قدم معلومات متنوعة وواقعية
- التقييم يكون من 1 إلى 5
- اذكر أرقام هواتف بصيغة صحيحة للبلد
- قدم عناوين تفصيلية
- أرجع JSON فقط بدون markdown`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim()
    const data = JSON.parse(cleanedText)

    return Response.json(data)
  } catch (error) {
    console.error("Doctor search error:", error)
    return Response.json({ error: "حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى" }, { status: 500 })
  }
}
