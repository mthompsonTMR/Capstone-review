// src/utils/transformCSV.ts

export function transformSlideCSVRow(row: any) {
  return {
    pmSerialNumber: row["PM serial number"]?.trim(),
    caseId: row["Case ID"]?.trim(),
    runId: row["Run ID"]?.trim(),
    slideId: row["Slide ID"]?.trim(),
    createdBy: row["Slide created by"]?.trim().toLowerCase(),
    processDate: new Date(row["Process date"]),
    markerName: row["Marker name"]?.trim(),

    // Optional: Additional metadata for future reference
    tissueType: row["Tissue type"]?.trim(),
    stainType: row["Stain"]?.trim(),
    status: row["Status"]?.trim(),
    comments: row["Comments"]?.trim(),
    stainingProtocol: row["Staining protocol name"]?.trim(),
    detectionSystem: row["Detection system name"]?.trim(),
    detectionKitSerial: row["Detection system serial number"]?.trim()
  };
}
