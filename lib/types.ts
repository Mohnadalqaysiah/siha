// User Types
export type UserRole = "doctor" | "hospital" | "pharmacy" | "warehouse" | "pharma_company" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  phone: string
  address: string
  licenseNumber: string
  location?: {
    lat: number
    lng: number
    city: string
    area: string
  }
  createdAt: Date
}

// Patient
export interface Patient {
  id: string
  nationalId: string
  name: string
  dateOfBirth: string
  gender: "male" | "female"
  phone: string
  address: string
  location?: {
    lat: number
    lng: number
    city: string
    area: string
  }
  medicalHistory?: string[]
  allergies?: string[]
}

// Prescription Types
export type PrescriptionStatus = "pending" | "reserved" | "dispensed" | "expired" | "cancelled"
export type PrescriptionType = "regular" | "yellow" | "controlled"

export interface PrescriptionItem {
  drugId: string
  drugName: string
  activeIngredient: string
  dosage: string
  frequency: string
  duration: string
  quantity: number
  instructions: string
  isControlled: boolean
}

export interface Prescription {
  id: string
  prescriptionNumber: string
  type: PrescriptionType
  status: PrescriptionStatus
  patientId: string
  patient: Patient
  doctorId: string
  doctorName: string
  hospitalId?: string
  hospitalName?: string
  pharmacyId?: string
  pharmacyName?: string
  items: PrescriptionItem[]
  diagnosis: string
  notes?: string
  createdAt: Date
  expiresAt: Date
  reservedAt?: Date
  dispensedAt?: Date
}

// Drug Types
export interface Drug {
  id: string
  nameAr: string
  nameEn: string
  activeIngredient: string
  category: string
  form: string
  strength: string
  manufacturer: string
  price: number
  isControlled: boolean
  requiresYellowPrescription: boolean
  stockQuantity: number
  expiryDate: string
  barcode: string
  description?: string
  sideEffects?: string[]
  contraindications?: string[]
  interactions?: string[]
  dosageGuidelines?: DosageGuideline[]
}

export interface DosageGuideline {
  ageGroup: "infant" | "child" | "adult" | "elderly"
  weightRange?: { min: number; max: number }
  dose: string
  frequency: string
  maxDailyDose: string
  notes?: string
}

// Pharmacy Types
export interface Pharmacy {
  id: string
  name: string
  address: string
  phone: string
  email: string
  licenseNumber: string
  location: {
    lat: number
    lng: number
    city: string
    area: string
  }
  isOpen: boolean
  openingHours: string
  inventory: InventoryItem[]
}

export interface InventoryItem {
  drugId: string
  drug: Drug
  quantity: number
  batchNumber: string
  expiryDate: string
  purchasePrice: number
  sellingPrice: number
  lastUpdated: Date
}

// Warehouse/Pharmaceutical Company Types
export interface Warehouse {
  id: string
  name: string
  type: "warehouse" | "manufacturer"
  address: string
  phone: string
  email: string
  licenseNumber: string
  drugs: Drug[]
}

export interface SalesReport {
  id: string
  warehouseId: string
  drugId: string
  drugName: string
  period: { start: Date; end: Date }
  totalQuantitySold: number
  totalRevenue: number
  pharmacies: { id: string; name: string; quantity: number }[]
  doctors: { id: string; name: string; prescriptionCount: number }[]
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: "prescription" | "stock" | "expiry" | "system"
  title: string
  message: string
  read: boolean
  createdAt: Date
}
