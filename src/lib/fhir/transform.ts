// src/lib/fhir/transform.ts
import { SimplifiedFhirPatient } from "@/types/fhir";

export function transformFhirToSimplified(patientData: any): SimplifiedFhirPatient {
  return {
    name: patientData.name || [],
    gender: patientData.gender || "unknown",
    birthDate: patientData.birthDate || null,
    identifier: patientData.identifier || [],
    address: patientData.address || [],
  };
}
