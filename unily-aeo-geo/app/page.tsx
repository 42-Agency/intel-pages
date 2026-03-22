"use client";

import Image from "next/image";

export default function UnilyAEOGEOPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-2 border-[#1a1a1a] bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="https://intel.42agency.com" className="flex items-center gap-2">
            <Image src="/42-logo.png" alt="42 Agency" width={100} height={28} className="h-7 w-auto" />
          </a>
          <nav className="hidden md:flex items-center gap-1">
            <a href="https://intel.42agency.com/assess/" className="px-4 py-2 text-[#4a4a4a] text-sm font-medium rounded-lg hover:text-[#1a1a1a] hover:bg-[#f5f5f5] transition-all">Assess</a>
            <a href="https://intel.42agency.com/b2b-benchmarks/" className="px-4 py-2 text-[#4a4a4a] text-sm font-medium rounded-lg hover:text-[#1a1a1a] hover:bg-[#f5f5f5] transition-all">Benchmarks</a>
            <a href="https://intel.42agency.com/tools/" className="px-4 py-2 text-[#4a4a4a] text-sm font-medium rounded-lg hover:text-[#1a1a1a] hover:bg-[#f5f5f5] transition-all">Tools</a>
            <a href="https://www.42agency.com/contact-us" target="_blank" className="ml-2 px-4 py-2 bg-[#1a1a1a] text-white text-sm font-semibold rounded-lg hover:bg-[#333] transition-colors">Contact Us</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#f5f5f5] border-b-2 border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-white border-2 border-[#1a1a1a] rounded-full text-xs font-bold text-[#1a1a1a] shadow-[2px_2px_0px_0px_#1a1a1a]">
                  AEO/GEO INTEL REPORT
                </span>
                <span className="px-3 py-1 bg-[#EF4444]/10 border-2 border-[#EF4444] rounded-full text-xs font-bold text-[#EF4444]">
                  February 2024
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#1a1a1a] mb-4">
                Unily
              </h1>
              <p className="text-lg text-[#4a4a4a] mb-2">
                Employee Experience Platform / Enterprise Intranet
              </p>
              <a href="https://unily.com" target="_blank" className="text-[#3B82F6] hover:underline text-sm font-medium">
                unily.com
              </a>
            </div>

            {/* AEO Score Card */}
            <div className="bg-white border-2 border-[#1a1a1a] rounded-2xl p-8 shadow-[6px_6px_0px_0px_#1a1a1a] text-center min-w-[200px]">
              <p className="text-sm font-bold text-[#6b6b6b] uppercase tracking-wide mb-2">AEO Score</p>
              <div className="text-6xl font-extrabold text-[#EF4444] mb-2">3<span className="text-3xl text-[#6b6b6b]">/10</span></div>
              <p className="text-sm text-[#6b6b6b]">Critical Gap in AI Visibility</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Finding Alert */}
      <section className="bg-[#EF4444] border-b-2 border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-[#1a1a1a]">
              <svg className="w-6 h-6 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-1">Critical Gap Identified</h2>
              <p className="text-white/90">
                Unily receives <span className="font-bold">ZERO mentions</span> across all AI engines (ChatGPT, Perplexity, Gemini) for "employee experience platform" queries - despite being an EX platform. This represents a significant missed opportunity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Engine Results Section */}
      <section className="py-16 px-6 border-b-2 border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#1a1a1a] mb-8">AI Engine Results</h2>

          {/* Query 1: Employee Experience Platforms */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-xl font-bold text-[#1a1a1a]">&quot;Best Employee Experience Platforms&quot;</h3>
              <span className="px-3 py-1 bg-[#EF4444]/10 border-2 border-[#EF4444] rounded-full text-xs font-bold text-[#EF4444]">
                0 Mentions
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                { engine: "ChatGPT", mentions: 0 },
                { engine: "Perplexity", mentions: 0 },
                { engine: "Gemini", mentions: 0 },
              ].map((item) => (
                <div key={item.engine} className="bg-white border-2 border-[#1a1a1a] rounded-xl p-6 shadow-[4px_4px_0px_0px_#EF4444]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-[#1a1a1a]">{item.engine}</span>
                    <span className="px-2 py-1 bg-[#EF4444] text-white text-xs font-bold rounded">FAIL</span>
                  </div>
                  <div className="text-3xl font-extrabold text-[#EF4444]">{item.mentions}</div>
                  <p className="text-sm text-[#6b6b6b]">mentions</p>
                </div>
              ))}
            </div>

            {/* Competitor Comparison */}
            <div className="bg-[#f5f5f5] border-2 border-[#1a1a1a] rounded-xl p-6">
              <h4 className="font-bold text-[#1a1a1a] mb-4">Top EX Platform Competitors by AI Mentions</h4>
              <div className="space-y-3">
                {[
                  { name: "Culture Amp", total: 183, chatgpt: 16, perplexity: 33, gemini: 134 },
                  { name: "Qualtrics", total: 157, chatgpt: 16, perplexity: 52, gemini: 89 },
                  { name: "Workday", total: 128, chatgpt: 16, perplexity: 56, gemini: 56 },
                  { name: "Glint", total: 75, chatgpt: 18, perplexity: 15, gemini: 42 },
                  { name: "Simpplr", total: 70, chatgpt: 0, perplexity: 70, gemini: 0 },
                  { name: "Lattice", total: 58, chatgpt: 16, perplexity: 30, gemini: 12 },
                ].map((competitor, index) => (
                  <div key={competitor.name} className="flex items-center gap-4">
                    <span className="text-sm font-bold text-[#6b6b6b] w-4">{index + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-[#1a1a1a]">{competitor.name}</span>
                        <span className="font-bold text-[#1a1a1a]">{competitor.total}</span>
                      </div>
                      <div className="flex gap-2 text-xs text-[#6b6b6b]">
                        <span>ChatGPT: {competitor.chatgpt}</span>
                        <span>|</span>
                        <span>Perplexity: {competitor.perplexity}</span>
                        <span>|</span>
                        <span>Gemini: {competitor.gemini}</span>
                      </div>
                      <div className="mt-2 h-2 bg-[#e5e5e5] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#10B981] rounded-full"
                          style={{ width: `${(competitor.total / 183) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-4 pt-3 border-t-2 border-[#1a1a1a]">
                  <span className="text-sm font-bold text-[#EF4444] w-4">-</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#EF4444]">Unily</span>
                      <span className="font-bold text-[#EF4444]">0</span>
                    </div>
                    <div className="mt-2 h-2 bg-[#e5e5e5] rounded-full overflow-hidden">
                      <div className="h-full bg-[#EF4444] rounded-full" style={{ width: "0%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Query 2: Enterprise Intranet Software */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-xl font-bold text-[#1a1a1a]">&quot;Best Enterprise Intranet Software&quot;</h3>
              <span className="px-3 py-1 bg-[#10B981]/10 border-2 border-[#10B981] rounded-full text-xs font-bold text-[#10B981]">
                116 Mentions
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                { engine: "ChatGPT", mentions: 10 },
                { engine: "Perplexity", mentions: 60 },
                { engine: "Gemini", mentions: 46 },
              ].map((item) => (
                <div key={item.engine} className="bg-white border-2 border-[#1a1a1a] rounded-xl p-6 shadow-[4px_4px_0px_0px_#10B981]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-[#1a1a1a]">{item.engine}</span>
                    <span className="px-2 py-1 bg-[#10B981] text-white text-xs font-bold rounded">PASS</span>
                  </div>
                  <div className="text-3xl font-extrabold text-[#10B981]">{item.mentions}</div>
                  <p className="text-sm text-[#6b6b6b]">mentions</p>
                </div>
              ))}
            </div>

            {/* Competitor Comparison */}
            <div className="bg-[#f5f5f5] border-2 border-[#1a1a1a] rounded-xl p-6">
              <h4 className="font-bold text-[#1a1a1a] mb-4">Intranet Competitor Landscape</h4>
              <div className="space-y-3">
                {[
                  { name: "Simpplr", total: 231, chatgpt: 14, perplexity: 148, gemini: 69 },
                  { name: "Staffbase", total: 172, chatgpt: 44, perplexity: 0, gemini: 128 },
                  { name: "SharePoint", total: 145, chatgpt: 25, perplexity: 0, gemini: 120 },
                  { name: "Unily", total: 116, chatgpt: 10, perplexity: 60, gemini: 46, highlight: true },
                  { name: "LumApps", total: 72, chatgpt: 24, perplexity: 0, gemini: 48 },
                  { name: "Workvivo", total: 56, chatgpt: 12, perplexity: 0, gemini: 44 },
                ].map((competitor, index) => (
                  <div key={competitor.name} className={`flex items-center gap-4 ${competitor.highlight ? 'bg-[#DFFE68]/30 -mx-2 px-2 py-2 rounded-lg border-2 border-[#1a1a1a]' : ''}`}>
                    <span className={`text-sm font-bold w-4 ${competitor.highlight ? 'text-[#1a1a1a]' : 'text-[#6b6b6b]'}`}>{index + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-medium ${competitor.highlight ? 'font-bold text-[#1a1a1a]' : 'text-[#1a1a1a]'}`}>
                          {competitor.name}
                          {competitor.highlight && <span className="ml-2 text-xs text-[#6b6b6b]">(You)</span>}
                        </span>
                        <span className={`font-bold ${competitor.highlight ? 'text-[#10B981]' : 'text-[#1a1a1a]'}`}>{competitor.total}</span>
                      </div>
                      <div className="flex gap-2 text-xs text-[#6b6b6b]">
                        <span>ChatGPT: {competitor.chatgpt}</span>
                        <span>|</span>
                        <span>Perplexity: {competitor.perplexity}</span>
                        <span>|</span>
                        <span>Gemini: {competitor.gemini}</span>
                      </div>
                      <div className="mt-2 h-2 bg-[#e5e5e5] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${competitor.highlight ? 'bg-[#10B981]' : 'bg-[#3B82F6]'}`}
                          style={{ width: `${(competitor.total / 231) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google SERP Rankings */}
      <section className="py-16 px-6 bg-[#f5f5f5] border-b-2 border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#1a1a1a] mb-8">Google SERP Rankings</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { query: "best employee experience platforms", position: 9, status: "Page 1" },
              { query: "best enterprise intranet software", position: "2 & 6", status: "Top 10" },
              { query: "digital workplace platform", position: 2, status: "Top 3" },
            ].map((item) => (
              <div key={item.query} className="bg-white border-2 border-[#1a1a1a] rounded-xl p-6 shadow-[4px_4px_0px_0px_#1a1a1a]">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2 py-1 bg-[#10B981]/10 border border-[#10B981] rounded text-xs font-bold text-[#10B981]">
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-[#6b6b6b] mb-2">Position</p>
                <div className="text-3xl font-extrabold text-[#1a1a1a] mb-3">{item.position}</div>
                <p className="text-sm text-[#4a4a4a]">&quot;{item.query}&quot;</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white border-2 border-[#1a1a1a] rounded-xl p-6 shadow-[4px_4px_0px_0px_#1a1a1a]">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#3B82F6]/10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a1a] mb-1">Insight</h4>
                <p className="text-[#4a4a4a]">
                  Strong organic Google rankings do not translate to AI engine visibility. While Unily ranks on page 1 for key searches, AI engines are sourcing recommendations from different signals - primarily structured comparison content and third-party reviews.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Threat Analysis */}
      <section className="py-16 px-6 border-b-2 border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#1a1a1a] mb-8">Competitive Threat Analysis</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                competitor: "Simpplr",
                threat: "HIGH",
                action: "Direct 'Unily alternative' landing page",
                color: "#EF4444"
              },
              {
                competitor: "Staffbase",
                threat: "MEDIUM",
                action: "'Unily Alternatives' blog post",
                color: "#F59E0B"
              },
              {
                competitor: "Workvivo",
                threat: "MEDIUM",
                action: "'10 Best Unily Alternatives' article",
                color: "#F59E0B"
              },
              {
                competitor: "Blink",
                threat: "LOW",
                action: "'Top 10 Unily Alternatives' content",
                color: "#10B981"
              },
            ].map((item) => (
              <div
                key={item.competitor}
                className="bg-white border-2 border-[#1a1a1a] rounded-xl p-6"
                style={{ boxShadow: `4px 4px 0px 0px ${item.color}` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-[#1a1a1a]">{item.competitor}</span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.threat} THREAT
                  </span>
                </div>
                <p className="text-[#4a4a4a]">{item.action}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-[#F59E0B]/10 border-2 border-[#F59E0B] rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#F59E0B] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a1a] mb-1">Warning: Brand Capture in Progress</h4>
                <p className="text-[#4a4a4a]">
                  Competitors are actively creating &quot;Unily alternatives&quot; content to intercept buyers who are already aware of Unily. This content is being indexed by AI engines and influencing recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="py-16 px-6 bg-[#f5f5f5] border-b-2 border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#1a1a1a] mb-8">Recommendations</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                priority: 1,
                title: "Create EX-Focused Content",
                description: "Develop content specifically optimized for AI training data with 'employee experience platform' terminology prominently featured.",
                impact: "HIGH"
              },
              {
                priority: 2,
                title: "Update Website Messaging",
                description: "Emphasize 'employee experience platform' language across the website, not just 'intranet' - AI engines weight homepage and main navigation heavily.",
                impact: "HIGH"
              },
              {
                priority: 3,
                title: "Get Featured in Comparisons",
                description: "Target EX platform comparison articles that AI engines frequently cite (G2, Gartner, TrustRadius reviews).",
                impact: "MEDIUM"
              },
              {
                priority: 4,
                title: "Build Comparison Pages",
                description: "Create 'Unily vs Culture Amp', 'Unily vs Qualtrics' comparison pages to capture competitive search intent and feed AI engines.",
                impact: "MEDIUM"
              },
            ].map((rec) => (
              <div
                key={rec.priority}
                className="bg-white border-2 border-[#1a1a1a] rounded-xl p-6 shadow-[4px_4px_0px_0px_#1a1a1a] hover:shadow-[6px_6px_0px_0px_#1a1a1a] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#DFFE68] border-2 border-[#1a1a1a] rounded-full flex items-center justify-center font-bold text-[#1a1a1a]">
                    {rec.priority}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-[#1a1a1a]">{rec.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        rec.impact === 'HIGH' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#3B82F6]/10 text-[#3B82F6]'
                      }`}>
                        {rec.impact} IMPACT
                      </span>
                    </div>
                    <p className="text-[#4a4a4a] text-sm">{rec.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 border-b-2 border-[#1a1a1a]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#DFFE68] border-2 border-[#1a1a1a] rounded-2xl p-8 md:p-12 shadow-[6px_6px_0px_0px_#1a1a1a] text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1a1a1a] mb-4">
              Ready to Improve Your AI Visibility?
            </h2>
            <p className="text-[#4a4a4a] mb-8 max-w-2xl mx-auto">
              42 Agency specializes in AEO (AI Engine Optimization) strategies for B2B companies. Let us help you get discovered by AI-powered search engines.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://www.42agency.com/contact-us"
                target="_blank"
                className="px-8 py-4 bg-[#1a1a1a] text-white font-bold rounded-lg hover:bg-[#333] transition-colors"
              >
                Get an AEO Strategy
              </a>
              <a
                href="https://intel.42agency.com/aeo/"
                className="px-8 py-4 bg-white text-[#1a1a1a] font-bold rounded-lg border-2 border-[#1a1a1a] shadow-[4px_4px_0px_0px_#1a1a1a] hover:shadow-[6px_6px_0px_0px_#1a1a1a] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                Learn About AEO
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Stats */}
      <section className="py-12 px-6 bg-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-extrabold text-[#EF4444] mb-1">0</div>
              <p className="text-sm text-gray-400">EX Platform AI Mentions</p>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#10B981] mb-1">116</div>
              <p className="text-sm text-gray-400">Intranet AI Mentions</p>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#3B82F6] mb-1">Page 1</div>
              <p className="text-sm text-gray-400">Google SERP Position</p>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#F59E0B] mb-1">4</div>
              <p className="text-sm text-gray-400">Active Competitor Threats</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-[#1a1a1a] py-12 px-6 bg-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-gray-700">
            <div>
              <Image src="/42-logo.png" alt="42 Agency" width={100} height={24} className="h-6 w-auto brightness-0 invert mb-4" />
              <p className="text-sm text-gray-400">
                B2B performance marketing for companies that sell to enterprises.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-[#DFFE68] mb-4">Assess</h4>
              <div className="space-y-2">
                <a href="https://intel.42agency.com/assessments/hubspot-health/" className="block text-sm text-gray-400 hover:text-white">HubSpot Health Check</a>
                <a href="https://intel.42agency.com/assess/calculator/" className="block text-sm text-gray-400 hover:text-white">Benchmark Calculator</a>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-[#DFFE68] mb-4">Benchmarks</h4>
              <div className="space-y-2">
                <a href="https://intel.42agency.com/b2b-benchmarks/" className="block text-sm text-gray-400 hover:text-white">All Benchmarks</a>
                <a href="https://intel.42agency.com/b2b-benchmarks/linkedin-ads-benchmarks/" className="block text-sm text-gray-400 hover:text-white">LinkedIn Ads</a>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-[#DFFE68] mb-4">42 Agency</h4>
              <div className="space-y-2">
                <a href="https://42agency.com" target="_blank" className="block text-sm text-gray-400 hover:text-white">Website</a>
                <a href="https://www.42agency.com/contact-us" target="_blank" className="block text-sm text-gray-400 hover:text-white">Contact Us</a>
              </div>
            </div>
          </div>
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">© 2026 42 Agency. All rights reserved.</p>
            <p className="text-sm text-gray-500">Report generated February 27, 2024</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
