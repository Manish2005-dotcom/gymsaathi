import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Clock,
  ChevronDown,
  Sparkles,
  Info,
} from 'lucide-react';
import { EDUCATION_ARTICLES, EducationArticle } from '../data/educationArticles';

export const EducationPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(EDUCATION_ARTICLES[0].id);

  const filteredArticles = EDUCATION_ARTICLES.filter(
    (a) => selectedCategory === 'all' || a.category === selectedCategory
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lime-400">
          <GraduationCap className="w-4 h-4" />
          <span>Science-Informed Lifting & Nutrition</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Fitness Education & Injury Prevention
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
          Cut through bro-science, dangerous gym myths, and fake supplement claims. Grounded in peer-reviewed exercise physiology and practical Indian dietary realities.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'all', label: 'All Guides' },
          { id: 'training', label: 'Training & Overload' },
          { id: 'nutrition', label: 'Indian Diet Science' },
          { id: 'recovery', label: 'Sleep & Hydration' },
          { id: 'safety', label: 'Safety & Red Flags' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat.id
                ? 'bg-lime-500 text-zinc-950 shadow-md font-black'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Articles Accordion / Cards */}
      <div className="space-y-4">
        {filteredArticles.map((article) => {
          const isExpanded = expandedArticleId === article.id;

          return (
            <div
              key={article.id}
              className={`rounded-3xl border transition-all ${
                isExpanded
                  ? 'bg-zinc-950 border-lime-500/40 shadow-lg shadow-lime-950/20'
                  : 'bg-zinc-950/70 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {/* Card Header button */}
              <button
                onClick={() => setExpandedArticleId(isExpanded ? null : article.id)}
                className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-900 text-zinc-300 border border-zinc-800 capitalize">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-xl font-bold text-white hover:text-lime-400 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
                    {article.summary}
                  </p>
                </div>

                <div
                  className={`p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 flex-shrink-0 transition-transform ${
                    isExpanded ? 'rotate-180 text-lime-400 border-lime-500/30' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-zinc-800/80 space-y-5 animate-fade-in text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {/* Key Takeaways Box */}
                  <div className="p-4 rounded-2xl bg-lime-950/20 border border-lime-900/40 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-lime-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Key Takeaways</span>
                    </span>
                    <ul className="space-y-1.5 text-xs text-lime-100/90 list-disc list-inside">
                      {article.keyTakeaways.map((takeaway, idx) => (
                        <li key={idx}>{takeaway}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Body Paragraphs */}
                  <div className="space-y-3 text-zinc-300 text-xs sm:text-sm">
                    {article.content.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Safety Notice Banner */}
      <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 flex items-start gap-4">
        <ShieldAlert className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-zinc-400 leading-relaxed">
          <strong className="text-white block text-sm">Medical Guidance & Responsibility</strong>
          <p>
            GymSaathi promotes safe, evidence-based fitness education for general athletic conditioning. None of our guidelines guarantee injury immunity or medical treatment. Never attempt to lift through sharp joint pain or spinal pinching. Seek qualified medical evaluation if pain persists.
          </p>
        </div>
      </div>
    </div>
  );
};
