import { GoogleGenerativeAI } from "@google/generative-ai"

const countryNames: Record<string, string> = {
  egypt: "مصر",
  saudi: "السعودية",
  uae: "الإمارات",
  jordan: "الأردن",
  kuwait: "الكويت",
}

const currencies: Record<string, string> = {
  egypt: "جنيه مصري",
  saudi: "ريال سعودي",
  uae: "درهم إماراتي",
  jordan: "دينار أردني",
  kuwait: "دينار كويتي",
}

export async function POST(req: Request) {
  try {
    const { query, country } = await req.json()

    if (!query || !country) {
      return Response.json({ error: "الرجاء إدخال اسم الدواء والبلد" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      return Response.json({ error: "مفتاح Google API غير موجود" }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" })

    const countryName = countryNames[country] || country
    const currency = currencies[country] || "العملة المحلية"

    const prompt = `أنت خبير صيدلاني متخصص في الأدوية في الدول العربية ولديك معرفة شاملة بجميع الشركات المصنعة.

المستخدم يبحث عن: "${query}"
البلد المستهدف: ${countryName}
العملة: ${currency}

مهمتك:
1. حدد ما إذا كان "${query}" اسم تجاري أو مادة فعالة
2. قدم قائمة شاملة بكل الأدوية المتاحة في ${countryName} التي تحتوي على هذه المادة الفعالة من جميع الشركات المصنعة المختلفة
3. اذكر الأسعار التقريبية بـ${currency}
4. قدم جميع البدائل المتاحة من كل الشركات المحلية والعالمية
5. اذكر التفاعلات الدوائية المهمة بالتفصيل
6. قدم التحذيرات الضرورية

أرجع النتيجة بصيغة JSON فقط بدون أي نص إضافي، بالشكل التالي:
{
  "searchedTerm": "المصطلح الذي تم البحث عنه",
  "activeIngredient": "المادة الفعالة الرئيسية",
  "drugs": [
    {
      "brandName": "الاسم التجاري",
      "activeIngredient": "المادة الفعالة",
      "manufacturer": "الشركة المصنعة الكاملة",
      "price": "السعر بالعملة المحلية",
      "country": "البلد",
      "dosageForm": "الشكل الدوائي",
      "strength": "التركيز"
    }
  ],
  "alternatives": [
    {
      "brandName": "اسم البديل",
      "activeIngredient": "المادة الفعالة",
      "manufacturer": "الشركة المصنعة",
      "price": "السعر",
      "country": "البلد",
      "dosageForm": "الشكل الدوائي",
      "strength": "التركيز"
    }
  ],
  "interactions": ["تفاعل دوائي 1", "تفاعل دوائي 2"],
  "warnings": ["تحذير 1", "تحذير 2"]
}

ملاحظات مهمة جداً:
- يجب ذكر جميع الشركات المصنعة المختلفة (8-15 شركة على الأقل إن وجدت)
- اذكر الشركات المحلية مثل: إيبيكو، فاركو، آمون، سيديكو، المهن الطبية، جلاكسو مصر، نوفارتس مصر، سانوفي، فايزر، أسترازينيكا، ميرك، جانسن، إيلي ليلي، نوفو نورديسك، روش وغيرها
- قدم الأسعار الدقيقة قدر الإمكان
- ركز على التنوع في الشركات المصنعة
- اذكر جميع التركيزات المتاحة من كل شركة
- أرجع JSON فقط بدون markdown أو backticks`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim()
    const data = JSON.parse(cleanedText)

    return Response.json(data)
  } catch (error) {
    console.error("Drug search error:", error)
    return Response.json({ error: "حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى" }, { status: 500 })
  }
}
