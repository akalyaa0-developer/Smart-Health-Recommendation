/**
 * Safety Validator for IntelWell
 * 
 * Strict non-diagnostic guardrails and emergency red-flag symptom detector.
 * IntelWell does NOT diagnose diseases, prescribe medication, or replace emergency medical care.
 */

// Critical red-flag symptom keywords that indicate acute medical distress
export const EMERGENCY_KEYWORDS = [
  'chest pain',
  'heart attack',
  'shortness of breath',
  'difficulty breathing',
  'cannot breathe',
  'stroke',
  'numbness in arm',
  'face drooping',
  'suicide',
  'kill myself',
  'end my life',
  'self harm',
  'severe allergic reaction',
  'anaphylaxis',
  'swollen throat',
  'unconscious',
  'severe head injury',
  'coughing blood',
  'sudden severe headache',
  'heavy bleeding'
];

export const MEDICAL_DIAGNOSIS_KEYWORDS = [
  'diagnose me',
  'do i have diabetes',
  'do i have cancer',
  'do i have depression',
  'prescribe me',
  'what dosage of medication',
  'should i stop taking my insulin',
  'replace my medicine',
  'cure disease'
];

/**
 * Evaluates user input (such as notes or chat queries) for emergency keywords.
 * Returns an object with risk assessment and recommended action.
 */
export function evaluateEmergencyRisk(text) {
  if (!text || typeof text !== 'string') {
    return { isEmergency: false, detectedKeyword: null, advisory: null };
  }

  const lower = text.toLowerCase();

  for (const keyword of EMERGENCY_KEYWORDS) {
    if (lower.includes(keyword)) {
      return {
        isEmergency: true,
        detectedKeyword: keyword,
        title: 'Immediate Medical Attention Recommended',
        advisory: `You mentioned symptoms related to "${keyword}". This may indicate an acute condition requiring prompt evaluation. Please contact emergency services (such as 911 or your local emergency number) or visit the nearest emergency room immediately.`,
        hotlines: [
          { name: 'Emergency Services (US/Canada)', number: '911' },
          { name: 'Suicide & Crisis Lifeline (US)', number: '988' },
          { name: 'Emergency Services (UK)', number: '999' },
          { name: 'Emergency Services (Europe/India)', number: '112' }
        ]
      };
    }
  }

  for (const query of MEDICAL_DIAGNOSIS_KEYWORDS) {
    if (lower.includes(query)) {
      return {
        isEmergency: false,
        isDiagnosticQuery: true,
        detectedKeyword: query,
        title: 'Non-Medical Guidance Notice',
        advisory: 'IntelWell is an informational wellness and lifestyle platform. It does not provide medical diagnoses, treatment plans, or pharmaceutical advice. Please consult a board-certified physician for personalized clinical care.'
      };
    }
  }

  return { isEmergency: false, isDiagnosticQuery: false, detectedKeyword: null };
}

/**
 * Standard disclaimer text for IntelWell
 */
export const MEDICAL_DISCLAIMER = 
  'IntelWell provides lifestyle, hydration, and nutritional wellness suggestions based on self-reported data. It is not intended as medical advice, clinical diagnosis, or treatment. Always consult a qualified healthcare provider regarding any health condition.';
