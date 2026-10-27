import type {
  User,
  Patient,
  Prescription,
  Drug,
  Pharmacy,
  Warehouse,
  Notification,
} from "./types"

// Mock Users
export const mockUsers: User[] = [
  {
    id: "doc-1",
    name: "د. أحمد محمد السعيد",
    email: "dr.ahmed@clinic.com",
    role: "doctor",
    phone: "0501234567",
    address: "عيادة السعادة، شارع الملك فهد، الرياض",
    licenseNumber: "DOC-12345",
    location: { lat: 24.7136, lng: 46.6753, city: "الرياض", area: "العليا" },
    createdAt: new Date("2020-01-15"),
  },
  {
    id: "doc-2",
    name: "د. فاطمة العلي",
    email: "dr.fatima@hospital.com",
    role: "doctor",
    phone: "0507654321",
    address: "مستشفى المملكة، الرياض",
    licenseNumber: "DOC-67890",
    location: { lat: 24.7236, lng: 46.6853, city: "الرياض", area: "النخيل" },
    createdAt: new Date("2019-06-20"),
  },
  {
    id: "hosp-1",
    name: "مستشفى المملكة التخصصي",
    email: "info@kingdom-hospital.com",
    role: "hospital",
    phone: "0112345678",
    address: "طريق الملك عبدالله، الرياض",
    licenseNumber: "HOSP-11111",
    location: { lat: 24.7336, lng: 46.6953, city: "الرياض", area: "الملقا" },
    createdAt: new Date("2015-03-10"),
  },
  {
    id: "pharm-1",
    name: "صيدلية الشفاء",
    email: "shifa@pharmacy.com",
    role: "pharmacy",
    phone: "0112223333",
    address: "شارع العليا، الرياض",
    licenseNumber: "PHARM-22222",
    location: { lat: 24.7036, lng: 46.6653, city: "الرياض", area: "العليا" },
    createdAt: new Date("2018-08-25"),
  },
  {
    id: "pharm-2",
    name: "صيدلية النهدي",
    email: "nahdi@pharmacy.com",
    role: "pharmacy",
    phone: "0113334444",
    address: "شارع التحلية، جدة",
    licenseNumber: "PHARM-33333",
    location: { lat: 21.5433, lng: 39.1728, city: "جدة", area: "التحلية" },
    createdAt: new Date("2017-04-12"),
  },
  {
    id: "ware-1",
    name: "مستودع الدواء المتحد",
    email: "info@united-pharma.com",
    role: "warehouse",
    phone: "0114445555",
    address: "المنطقة الصناعية، الرياض",
    licenseNumber: "WARE-44444",
    location: { lat: 24.6936, lng: 46.7053, city: "الرياض", area: "الصناعية" },
    createdAt: new Date("2010-11-30"),
  },
  {
    id: "ware-2",
    name: "شركة فارما العربية",
    email: "info@arab-pharma.com",
    role: "warehouse",
    phone: "0115556666",
    address: "المدينة الصناعية الثانية، الدمام",
    licenseNumber: "WARE-55555",
    location: { lat: 26.4207, lng: 50.0888, city: "الدمام", area: "الصناعية" },
    createdAt: new Date("2012-07-18"),
  },
]

// Mock Patients
export const mockPatients: Patient[] = [
  {
    id: "pat-1",
    nationalId: "1234567890",
    name: "محمد عبدالله الحربي",
    dateOfBirth: "1985-03-15",
    gender: "male",
    phone: "0551234567",
    address: "حي النزهة، الرياض",
    location: { lat: 24.7536, lng: 46.7153, city: "الرياض", area: "النزهة" },
    medicalHistory: ["ضغط دم مرتفع", "سكري نوع 2"],
    allergies: ["البنسلين"],
  },
  {
    id: "pat-2",
    nationalId: "0987654321",
    name: "سارة أحمد العمري",
    dateOfBirth: "1990-07-22",
    gender: "female",
    phone: "0559876543",
    address: "حي الملقا، الرياض",
    location: { lat: 24.7836, lng: 46.6453, city: "الرياض", area: "الملقا" },
    medicalHistory: ["الربو"],
    allergies: [],
  },
  {
    id: "pat-3",
    nationalId: "1122334455",
    name: "خالد سعود المطيري",
    dateOfBirth: "1978-11-08",
    gender: "male",
    phone: "0541122334",
    address: "حي الورود، الرياض",
    location: { lat: 24.7236, lng: 46.6953, city: "الرياض", area: "الورود" },
    medicalHistory: ["أمراض القلب"],
    allergies: ["السلفا"],
  },
]

// Mock Drugs with detailed information
export const mockDrugs: Drug[] = [
  {
    id: "drug-1",
    nameAr: "بنادول",
    nameEn: "Panadol",
    activeIngredient: "باراسيتامول",
    category: "مسكنات",
    form: "أقراص",
    strength: "500 مجم",
    manufacturer: "GSK",
    price: 12.5,
    isControlled: false,
    requiresYellowPrescription: false,
    stockQuantity: 500,
    expiryDate: "2026-12-31",
    barcode: "6281001234567",
    description: "مسكن للألم وخافض للحرارة",
    sideEffects: ["غثيان نادر", "طفح جلدي نادر"],
    contraindications: ["فرط الحساسية للباراسيتامول", "أمراض الكبد الحادة"],
    interactions: ["الوارفارين - يزيد تأثيره"],
    dosageGuidelines: [
      { ageGroup: "adult", dose: "500-1000 مجم", frequency: "كل 4-6 ساعات", maxDailyDose: "4000 مجم" },
      { ageGroup: "child", weightRange: { min: 10, max: 30 }, dose: "10-15 مجم/كجم", frequency: "كل 4-6 ساعات", maxDailyDose: "60 مجم/كجم" },
    ],
  },
  {
    id: "drug-2",
    nameAr: "أموكسيل",
    nameEn: "Amoxil",
    activeIngredient: "أموكسيسيلين",
    category: "مضادات حيوية",
    form: "كبسولات",
    strength: "500 مجم",
    manufacturer: "Pfizer",
    price: 28.0,
    isControlled: false,
    requiresYellowPrescription: false,
    stockQuantity: 200,
    expiryDate: "2025-08-15",
    barcode: "6281002345678",
    description: "مضاد حيوي واسع المجال",
    sideEffects: ["إسهال", "غثيان", "طفح جلدي"],
    contraindications: ["حساسية البنسلين"],
    interactions: ["الميثوتريكسات - يزيد سميته"],
    dosageGuidelines: [
      { ageGroup: "adult", dose: "500 مجم", frequency: "كل 8 ساعات", maxDailyDose: "3000 مجم" },
      { ageGroup: "child", dose: "25-50 مجم/كجم/يوم", frequency: "مقسمة على 3 جرعات", maxDailyDose: "100 مجم/كجم" },
    ],
  },
  {
    id: "drug-3",
    nameAr: "ترامادول",
    nameEn: "Tramadol",
    activeIngredient: "ترامادول هيدروكلوريد",
    category: "مسكنات أفيونية",
    form: "أقراص",
    strength: "50 مجم",
    manufacturer: "سبيماكو",
    price: 45.0,
    isControlled: true,
    requiresYellowPrescription: true,
    stockQuantity: 50,
    expiryDate: "2025-06-30",
    barcode: "6281003456789",
    description: "مسكن قوي للآلام المتوسطة إلى الشديدة",
    sideEffects: ["دوخة", "غثيان", "إمساك", "إدمان محتمل"],
    contraindications: ["إدمان سابق", "استخدام مثبطات MAO"],
    interactions: ["مضادات الاكتئاب - خطر متلازمة السيروتونين"],
    dosageGuidelines: [
      { ageGroup: "adult", dose: "50-100 مجم", frequency: "كل 4-6 ساعات", maxDailyDose: "400 مجم", notes: "يصرف بوصفة صفراء فقط" },
    ],
  },
  {
    id: "drug-4",
    nameAr: "جلوكوفاج",
    nameEn: "Glucophage",
    activeIngredient: "ميتفورمين",
    category: "أدوية السكري",
    form: "أقراص",
    strength: "850 مجم",
    manufacturer: "Merck",
    price: 35.0,
    isControlled: false,
    requiresYellowPrescription: false,
    stockQuantity: 300,
    expiryDate: "2026-03-20",
    barcode: "6281004567890",
    description: "دواء لعلاج السكري من النوع الثاني",
    sideEffects: ["اضطرابات معوية", "غثيان", "إسهال"],
    contraindications: ["أمراض الكلى الحادة", "الحماض الكيتوني"],
    dosageGuidelines: [
      { ageGroup: "adult", dose: "500-850 مجم", frequency: "مرتين يوميًا مع الطعام", maxDailyDose: "2550 مجم" },
    ],
  },
  {
    id: "drug-5",
    nameAr: "كونكور",
    nameEn: "Concor",
    activeIngredient: "بيسوبرولول",
    category: "أدوية القلب",
    form: "أقراص",
    strength: "5 مجم",
    manufacturer: "Merck",
    price: 55.0,
    isControlled: false,
    requiresYellowPrescription: false,
    stockQuantity: 150,
    expiryDate: "2026-09-10",
    barcode: "6281005678901",
    description: "دواء لعلاج ارتفاع ضغط الدم وفشل القلب",
    sideEffects: ["إرهاق", "دوخة", "بطء ضربات القلب"],
    contraindications: ["بطء القلب الشديد", "الربو الحاد"],
    dosageGuidelines: [
      { ageGroup: "adult", dose: "5-10 مجم", frequency: "مرة واحدة يوميًا", maxDailyDose: "20 مجم" },
    ],
  },
  {
    id: "drug-6",
    nameAr: "زيرتك",
    nameEn: "Zyrtec",
    activeIngredient: "سيتريزين",
    category: "مضادات الحساسية",
    form: "أقراص",
    strength: "10 مجم",
    manufacturer: "UCB",
    price: 22.0,
    isControlled: false,
    requiresYellowPrescription: false,
    stockQuantity: 400,
    expiryDate: "2026-07-25",
    barcode: "6281006789012",
    description: "مضاد للحساسية والحكة",
    sideEffects: ["نعاس خفيف", "جفاف الفم"],
    contraindications: ["فرط الحساسية للمادة الفعالة"],
    dosageGuidelines: [
      { ageGroup: "adult", dose: "10 مجم", frequency: "مرة واحدة يوميًا", maxDailyDose: "10 مجم" },
      { ageGroup: "child", dose: "5 مجم", frequency: "مرة واحدة يوميًا", maxDailyDose: "10 مجم", notes: "للأطفال 6-12 سنة" },
    ],
  },
  {
    id: "drug-7",
    nameAr: "مورفين",
    nameEn: "Morphine",
    activeIngredient: "مورفين سلفات",
    category: "مسكنات أفيونية",
    form: "أقراص",
    strength: "10 مجم",
    manufacturer: "سبيماكو",
    price: 80.0,
    isControlled: true,
    requiresYellowPrescription: true,
    stockQuantity: 20,
    expiryDate: "2025-04-15",
    barcode: "6281007890123",
    description: "مسكن قوي جدًا للآلام الشديدة",
    sideEffects: ["تثبيط التنفس", "إمساك شديد", "إدمان"],
    contraindications: ["تثبيط التنفس", "الربو الحاد"],
    dosageGuidelines: [
      { ageGroup: "adult", dose: "10-30 مجم", frequency: "كل 4 ساعات حسب الحاجة", maxDailyDose: "حسب تقدير الطبيب", notes: "يصرف بوصفة صفراء فقط - للاستخدام المحدود" },
    ],
  },
  {
    id: "drug-8",
    nameAr: "فنتولين",
    nameEn: "Ventolin",
    activeIngredient: "سالبوتامول",
    category: "أدوية الجهاز التنفسي",
    form: "بخاخ",
    strength: "100 ميكروجرام/بخة",
    manufacturer: "GSK",
    price: 38.0,
    isControlled: false,
    requiresYellowPrescription: false,
    stockQuantity: 250,
    expiryDate: "2026-01-30",
    barcode: "6281008901234",
    description: "موسع للقصبات الهوائية لعلاج الربو",
    sideEffects: ["رجفة", "تسارع القلب", "صداع"],
    contraindications: ["فرط الحساسية للسالبوتامول"],
    dosageGuidelines: [
      { ageGroup: "adult", dose: "1-2 بخة", frequency: "كل 4-6 ساعات حسب الحاجة", maxDailyDose: "8 بخات" },
      { ageGroup: "child", dose: "1 بخة", frequency: "كل 4-6 ساعات حسب الحاجة", maxDailyDose: "4 بخات" },
    ],
  },
]

// Mock Pharmacies
export const mockPharmacies: Pharmacy[] = [
  {
    id: "pharm-1",
    name: "صيدلية الشفاء",
    address: "شارع العليا، حي العليا، الرياض",
    phone: "0112223333",
    email: "shifa@pharmacy.com",
    licenseNumber: "PHARM-22222",
    location: { lat: 24.7036, lng: 46.6653, city: "الرياض", area: "العليا" },
    isOpen: true,
    openingHours: "24 ساعة",
    inventory: [],
  },
  {
    id: "pharm-2",
    name: "صيدلية النهدي",
    address: "شارع التحلية، حي الروضة، جدة",
    phone: "0113334444",
    email: "nahdi@pharmacy.com",
    licenseNumber: "PHARM-33333",
    location: { lat: 21.5433, lng: 39.1728, city: "جدة", area: "التحلية" },
    isOpen: true,
    openingHours: "8 ص - 12 م",
    inventory: [],
  },
  {
    id: "pharm-3",
    name: "صيدلية الدواء",
    address: "شارع الأمير سلطان، حي السليمانية، الرياض",
    phone: "0114445555",
    email: "dawaa@pharmacy.com",
    licenseNumber: "PHARM-44444",
    location: { lat: 24.7136, lng: 46.6853, city: "الرياض", area: "السليمانية" },
    isOpen: true,
    openingHours: "8 ص - 11 م",
    inventory: [],
  },
  {
    id: "pharm-4",
    name: "صيدلية المجتمع",
    address: "شارع الملك فهد، حي الملز، الرياض",
    phone: "0115556666",
    email: "community@pharmacy.com",
    licenseNumber: "PHARM-55555",
    location: { lat: 24.6836, lng: 46.7053, city: "الرياض", area: "الملز" },
    isOpen: false,
    openingHours: "9 ص - 10 م",
    inventory: [],
  },
]

// Mock Warehouses
export const mockWarehouses: Warehouse[] = [
  {
    id: "ware-1",
    name: "مستودع الدواء المتحد",
    type: "warehouse",
    address: "المنطقة الصناعية الأولى، الرياض",
    phone: "0114445555",
    email: "info@united-pharma.com",
    licenseNumber: "WARE-44444",
    drugs: mockDrugs,
  },
  {
    id: "ware-2",
    name: "شركة فارما العربية",
    type: "manufacturer",
    address: "المدينة الصناعية الثانية، الدمام",
    phone: "0115556666",
    email: "info@arab-pharma.com",
    licenseNumber: "WARE-55555",
    drugs: mockDrugs.filter((d) => d.manufacturer === "سبيماكو"),
  },
]

// Mock Prescriptions
export const mockPrescriptions: Prescription[] = [
  {
    id: "presc-1",
    prescriptionNumber: "RX-2024-001234",
    type: "regular",
    status: "pending",
    patientId: "pat-1",
    patient: mockPatients[0],
    doctorId: "doc-1",
    doctorName: "د. أحمد محمد السعيد",
    items: [
      {
        drugId: "drug-4",
        drugName: "جلوكوفاج 850 مجم",
        activeIngredient: "ميتفورمين",
        dosage: "850 مجم",
        frequency: "مرتين يوميًا",
        duration: "30 يوم",
        quantity: 60,
        instructions: "يؤخذ مع الطعام",
        isControlled: false,
      },
      {
        drugId: "drug-5",
        drugName: "كونكور 5 مجم",
        activeIngredient: "بيسوبرولول",
        dosage: "5 مجم",
        frequency: "مرة واحدة صباحًا",
        duration: "30 يوم",
        quantity: 30,
        instructions: "يؤخذ قبل الإفطار",
        isControlled: false,
      },
    ],
    diagnosis: "ارتفاع ضغط الدم مع سكري نوع 2",
    notes: "مراجعة بعد شهر لفحص السكر التراكمي",
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
  {
    id: "presc-2",
    prescriptionNumber: "RX-2024-001235",
    type: "yellow",
    status: "reserved",
    patientId: "pat-3",
    patient: mockPatients[2],
    doctorId: "doc-1",
    doctorName: "د. أحمد محمد السعيد",
    hospitalId: "hosp-1",
    hospitalName: "مستشفى المملكة التخصصي",
    pharmacyId: "pharm-1",
    pharmacyName: "صيدلية الشفاء",
    items: [
      {
        drugId: "drug-3",
        drugName: "ترامادول 50 مجم",
        activeIngredient: "ترامادول هيدروكلوريد",
        dosage: "50 مجم",
        frequency: "كل 6 ساعات عند الحاجة",
        duration: "7 أيام",
        quantity: 14,
        instructions: "للألم الشديد فقط - لا يتجاوز 4 حبات يوميًا",
        isControlled: true,
      },
    ],
    diagnosis: "ألم ما بعد العملية الجراحية",
    notes: "وصفة صفراء - يجب التحقق من هوية المريض",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000),
    reservedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "presc-3",
    prescriptionNumber: "RX-2024-001230",
    type: "regular",
    status: "dispensed",
    patientId: "pat-2",
    patient: mockPatients[1],
    doctorId: "doc-2",
    doctorName: "د. فاطمة العلي",
    pharmacyId: "pharm-3",
    pharmacyName: "صيدلية الدواء",
    items: [
      {
        drugId: "drug-8",
        drugName: "فنتولين بخاخ",
        activeIngredient: "سالبوتامول",
        dosage: "100 ميكروجرام/بخة",
        frequency: "1-2 بخة عند الحاجة",
        duration: "حسب الحاجة",
        quantity: 1,
        instructions: "للاستخدام عند ضيق التنفس",
        isControlled: false,
      },
      {
        drugId: "drug-6",
        drugName: "زيرتك 10 مجم",
        activeIngredient: "سيتريزين",
        dosage: "10 مجم",
        frequency: "مرة واحدة مساءً",
        duration: "14 يوم",
        quantity: 14,
        instructions: "قد يسبب نعاس خفيف",
        isControlled: false,
      },
    ],
    diagnosis: "حساسية موسمية مع ربو خفيف",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    dispensedAt: new Date(Date.now() - 46 * 60 * 60 * 1000),
  },
]

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    userId: "pharm-1",
    type: "prescription",
    title: "وصفة طبية جديدة",
    message: "وصفة جديدة من د. أحمد للمريض محمد الحربي - تحتوي على دواء مقيد",
    read: false,
    createdAt: new Date(),
  },
  {
    id: "notif-2",
    userId: "pharm-1",
    type: "stock",
    title: "تنبيه مخزون منخفض",
    message: "مخزون ترامادول 50 مجم أقل من 50 وحدة",
    read: false,
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: "notif-3",
    userId: "doc-1",
    type: "prescription",
    title: "تم صرف الوصفة",
    message: "تم صرف الوصفة RX-2024-001230 للمريضة سارة العمري",
    read: true,
    createdAt: new Date(Date.now() - 86400000),
  },
]

// Helper function to get user by credentials
export function authenticateUser(email: string, password: string): User | null {
  // In a real app, this would verify against hashed passwords
  // For demo, we accept any password for our mock users
  const user = mockUsers.find((u) => u.email === email)
  if (user && password.length >= 4) {
    return user
  }
  return null
}

// Helper function to find nearest pharmacies
export function findNearestPharmacies(
  lat: number,
  lng: number,
  limit: number = 5
): Pharmacy[] {
  const pharmaciesWithDistance = mockPharmacies.map((pharmacy) => {
    const distance = calculateDistance(
      lat,
      lng,
      pharmacy.location.lat,
      pharmacy.location.lng
    )
    return { ...pharmacy, distance }
  })

  return pharmaciesWithDistance
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
}

// Haversine formula to calculate distance between two points
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}
