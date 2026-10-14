import React, { useState } from 'react';
import { Bookmark, Trash2, ArrowUpRight, Copy, Check, Compass, Sparkles } from 'lucide-react';
import { CourseMasterItem } from '../types';

interface ShortlistViewProps {
  courses: CourseMasterItem[];
  onRemoveCourse: (courseCode: string) => void;
  onClearAll: () => void;
  onOpenDetails: (course: CourseMasterItem) => void;
  onGoToExplore: () => void;
  onGoToSurvey: () => void;
}

export const ShortlistView: React.FC<ShortlistViewProps> = ({
  courses,
  onRemoveCourse,
  onClearAll,
  onOpenDetails,
  onGoToExplore,
  onGoToSurvey,
}) => {
  const [copied, setCopied] = useState(false);

  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);

  const handleCopySummary = () => {
    if (courses.length === 0) return;
    const summaryText = [
      `Ahmedabad University · Winter 2027 Course Shortlist`,
      `Total Planned Credits: ${totalCredits.toFixed(1)} Cr`,
      `-----------------------------------------`,
      ...courses.map(
        (c, idx) =>
          `${idx + 1}. [${c.code}] ${c.name} (${c.credits} Cr) · ${c.school} (${c.level})`
      ),
    ].join('\n\n');

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#b83e26] uppercase tracking-wider mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            <span>My Semester Shortlist</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
            Selected Courses & Credit Planning
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Review your shortlisted Winter 2027 courses, track your credit load, and prepare for course registration.
          </p>
        </div>

        {courses.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 hover:border-stone-300 rounded-md transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Plan</span>
                </>
              )}
            </button>

            <button
              onClick={onClearAll}
              className="text-xs text-stone-400 hover:text-rose-600 px-2 py-1.5 transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {courses.length > 0 ? (
        <div className="space-y-6">
          {/* Credit Overview Banner */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-xs text-stone-500 block mb-0.5">Shortlisted Courses</span>
                <span className="text-xl font-semibold text-stone-900">{courses.length}</span>
              </div>
              <div className="h-8 w-px bg-stone-200" />
              <div>
                <span className="text-xs text-stone-500 block mb-0.5">Total Shortlisted Credits</span>
                <span className="text-xl font-semibold text-[#b83e26]">{totalCredits.toFixed(1)} Credits</span>
              </div>
            </div>

            <div className="text-xs text-stone-500 max-w-xs">
              Typical AU full-time semester load is 15.0–18.0 credits (including core major requirements).
            </div>
          </div>

          {/* Course List */}
          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.code}
                className="bg-white border border-stone-200 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-stone-300 transition-colors"
              >
                <div className="space-y-1 pr-2">
                  <div className="flex items-center gap-2 text-xs text-stone-500 flex-wrap">
                    <span className="font-semibold text-stone-900">{course.code}</span>
                    <span aria-hidden="true">·</span>
                    <span>{course.school}</span>
                    <span aria-hidden="true">·</span>
                    <span>{course.credits} Credits</span>
                    <span aria-hidden="true">·</span>
                    <span>{course.level}</span>
                  </div>

                  <h3
                    onClick={() => onOpenDetails(course)}
                    className="text-base font-semibold text-stone-900 hover:text-[#b83e26] transition-colors cursor-pointer"
                  >
                    {course.name}
                  </h3>

                  <p className="text-xs text-stone-500">
                    Verified Winter 2027 Course Offering
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onOpenDetails(course)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 border border-stone-200 rounded-md hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onRemoveCourse(course.code)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors rounded hover:bg-rose-50 cursor-pointer"
                    title="Remove from shortlist"
                    aria-label="Remove course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick link to explore or retake */}
          <div className="pt-6 flex items-center justify-between text-xs text-stone-500">
            <button
              onClick={onGoToSurvey}
              className="inline-flex items-center gap-1.5 text-[#b83e26] hover:underline cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Retake Course Compass Matcher</span>
            </button>

            <button
              onClick={onGoToExplore}
              className="inline-flex items-center gap-1.5 text-stone-700 hover:text-stone-950 font-medium cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Browse Curated Shelves</span>
            </button>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 border border-dashed border-stone-200 rounded-xl p-8">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-400">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-stone-900 mb-1.5">
            Your Shortlist is Empty
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6 leading-relaxed">
            You haven't saved any courses yet. Take the adaptive Course Compass journey for recommendations or browse the curated shelves.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onGoToSurvey}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-white bg-[#b83e26] hover:bg-[#9e321e] rounded-md transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Course Matcher</span>
            </button>

            <button
              onClick={onGoToExplore}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-200 hover:border-stone-300 rounded-md transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Browse Curated Shelves</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
