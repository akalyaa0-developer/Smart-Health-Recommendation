/**
 * AI Wellness Assistant Service ("IntelWell Companion")
 * 
 * Context-aware conversational wellness guidance with strict safety boundaries.
 * Enforces non-diagnostic policies and emergency symptom redirection.
 */

import { evaluateEmergencyRisk } from '../utils/safetyValidator';
import { auth, isFirebaseConfigured } from '../firebase/config';

export async function askWellnessAssistant(userMessage, conversationHistory = [], userContext = {}) {
  // 1. Safety Guardrail: Evaluate emergency risk
  const safetyCheck = evaluateEmergencyRisk(userMessage);
  if (safetyCheck.isEmergency) {
    return {
      reply: safetyCheck.advisory,
      isEmergency: true,
      hotlines: safetyCheck.hotlines,
      detectedKeyword: safetyCheck.detectedKeyword
    };
  }

  if (safetyCheck.isDiagnosticQuery) {
    return {
      reply: `${safetyCheck.advisory}\n\nWhile I cannot diagnose conditions or interpret lab values, I can happily suggest wholesome nutritional habits, hydration strategies, or sleep routines that support general vitality!`,
      isDiagnosticNotice: true
    };
  }

  // 2. Check if a remote Cloud Function endpoint is configured
  const cloudFunctionUrl = import.meta.env?.VITE_FUNCTIONS_API_URL;
  if (cloudFunctionUrl) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (isFirebaseConfigured && auth?.currentUser) {
        try {
          const token = await auth.currentUser.getIdToken();
          headers['Authorization'] = `Bearer ${token}`;
        } catch (tokenErr) {
          console.warn('Unable to retrieve auth token for AI Assistant', tokenErr);
        }
      }

      const response = await fetch(`${cloudFunctionUrl}/aiAssistant`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: userMessage, conversationHistory, userContext })
      });
      if (response.ok) {
        const data = await response.json();
        return { reply: data.reply };
      }
    } catch (e) {
      console.warn('Cloud Function unavailable, using intelligent local engine', e);
    }
  }

  // 3. Intelligent Local Heuristic Assistant Engine
  const reply = generateContextualAssistantReply(userMessage, userContext);
  return { reply };
}

function generateContextualAssistantReply(message, context = {}) {
  const lower = message.toLowerCase();
  const name = context?.name || 'there';
  const diet = context?.dietaryPreference ? `${context.dietaryPreference}` : 'balanced';
  const goals = (context?.wellnessGoals || []).map(g => g.replace('_', ' ')).join(', ');
  const recentSleep = context?.recentSleep || 7.2;
  const recentWater = context?.recentWater || 2.0;

  // Hydration questions
  if (lower.includes('water') || lower.includes('hydration') || lower.includes('thirsty')) {
    return `Staying ahead of hydration is one of the most effective habits for your goal of ${goals || 'overall vitality'}, ${name}. Since your recent assessment logged around ${recentWater}L, aim to sip 250ml every 90 minutes. Adding a slice of cucumber or a pinch of sea salt can also boost cellular uptake without added sugars.`;
  }

  // High-protein / Snack questions
  if (lower.includes('protein') || lower.includes('snack') || lower.includes('post-workout') || lower.includes('workout')) {
    if (diet.includes('vegan') || diet.includes('vegetarian')) {
      return `For a satisfying, high-protein ${diet} snack, ${name}, try edamame tossed with sea salt and sesame seeds (approx 17g protein per cup), or a smoothie made with organic pea protein, hemp seeds, and almond milk. Roasted crispy chickpeas are also fantastic for sustained crunch and fiber!`;
    }
    return `For quick sustained recovery, consider 2 pasture-raised hard-boiled eggs with a sprinkle of smoked paprika, or a cup of Greek yogurt with raw pumpkin seeds and a handful of berries. These provide clean amino acids with healthy fats to sustain muscle synthesis.`;
  }

  // Sleep questions
  if (lower.includes('sleep') || lower.includes('tired') || lower.includes('insomnia') || lower.includes('rest')) {
    return `Improving nocturnal recovery starts in the late afternoon, ${name}. Based on your recent sleep log of ${recentSleep} hours, try dimming screens at least 45 minutes before bed to allow natural melatonin production. Gentle magnesium-rich evening teas like chamomile or lemon balm, paired with a few slow box-breaths, help switch your nervous system into restorative parasympathetic mode.`;
  }

  // Stress & Anxiety questions
  if (lower.includes('stress') || lower.includes('anxious') || lower.includes('overwhelmed') || lower.includes('burnout')) {
    return `When stress rises, your sympathetic nervous system is actively working to protect you. Try a physiological sigh right now: two quick inhalations through the nose followed by one long, slow exhale through the mouth. Repeating this 3 times has been shown in human trials to immediately lower resting heart rate. Nourishing warm meals with complex carbs also support neurotransmitter balance.`;
  }

  // Energy & Slump questions
  if (lower.includes('energy') || lower.includes('fatigue') || lower.includes('slump') || lower.includes('tired afternoon')) {
    return `Afternoon slumps are frequently linked to mild dehydration or rapid glucose drops from high-glycemic lunches. To keep your energy steady for ${goals || 'your day'}, try a 10-minute light walking break in natural daylight, followed by a tall glass of cool water and a handful of raw walnuts or pumpkin seeds.`;
  }

  // Meal planning & diet questions
  if (lower.includes('meal') || lower.includes('recipe') || lower.includes('dinner') || lower.includes('lunch') || lower.includes('breakfast')) {
    return `Keeping your ${diet} nutrition plan aligned with your goals is seamless when meals center on whole, nutrient-dense ingredients. Our Meal Planner page features curated recipes that exclude any allergens you've configured. Would you like ideas for a fast 15-minute skillet dish or a batch-prep grain bowl?`;
  }

  // Default friendly guidance
  return `Hello ${name}! As your IntelWell companion, I'm here to support your daily wellness habits, nutrition choices, and recovery routines. We're currently optimizing for ${goals || 'vibrant wellness'}. How can I help you feel your best today?`;
}
