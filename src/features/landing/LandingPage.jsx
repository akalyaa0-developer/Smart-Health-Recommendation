import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  Utensils, 
  ShoppingCart, 
  SlidersHorizontal, 
  Activity, 
  HeartHandshake, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  TrendingUp, 
  Flame, 
  Heart,
  Droplets,
  Moon,
  Zap,
  Info,
  MessageSquareHeart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function LandingPage({ onGetStarted, onSignIn }) {
  const [activeTab, setActiveTab] = useState('explainable');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Notification Bar */}
      <div className="bg-emerald-950 text-emerald-100 py-2 px-4 text-center text-xs font-medium border-b border-emerald-900/60">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Introducing <strong>IntelWell</strong> — Adaptive, Explainable Nutrition &amp; Wellness Intelligence</span>
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/70 bg-gradient-to-b from-white via-emerald-50/20 to-slate-50">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-200/25 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Pitch */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Next-Generation Personalized Wellness</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-display leading-[1.12]">
                Nutrition &amp; Wellness recommendations{' '}
                <span className="text-emerald-600 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
                  that adapt to your biology.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Generic wellness apps give everyone the same rigid advice. 
                IntelWell combines your unique biometrics, daily assessments, 
                and feedback loops to generate transparent, explainable recommendations 
                that evolve day by day.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Button 
                  size="lg" 
                  variant="primary" 
                  iconRight={ArrowRight}
                  onClick={onGetStarted}
                  className="w-full sm:w-auto shadow-md hover:shadow-emerald-500/25"
                >
                  Get Started Free
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={onSignIn}
                  className="w-full sm:w-auto text-slate-700"
                >
                  Sign In
                </Button>
              </div>
            </div>

            {/* Right Interactive Mockup Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md">
                {/* Glow ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-3xl blur-md opacity-30 animate-pulse" />
                
                <Card className="relative bg-white/95 border-emerald-100/80 shadow-xl overflow-hidden p-6 space-y-4">
                  {/* Mock Card Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                        IW
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">IntelWell Daily Recommendation</p>
                        <p className="text-[10px] text-slate-400">Personalized for Sarah Chen</p>
                      </div>
                    </div>
                    <Badge variant="emerald" size="sm" icon={Sparkles}>
                      94% Match
                    </Badge>
                  </div>

                  {/* Recommendation Body */}
                  <div className="bg-emerald-50/60 rounded-xl p-3.5 border border-emerald-100/80">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                      Hydration &amp; Cellular Energy
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                      Increase Midday Fluid Cadence (+500ml)
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Your recent check-in logged 1.4L vs your target 2.5L. Drink a glass with mineral sea salt before 2:00 PM.
                    </p>
                  </div>

                  {/* "Why am I seeing this?" Button highlight */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">Explainable Recommendation</p>
                        <p className="text-[10px] text-slate-500">3 data factors weighed</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                      Why am I seeing this?
                    </span>
                  </div>

                  {/* Mini Meal suggestion */}
                  <div className="flex items-center gap-3 p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                    <img 
                      src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=80" 
                      alt="Chia Bowl" 
                      className="w-12 h-12 rounded-lg object-cover" 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase">Recommended Breakfast</p>
                      <p className="text-xs font-bold text-slate-800 truncate">Spiced Golden Chia &amp; Berry Bowl</p>
                      <p className="text-[11px] text-emerald-600 font-medium">14g Protein • 380 kcal • Vegan</p>
                    </div>
                  </div>

                  {/* Feedback Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-[11px] text-slate-400">Continuous feedback loops</span>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
                        👍 Helpful
                      </span>
                      <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px]">
                        👎 Not Helpful
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs. Solution Pillars */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">
              The Fundamental Difference
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 font-display">
              Generic Advice Fails. Adaptive Intelligence Thrives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Old Way */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200">
              <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">
                Traditional Wellness Apps
              </span>
              <ul className="mt-6 space-y-4 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span><strong>Static generic meal plans</strong> that don’t adapt when you had poor sleep or high stress.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span><strong>Black-box advice</strong> with zero transparency into why an item was suggested.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span><strong>Rigid calorie counting</strong> that leads to mental fatigue and abandonment.</span>
                </li>
              </ul>
            </div>

            {/* The IntelWell Way */}
            <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-200 shadow-sm">
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold">
                IntelWell Adaptive Engine
              </span>
              <ul className="mt-6 space-y-4 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Transparent "Why am I seeing this?"</strong> explainability breakdowns for every recommendation.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Adaptive feedback loop:</strong> Dislike an ingredient or meal? The engine down-weights it in real time.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Non-medical safety guardrails</strong> with user-controlled trusted contacts and crisis redirection.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Tabs */}
      <section className="py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">
              Engineered for Real Human Lifestyles
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 font-display">
              Explore the IntelWell Platform
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { id: 'explainable', label: 'Explainable AI', icon: HelpCircle },
              { id: 'meals', label: 'Adaptive Meal Planner', icon: Utensils },
              { id: 'grocery', label: 'Smart Grocery List', icon: ShoppingCart },
              { id: 'companion', label: 'AI Wellness Companion', icon: MessageSquareHeart },
              { id: 'contacts', label: 'Trusted Assistance', icon: HeartHandshake }
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Display */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
            {activeTab === 'explainable' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <Badge variant="emerald" size="md">Transparent Logic</Badge>
                  <h3 className="text-2xl font-bold text-slate-900">
                    "Why am I seeing this?" — Complete transparency in every recommendation
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Unlike opaque algorithms that offer mysterious advice, IntelWell provides 
                    an explicit breakdown of the data points considered: your hydration delta, 
                    sleep quality rating, active dietary goals, and allergic safety constraints.
                  </p>
                  <div className="space-y-2 pt-2">
                    <div className="p-3 bg-emerald-50/60 rounded-xl text-xs flex items-center gap-2 text-emerald-900 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Shows exact biometric and daily assessment triggers</span>
                    </div>
                    <div className="p-3 bg-emerald-50/60 rounded-xl text-xs flex items-center gap-2 text-emerald-900 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Explains how past feedback tuned the suggestion</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Sample Explainability Breakdown
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-xs space-y-1">
                    <span className="font-bold text-slate-800">Trigger:</span>
                    <p className="text-slate-600">Logged 1.2L of water yesterday (Target: 2.5L), with afternoon fatigue reported.</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-xs space-y-1">
                    <span className="font-bold text-slate-800">Dietary Verification:</span>
                    <p className="text-slate-600">Verified 100% vegetarian, strictly excluded peanuts allergen.</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-xs space-y-1">
                    <span className="font-bold text-slate-800">Adaptive Influence:</span>
                    <p className="text-slate-600">High preference for whole grains and citrus dressings reflected.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'meals' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <Badge variant="teal" size="md">Chef-Crafted &amp; Science-Backed</Badge>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Adaptive meals that respect your time and palate
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Get customized Breakfast, Lunch, Dinner, and Snack recommendations tailored 
                    to your exact caloric needs, macro ratios, and cooking speed preference. 
                    Don't like an option? One-click "Swap Meal" finds a delicious alternative.
                  </p>
                  <Button variant="primary" size="md" onClick={onGetStarted}>
                    Get Started with Personalized Meals
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80" 
                    alt="Chia Bowl" 
                    className="w-full h-36 rounded-2xl object-cover" 
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=80" 
                    alt="Quinoa Salad" 
                    className="w-full h-36 rounded-2xl object-cover" 
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&auto=format&fit=crop&q=80" 
                    alt="Citrus Salmon" 
                    className="w-full h-36 rounded-2xl object-cover" 
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1547592180-85f173990554?w=400&auto=format&fit=crop&q=80" 
                    alt="Bean Braise" 
                    className="w-full h-36 rounded-2xl object-cover" 
                  />
                </div>
              </div>
            )}

            {activeTab === 'grocery' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <Badge variant="indigo" size="md">Zero Hassle Shopping</Badge>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Smart Grocery Lists organized by supermarket department
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Generate an organized shopping list directly from your recommended meals 
                    or weekly plan. Grouped automatically by Produce, Proteins, Pantry, 
                    Dairy/Plant Alternatives, and Spices with easy checking and clipboard export.
                  </p>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <p className="font-bold text-slate-800 uppercase tracking-wider">Department Preview</p>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="font-semibold text-slate-800">[PRODUCE] Baby Spinach, Fresh Blueberries</span>
                    <span className="text-emerald-600 font-bold">2 items</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="font-semibold text-slate-800">[PANTRY] Chia Seeds, Tricolor Quinoa</span>
                    <span className="text-emerald-600 font-bold">2 items</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="font-semibold text-slate-800">[DAIRY/ALT] Unsweetened Almond Milk</span>
                    <span className="text-emerald-600 font-bold">1 item</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'companion' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <Badge variant="amber" size="md">Context-Aware AI</Badge>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Your personal wellness assistant with strict safety boundaries
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Ask natural questions about hydration hacks, high-protein plant snacks, 
                    or sleep hygiene. The assistant knows your goals, while adhering to strict 
                    non-medical policies that redirect red-flag symptoms to certified emergency care.
                  </p>
                </div>
                <div className="space-y-2 bg-slate-900 p-5 rounded-2xl text-xs text-white">
                  <div className="bg-slate-800 p-3 rounded-xl max-w-[85%] ml-auto text-emerald-300">
                    "Suggest a high-protein plant snack for my afternoon slump."
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl max-w-[90%] text-slate-200 border border-slate-700">
                    "Since you're aiming for sustained energy, Sarah, try steamed edamame with sea salt (17g protein) or a smoothie with organic pea protein and pumpkin seeds!"
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contacts' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <Badge variant="rose" size="md">User-Controlled Peace of Mind</Badge>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Trusted Contacts &amp; Explicit Assistance Requests
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Configure friends, family members, or emergency contacts. You maintain 100% 
                    control over when alerts are dispatched through an intentional confirmation 
                    flow. Never automated spam, always user-consented.
                  </p>
                </div>
                <div className="p-6 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-rose-800 font-bold">
                    <HeartHandshake className="w-5 h-5 text-rose-600" />
                    <span>User-Initiated Assistance Workflow</span>
                  </div>
                  <p className="text-slate-600">
                    Clicking "Request Assistance" opens an explicit safety modal to confirm your request 
                    before transmitting a summary to your designated trusted contacts.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Medical Safety & Compliance Section */}
      <section className="py-12 bg-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Safety &amp; Ethical AI Design Standards</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display">
            Built with Strict Ethical Guardrails
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            IntelWell is strictly a lifestyle and nutritional wellness recommendation application. 
            It is not intended to diagnose disease, prescribe medications, or replace qualified medical professionals. 
            Acute medical symptoms trigger immediate crisis hotline contacts (911, 988, 112).
          </p>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-gradient-to-r from-emerald-800 to-teal-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display">
            Ready to experience wellness intelligence tailored to you?
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto">
            Join IntelWell today to receive explainable nutrition and lifestyle recommendations that adapt with every check-in.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button size="lg" variant="accent" onClick={onGetStarted}>
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={onSignIn}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              Sign In to Your Account
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
