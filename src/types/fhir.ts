// src/types/fhir.ts
export interface SimplifiedFhirPatient {
  name?: Array<{
    family?: string;
    given?: string[];
  }>;
  gender?: string;
  birthDate?: string;
  identifier?: Array<{
    value?: string;
  }>;
  address?: Array<{
    line?: string[];
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  }>;
}
// ✅ Added from frontend handleDeletePatient
export interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  updatedAt?: string;
}