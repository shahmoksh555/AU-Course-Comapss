import React, { useState } from 'react';
import {
  RotateCcw,
  Compass,
  Bookmark,
  Sparkles,
  ArrowUpRight,
  BookmarkCheck,
  Info,
  Sliders,
  CheckCircle2,
  X,
} from 'lucide-react';
import {
  CourseCategoryType,
  CourseMasterItem,
  PrimaryObjective,
  Recommendation,
  StudentContext,
} from '../types';

interface RecommendationsViewProps {
  recommendations: Recommendation[];
  objective: PrimaryObjective;
  studentContext: StudentContext;
  category: CourseCategoryType;
  shortlistedCodes: string[];
  onToggleShortlist: (courseCode: string) => void;
  onOpenDetails: (course: CourseMasterItem) => void;
  onRetake: () => void;
  onGoToExplore: () => void;
  onGoToShortlist: () => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  recommendations,
  objective,
  studentContext,
  category,
  shortlistedCodes,
  onToggleShortlist,
  onOpenDetails,
  onRetake,
  onGoToExplore,
  onGoToShortlist,
}) => {
  const [showPersonalisationModal, setShowPersonalisationModal] = useState(false);

  const topPicks = recommendations.filter((r) => r.isTopPick);
  const secondaryPicks = recommendations.filter((r) => !r.isTopPick);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header section */}
      <div className="mb-8 pb-6 border-b border-stone-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#b83e26] uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Recommendations · Winter 2027</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight mb-2">
              Recommended Courses for Next Semester
            </h1>
            {/* Student Context Metadata (unboxed, separated by ·) */}
            <div className="text-xs sm:text-sm text-stone-600 flex items-center gap-2 flex-wrap mb-2">
              <span className="font-medium text-stone-800">{objective}</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>Cohort {studentContext.year}</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>{studentContext.programmeName}</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>{studentContext.majorName}</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="font-medium text-[#b83e26]">{category}</span>
            </div>
            <p className="text-xs text-stone-500 max-w-2xl leading-relaxed">
              Filtered exclusively from official Winter 2027 semester offerings. All compulsory core courses and your major&apos;s specific electives are excluded; electives from other majors are eligible as Free Electives.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onRetake}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 border border-stone-200 hover:border-stone-300 rounded-md transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Matcher</span>
            </button>

            <button
              onClick={onGoToExplore}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#b83e26] hover:bg-[#9e321e] rounded-md transition-colors cursor-pointer shadow-xs"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore All Courses</span>
            </button>
          </div>
        </div>
      </div>

      {/* Heuristic Fit Disclosure Banner */}
      <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-600 mb-8 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-stone-800">Heuristic Match Notice: </span>
          Fit percentages are heuristic match scores calculated from available structured course metadata, curriculum rules, and your survey answers, not official university ratings or success guarantees. Limited course outline data is acknowledged transparently.
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-stone-200 rounded-lg p-8">
          <h3 className="text-base font-semibold text-stone-800 mb-2">
            No eligible courses found for this category in Winter 2027
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto mb-5 leading-relaxed">
            There are currently no offered courses in Winter 2027 that match this specific combination without conflicting with your core requirements.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onRetake}
              className="px-4 py-2 text-xs font-medium text-white bg-[#b83e26] hover:bg-[#9e321e] rounded-md transition-colors cursor-pointer"
            >
              Adjust Category or Objective
            </button>
            <button
              onClick={onGoToExplore}
              className="px-4 py-2 text-xs font-medium text-stone-700 border border-stone-200 rounded-md hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Browse Open Catalog
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Section 1: Top 3-5 Featured Recommendations */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-stone-900 tracking-tight">
                Top Highlighted Matches ({topPicks.length})
              </h2>
              <span className="text-xs text-stone-500">
                Highest affinity to your {objective} profile
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {topPicks.map((item) => {
                const isShortlisted = shortlistedCodes.includes(item.course.code);
                return (
                  <div
                    key={item.course.code}
                    className="bg-white border border-stone-200 rounded-lg p-5 sm:p-6 transition-all duration-200 hover:border-stone-300 hover:shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      {/* Top metadata */}
                      <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-900">{item.course.code}</span>
                          <span aria-hidden="true" className="text-stone-300">·</span>
                          <span>{item.course.school}</span>
                          <span aria-hidden="true" className="text-stone-300">·</span>
                          <span>{item.course.credits} Credits</span>
                        </div>
                        <span className="font-semibold text-[#b83e26]">
                          {item.fitPercentage}% Fit
                        </span>
                      </div>

                      {/* Course Name */}
                      <h3
                        onClick={() => onOpenDetails(item.course)}
                        className="text-base sm:text-lg font-semibold text-stone-900 hover:text-[#b83e26] transition-colors cursor-pointer mb-2.5 leading-snug"
                      >
                        {item.course.name}
                      </h3>

                      {/* Specific match rationale */}
                      <div className="p-3 bg-[#faf2f0]/50 rounded-md border border-[#b83e26]/15 mb-4">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#b83e26] mb-1">
                          Why this matches you
                        </div>
                        <p className="text-xs text-stone-700 leading-relaxed">
                          {item.explanation}
                        </p>
                      </div>

                      <div className="text-xs text-stone-500 flex items-center gap-2 flex-wrap">
                        <span>Level: {item.course.level}</span>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <span>Offered in Winter 2027</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between mt-4">
                      <button
                        onClick={() => onOpenDetails(item.course)}
                        className="text-xs font-medium text-stone-700 hover:text-[#b83e26] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>Course Information</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onToggleShortlist(item.course.code)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                          isShortlisted
                            ? 'bg-[#faf2f0] text-[#b83e26] border border-[#b83e26]/30'
                            : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200'
                        }`}
                      >
                        {isShortlisted ? (
                          <>
                            <BookmarkCheck className="w-3.5 h-3.5 text-[#b83e26]" />
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-3.5 h-3.5" />
                            <span>Save Course</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Remaining Recommendations (Secondary List) */}
          {secondaryPicks.length > 0 && (
            <div className="mb-10">
              <div className="mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-stone-900 tracking-tight">
                  Additional Eligible Recommendations ({secondaryPicks.length})
                </h2>
                <p className="text-xs text-stone-500">
                  Alternative Winter 2027 electives compatible with your curriculum rules
                </p>
              </div>

              <div className="border border-stone-200 rounded-lg divide-y divide-stone-100 bg-white">
                {secondaryPicks.map((item) => {
                  const isShortlisted = shortlistedCodes.includes(item.course.code);
                  return (
                    <div
                      key={item.course.code}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/60 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-stone-500 flex-wrap">
                          <span className="font-semibold text-stone-900">{item.course.code}</span>
                          <span aria-hidden="true" className="text-stone-300">·</span>
                          <span>{item.course.school}</span>
                          <span aria-hidden="true" className="text-stone-300">·</span>
                          <span>{item.course.credits} Credits</span>
                          <span aria-hidden="true" className="text-stone-300">·</span>
                          <span className="text-[#b83e26] font-medium">{item.fitPercentage}% Fit</span>
                        </div>

                        <h4
                          onClick={() => onOpenDetails(item.course)}
                          className="text-sm sm:text-base font-semibold text-stone-900 hover:text-[#b83e26] transition-colors cursor-pointer"
                        >
                          {item.course.name}
                        </h4>

                        <p className="text-xs text-stone-600 line-clamp-1">
                          {item.explanation}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => onOpenDetails(item.course)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 border border-stone-200 rounded-md hover:bg-stone-50 transition-colors cursor-pointer"
                        >
                          <span>Details</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onToggleShortlist(item.course.code)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                            isShortlisted
                              ? 'bg-[#faf2f0] text-[#b83e26] border border-[#b83e26]/30'
                              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200'
                          }`}
                        >
                          {isShortlisted ? (
                            <>
                              <BookmarkCheck className="w-3.5 h-3.5 text-[#b83e26]" />
                              <span>Saved</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Deep Personalisation CTA */}
          <div className="p-6 bg-stone-50 border border-stone-200 rounded-lg text-center mb-8">
            <h3 className="text-base font-semibold text-stone-900 mb-1.5">
              Want finer timetable and prerequisite tuning?
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto mb-4 leading-relaxed">
              Unlock schedule clash prevention, professor insights, and multi-semester roadmap simulations.
            </p>
            <button
              onClick={() => setShowPersonalisationModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-medium text-white bg-[#b83e26] hover:bg-[#9e321e] transition-colors cursor-pointer shadow-xs"
            >
              <Sliders className="w-4 h-4" />
              <span>Get More Personalised Recommendations</span>
            </button>
          </div>
        </>
      )}

      {/* Deeper Personalisation Notification Modal */}
      {showPersonalisationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowPersonalisationModal(false)}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
          />
          <div className="relative bg-white border border-stone-200 rounded-xl shadow-xl w-full max-w-md p-6 z-10 text-center">
            <div className="w-10 h-10 rounded-full bg-[#faf2f0] text-[#b83e26] flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-stone-900 mb-2">
              Advanced Personalisation
            </h3>
            <p className="text-sm text-stone-600 mb-6 leading-relaxed">
              Deeper personalisation is currently under development. Stay tuned!
            </p>
            <button
              onClick={() => setShowPersonalisationModal(false)}
              className="px-5 py-2 text-xs font-medium text-white bg-[#b83e26] hover:bg-[#9e321e] rounded-md transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
