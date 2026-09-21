# IntelWell AI Safety & Ethical Guidelines

IntelWell is an informational wellness and nutritional recommendation application. It is designed under strict ethical, clinical, and user-safety constraints to ensure it never crosses into unauthorized medical practice.

---

## 1. Non-Diagnostic Guarantees

IntelWell explicitly enforces the following architectural boundaries:

1. **No Medical Diagnoses**: The system will never attempt to diagnose diseases, clinical syndromes, or psychological disorders (e.g. Type 2 Diabetes, Major Depressive Disorder, Cardiovascular Disease).
2. **No Prescription Advice**: The application never prescribes pharmaceuticals, alters doctor-prescribed dosages, or suggests replacing medications with dietary supplements.
3. **Transparent Uncertainty**: The application does not present heuristic calorie estimates or nutritional estimates as immutable clinical facts.
4. **Persistent Disclaimers**: Every screen, score gauge, and recommendation modal includes prominent notices stating:
   > *"IntelWell provides lifestyle and nutritional wellness suggestions based on self-reported data. It is not intended as medical advice, diagnosis, or clinical treatment."*

---

## 2. Emergency Red-Flag Symptom Interception

IntelWell implements a two-tier safety validation system (Client-Side & Cloud Function-Side):

### Red-Flag Keywords Monitored:
* **Cardiopulmonary**: `chest pain`, `heart attack`, `shortness of breath`, `cannot breathe`
* **Neurological**: `stroke`, `face drooping`, `numbness in arm`, `sudden severe headache`
* **Crisis & Mental Health**: `suicide`, `kill myself`, `end my life`, `self harm`
* **Acute Reactions**: `severe allergic reaction`, `anaphylaxis`, `swollen throat`, `heavy bleeding`

### Interception Behavior:
1. Normal conversational processing is immediately suspended.
2. A high-priority red alert modal is rendered with direct one-touch hotline dialing buttons:
   * **911**: US/Canada Emergency Services
   * **988**: US Suicide & Crisis Lifeline
   * **112 / 999**: Europe & UK Emergency Services
3. The user is instructed in unequivocal terms to contact emergency dispatchers immediately.

---

## 3. Trusted Contact Feature Governance

* **Strict User Control**: Contacts are never notified automatically based on algorithm inference. An assistance alert is only transmitted when the user explicitly taps **"Send Assistance Notice"** and confirms through a secondary verification dialog.
* **Consent First**: The contact directory is fully managed by the user, who can add, edit, or delete contacts at any time.
