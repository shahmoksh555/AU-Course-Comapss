import React from 'react';
import { Bookmark, Compass, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'survey' | 'explore' | 'shortlist';
  setActiveTab: (tab: 'survey' | 'explore' | 'shortlist') => void;
  shortlistCount: number;
  hasCompletedSurvey: boolean;
  onRetakeSurvey?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  shortlistCount,
  hasCompletedSurvey,
  onRetakeSurvey,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('survey')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="text-base font-semibold tracking-tight text-stone-900 group-hover:text-[#b83e26] transition-colors">
            Course Compass <span className="font-normal text-stone-500">· Ahmedabad University</span>
          </span>
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('survey')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'survey'
                ? 'text-[#8f2817] bg-[#f6d9d2] shadow-sm ring-1 ring-[#b83e26]/25'
                : 'text-stone-700 hover:text-[#8f2817] hover:bg-[#fff0eb]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#b83e26]" />
            <span>{hasCompletedSurvey ? 'Recommendations' : 'Course Matcher'}</span>
          </button>

          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'explore'
                ? 'text-[#8f2817] bg-[#f6d9d2] shadow-sm ring-1 ring-[#b83e26]/25'
                : 'text-stone-700 hover:text-[#8f2817] hover:bg-[#fff0eb]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore</span>
          </button>

          <button
            onClick={() => setActiveTab('shortlist')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'shortlist'
                ? 'text-[#8f2817] bg-[#f6d9d2] shadow-sm ring-1 ring-[#b83e26]/25'
                : 'text-stone-700 hover:text-[#8f2817] hover:bg-[#fff0eb]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Shortlist</span>
            {shortlistCount > 0 && (
              <span className="text-xs font-semibold px-1.5 py-0.2 bg-[#b83e26] text-white rounded-full leading-none">
                {shortlistCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary action */}
        <div className="flex items-center gap-2">
          {hasCompletedSurvey && onRetakeSurvey ? (
            <button
              onClick={onRetakeSurvey}
              className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 border border-stone-200 hover:border-stone-300 rounded-md transition-colors whitespace-nowrap cursor-pointer"
            >
              Retake Matcher
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('explore')}
              className="hidden sm:inline-flex px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors whitespace-nowrap cursor-pointer"
            >
              Curated Shelves
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
