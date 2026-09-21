/**
 * Server-Side Safety Rules & Emergency Interceptor for IntelWell Cloud Functions
 */

export const RED_FLAG_SYMPTOMS = [
  'chest pain',
  'heart attack',
  'shortness of breath',
  'difficulty breathing',
  'stroke',
  'face drooping',
  'suicide',
  'kill myself',
  'end my life',
  'self harm',
  'severe allergic reaction',
  'anaphylaxis',
  'heavy bleeding'
];

export function verifyServerSafety(input: string): { safe: boolean; warning?: string; emergency?: boolean } {
  const lower = (input || '').toLowerCase();

  for (const redFlag of RED_FLAG_SYMPTOMS) {
    if (lower.includes(redFlag)) {
      return {
        safe: false,
        emergency: true,
        warning: `Emergency symptom detected (${redFlag}). Medical guidance: Contact local emergency services (911/988/112) immediately.`
      };
    }
  }

  if (lower.includes('prescribe') || lower.includes('diagnose me')) {
    return {
      safe: false,
      emergency: false,
      warning: 'IntelWell does not provide clinical medical diagnoses or pharmaceutical prescriptions.'
    };
  }

  return { safe: true };
}
