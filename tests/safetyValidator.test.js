import { describe, it, expect } from 'vitest';
import { evaluateEmergencyRisk } from '../src/utils/safetyValidator';

describe('Safety Validator & Medical Guardrails', () => {
  it('detects acute red-flag symptoms and triggers emergency advisory', () => {
    const dangerousInput = 'I have sudden severe chest pain and cannot catch my breath';
    const result = evaluateEmergencyRisk(dangerousInput);

    expect(result.isEmergency).toBe(true);
    expect(result.detectedKeyword).toBe('chest pain');
    expect(result.hotlines.length).toBeGreaterThan(0);
    expect(result.hotlines.some(h => h.number === '911')).toBe(true);
  });

  it('detects medical diagnosis requests and provides non-diagnostic disclaimer', () => {
    const diagnosticQuery = 'Please diagnose me and tell me what dosage of medication to take';
    const result = evaluateEmergencyRisk(diagnosticQuery);

    expect(result.isEmergency).toBe(false);
    expect(result.isDiagnosticQuery).toBe(true);
    expect(result.advisory).toContain('does not provide medical diagnoses');
  });

  it('passes normal lifestyle and nutrition inquiries without false alarms', () => {
    const safeInput = 'What are healthy high-protein snacks for post-workout?';
    const result = evaluateEmergencyRisk(safeInput);

    expect(result.isEmergency).toBe(false);
    expect(result.isDiagnosticQuery).toBe(false);
  });
});
