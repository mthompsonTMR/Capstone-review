// src/types/patient.ts
export interface PatientType {
  fhirId?: string;
  name?: string;
  birthDate?: string;
  gender?: string;
  // Add any additional fields you use from the FHIR resource
}
