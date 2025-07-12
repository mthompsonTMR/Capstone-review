// src/lib/fhir/fetchFromHapi.ts

export async function getFhirPatientFromAPI(fhirId: string) {
  try {
    const res = await fetch(`https://hapi.fhir.org/baseR4/Patient/${fhirId}`);
    if (!res.ok) return null;

    const data = await res.json();

    return {
      fhirId: data.id,
      firstName: data.name?.[0]?.given?.[0] || "Unknown",
      lastName: data.name?.[0]?.family || "Unknown",
      birthDate: data.birthDate || null,
      gender: data.gender || "unknown",
      mrn: data.identifier?.[0]?.value || null,
      address: data.address?.[0]
        ? {
            line: data.address[0].line?.[0] || "",
            city: data.address[0].city || "",
            state: data.address[0].state || "",
            postalCode: data.address[0].postalCode || "",
            country: data.address[0].country || "",
          }
        : null,
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}
