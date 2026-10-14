import React, { useEffect } from 'react';
import { X, Bookmark, BookmarkCheck, Calendar, BookOpen, GraduationCap, CheckCircle } from 'lucide-react';
import { CourseMasterItem } from '../types';
import { getGERSubCategory, WINTER_2027_OFFERINGS } from '../data/rawDatasets';

interface CourseModalProps {
  course: CourseMasterItem | null;
  onClose: () => void;
  isShortlisted: boolean;
  onToggleShortlist: (courseCode: string) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  onClose,
  isShortlisted,
  onToggleShortlist,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (course) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [course, onClose]);

  if (!course) return null;

  const isWinter2027 = WINTER_2027_OFFERINGS.includes(course.code);
  const gerSub = getGERSubCategory(course.code);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white border border-stone-200 rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto z-10 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5 flex-wrap">
              <span className="font-semibold text-stone-900">{course.code}</span>
              <span aria-hidden="true">·</span>
              <span>{course.school}</span>
              <span aria-hidden="true">·</span>
              <span>{course.credits} Credits</span>
              <span aria-hidden="true">·</span>
              <span>{course.level}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-stone-900 leading-snug">
              {course.name}
            </h2>
            <div className="text-xs text-stone-500 mt-1">
              Official Ahmedabad University Course Master record
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 text-sm text-stone-700">
          {/* Quick parameter grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-stone-50 border border-stone-200/70 rounded-lg text-xs">
            <div>
              <span className="text-stone-400 block mb-0.5">School Offering</span>
              <span className="font-medium text-stone-800">{course.school}</span>
            </div>
            <div>
              <span className="text-stone-400 block mb-0.5">Academic Credits</span>
              <span className="font-medium text-stone-800">{course.credits} Credits</span>
            </div>
            <div>
              <span className="text-stone-400 block mb-0.5">Degree Level</span>
              <span className="font-medium text-stone-800">{course.level}</span>
            </div>
          </div>

          {/* Availability Status */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
              Semester Offering Status
            </h4>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-md text-xs space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-4 h-4 ${isWinter2027 ? 'text-emerald-600' : 'text-stone-400'}`} />
                <span className="font-medium text-stone-800">
                  {isWinter2027
                    ? 'Confirmed active offering in Winter 2027 Semester'
                    : 'Not currently listed in Winter 2027 offerings'}
                </span>
              </div>
              {course.courseId && (
                <div className="text-stone-500 pl-6">
                  Course Master ID: {course.courseId}
                </div>
              )}
            </div>
          </div>

          {/* Curricular Classification */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
              Curricular Alignment
            </h4>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-600 space-y-1">
              <div>
                <strong className="text-stone-800">Department / Prefix: </strong>
                {course.code.replace(/[0-9].*$/, '')}
              </div>
              {gerSub && (
                <div>
                  <strong className="text-stone-800">General Education Area: </strong>
                  {gerSub}
                </div>
              )}
              <div className="text-stone-400 text-[11px] pt-1">
                Note: In accordance with university curriculum data standards, syllabus outlines and section timing are issued during registration.
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-6 border-t border-stone-100 flex items-center justify-between bg-stone-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={() => onToggleShortlist(course.code)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isShortlisted
                ? 'bg-[#faf2f0] text-[#b83e26] border border-[#b83e26]/30'
                : 'bg-[#b83e26] hover:bg-[#9e321e] text-white shadow-xs'
            }`}
          >
            {isShortlisted ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-[#b83e26]" />
                <span>In Your Shortlist</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Add to My Shortlist</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
