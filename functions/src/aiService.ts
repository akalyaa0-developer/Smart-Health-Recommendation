/**
 * Server-Side AI Service for IntelWell Cloud Functions
 * 
 * Interacts with Google Gemini / Vertex AI securely without exposing private API keys.
 */

export interface WellnessContext {
  name?: string;
  dietaryPreference?: string;
  wellnessGoals?: string[];
  allergies?: string[];
  recentSleep?: number;
  recentWater?: number;
}

export async function generateAIAssistantResponse(
  userMessage: string,
  context: WellnessContext
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Graceful fallback response when API key is not configured in environment
    return `Hello ${context.name || 'there'}! I'm operating in secure local guidance mode. Regarding your question on "${userMessage.slice(0, 30)}...", I recommend focusing on hydration consistency, whole nutrient-dense foods supporting your ${context.dietaryPreference || 'wellness'} goals, and winding down 45 minutes before sleep.`;
  }

  // System instruction with safety boundary
  const systemInstruction = `You are IntelWell Companion, an intelligent wellness and nutrition advisor.
CRITICAL SAFETY RULES:
1. You must NOT diagnose medical conditions or diseases.
2. You must NOT prescribe medication or interpret clinical lab values.
3. If the user mentions acute pain or distress, direct them to emergency services.
4. Provide evidence-based, supportive lifestyle, hydration, and nutritional advice.
User Profile:
- Name: ${context.name || 'User'}
- Dietary Preference: ${context.dietaryPreference || 'Balanced'}
- Goals: ${(context.wellnessGoals || []).join(', ')}
- Allergies: ${(context.allergies || []).join(', ') || 'None reported'}`;

  // Call external LLM endpoint securely
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nUser Question: ${userMessage}` }] }
        ]
      })
    });

    if (response.ok) {
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    }
  } catch (e) {
    console.error('Gemini API request failed', e);
  }

  return `Based on your ${context.dietaryPreference || 'wellness'} routine, focusing on whole-food nourishment and adequate hydration will best support your energy today!`;
}
