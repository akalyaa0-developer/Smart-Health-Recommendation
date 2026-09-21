# IntelWell Backend API Specification

This specification documents the Firebase Cloud Functions endpoints and client callable methods.

---

## 1. `POST /aiAssistant`
Conversational proxy for context-aware wellness guidance with server-side safety verification.

### Request Headers
```http
Content-Type: application/json
```

### Request Body
```json
{
  "message": "What high-protein snacks support energy?",
  "userContext": {
    "name": "Sarah Chen",
    "dietaryPreference": "vegetarian",
    "wellnessGoals": ["energy", "gut_health"],
    "allergies": ["peanuts"],
    "recentSleep": 7.5,
    "recentWater": 2.2
  },
  "conversationHistory": []
}
```

### Successful Response (`200 OK`)
```json
{
  "reply": "Since your goal is sustained energy and you follow a vegetarian lifestyle, try steamed edamame with sea salt (approx 17g protein per cup)..."
}
```

### Safety Red-Flag Interception (`200 OK`)
```json
{
  "reply": "Emergency symptom detected (chest pain). Medical guidance: Contact local emergency services (911/988/112) immediately.",
  "isEmergency": true,
  "requiresClinicalCare": true
}
```

---

## 2. `POST /generateWeeklySummary` (Callable Cloud Function)
Synthesizes a user's past 7 daily assessments into an executive habit recap.

### Parameters
```json
{
  "userId": "user-12345"
}
```

### Response
```json
{
  "userId": "user-12345",
  "periodDays": 7,
  "summary": "Analyzed 7 daily assessments. General wellness score trend indicates positive hydration stability.",
  "generatedAt": "2026-09-19T17:20:00Z"
}
```

---

## 3. `POST /sendAssistanceAlert` (Callable Cloud Function)
Transmits a user-authorized assistance check-in message to a configured trusted contact.

### Parameters
```json
{
  "contactId": "tc-1",
  "contactName": "David Chen",
  "contactPhone": "+1 (555) 234-5678",
  "userStatus": "Voluntary check-in requested by user"
}
```

### Response
```json
{
  "success": true,
  "message": "Assistance alert transmitted to David Chen.",
  "timestamp": "2026-09-19T17:20:00Z"
}
```
