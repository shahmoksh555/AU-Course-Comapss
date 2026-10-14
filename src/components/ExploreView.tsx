import React, { useState, useMemo } from 'react';
import { Search, X, Sparkles, BookOpen, Layers, ArrowUpRight, Bookmark, BookmarkCheck } from 'lucide-react';
import { CourseMasterItem } from '../types';
import { CURATED_SHELVES } from '../data/curatedCollections';
import { COURSE_BY_CODE, WINTER_2027_OFFERINGS } from '../data/rawDatasets';

interface ExploreViewProps {
  shortlistedCodes: string[];
  onToggleShortlist: (courseCode: string) => void;
  onOpenDetails: (course: CourseMasterItem) => void;
  onStartSurvey: () => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  shortlistedCodes,
  onToggleShortlist,
  onOpenDetails,
  onStartSurvey,
}) => {
  // Active shelf view: 'all' or specific shelf id
  const [selectedShelfId, setSelectedShelfId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<'All' | 'AMSOM' | 'SAS' | 'SEAS'>('All');
  const [selectedCreditFilter, setSelectedCreditFilter] = useState<'All' | 'Compact' | 'Standard' | 'Heavy'>('All');

  // Build the list of all Winter 2027 courses
  const allWinterCourses = useMemo(() => {
    return WINTER_2027_OFFERINGS.map((code) => {
      const course = COURSE_BY_CODE.get(code);
      return (
        course || {
          code,
          name: code,
          level: 'Undergraduate',
          credits: 3.0,
          school: code.startsWith('E') || code.startsWith('C') ? 'SEAS' : 'AMSOM',
        }
      );
    });
  }, []);

  // Filter based on active shelf, search, school, and credits
  const displayedCourses = useMemo(() => {
    let list: CourseMasterItem[];

    if (selectedShelfId === 'all') {
      list = allWinterCourses;
    } else {
      const shelf = CURATED_SHELVES.find((s) => s.id === selectedShelfId);
      list = shelf ? shelf.courses : allWinterCourses;
    }

    return list.filter((course) => {
      // School filter
      if (selectedSchool !== 'All' && course.school !== selectedSchool) {
        return false;
      }

      // Credit filter
      if (selectedCreditFilter === 'Compact' && course.credits > 2.0) return false;
      if (selectedCreditFilter === 'Standard' && (course.credits <= 2.0 || course.credits > 3.5)) return false;
      if (selectedCreditFilter === 'Heavy' && course.credits < 4.0) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = course.code.toLowerCase().includes(q);
        const matchesName = course.name.toLowerCase().includes(q);
        const matchesSchool = course.school.toLowerCase().includes(q);
        return matchesCode || matchesName || matchesSchool;
      }

      return true;
    });
  }, [selectedShelfId, allWinterCourses, selectedSchool, selectedCreditFilter, searchQuery]);

  const activeShelf = CURATED_SHELVES.find((s) => s.id === selectedShelfId);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Top Banner */}
      <div className="mb-8 pb-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#b83e26] uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curated Catalog Explorer · Winter 2027</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight mb-2">
            Browse Curated Academic Collections
          </h1>
          <p className="text-sm text-stone-500 max-w-2xl leading-relaxed">
            Explore 8 broadly curated shelves designed to benefit students across all schools, from career launchpads and tech literacy to liberal education inquiry.
          </p>
        </div>

        <button
          onClick={onStartSurvey}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#b83e26] bg-[#faf2f0] hover:bg-[#faeae6] border border-[#b83e26]/30 rounded-md transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Adaptive Matcher</span>
        </button>
      </div>

      {/* 8 Broad Universal Curated Shelves Navigation */}
      <div className="mb-8">
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2.5">
          Curated Lists
        </label>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedShelfId('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              selectedShelfId === 'all'
                ? 'bg-[#b83e26] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200'
            }`}
          >
            All Winter 2027 Offerings ({allWinterCourses.length})
          </button>

          {CURATED_SHELVES.map((shelf) => {
            const isActive = selectedShelfId === shelf.id;
            return (
              <button
                key={shelf.id}
                onClick={() => setSelectedShelfId(shelf.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#b83e26] text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200'
                }`}
              >
                {shelf.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Shelf description (if a specific shelf is chosen) */}
      {activeShelf && (
        <div className="mb-6 p-4 bg-[#faf2f0]/50 border border-[#b83e26]/20 rounded-lg">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#b83e26] uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Curated Collection</span>
          </div>
          <h2 className="text-base font-semibold text-stone-900 mb-1">
            {activeShelf.title}
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            {activeShelf.description}
          </p>
        </div>
      )}

      {/* Search and Secondary Filter Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by course code (e.g. MGT342, ECO100) or title..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-stone-200 rounded-md focus:outline-none focus:border-[#b83e26] focus:ring-1 focus:ring-[#b83e26] transition-colors placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* School selector */}
        <select
          value={selectedSchool}
          onChange={(e) => setSelectedSchool(e.target.value as any)}
          className="bg-white border border-stone-200 rounded-md px-3 py-2 text-xs text-stone-700 focus:outline-none focus:border-[#b83e26]"
        >
          <option value="All">All Schools</option>
          <option value="AMSOM">AMSOM (Management)</option>
          <option value="SAS">SAS (Arts & Sciences)</option>
          <option value="SEAS">SEAS (Engineering)</option>
        </select>

        {/* Credits selector */}
        <select
          value={selectedCreditFilter}
          onChange={(e) => setSelectedCreditFilter(e.target.value as any)}
          className="bg-white border border-stone-200 rounded-md px-3 py-2 text-xs text-stone-700 focus:outline-none focus:border-[#b83e26]"
        >
          <option value="All">All Credits</option>
          <option value="Compact">Compact (1.0–2.0 Cr)</option>
          <option value="Standard">Standard (3.0 Cr)</option>
          <option value="Heavy">Intensive (4.0+ Cr)</option>
        </select>
      </div>

      {/* Results Count & Reset */}
      <div className="flex items-center justify-between text-xs text-stone-500 mb-6">
        <span>
          Showing <strong className="font-semibold text-stone-800">{displayedCourses.length}</strong> courses
          {selectedShelfId !== 'all' && <span> in "{activeShelf?.title}"</span>}
        </span>

        {(selectedShelfId !== 'all' || selectedSchool !== 'All' || selectedCreditFilter !== 'All' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedShelfId('all');
              setSelectedSchool('All');
              setSelectedCreditFilter('All');
              setSearchQuery('');
            }}
            className="text-stone-500 hover:text-[#b83e26] transition-colors cursor-pointer"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Course Cards Grid */}
      {displayedCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedCourses.map((course) => {
            const isShortlisted = shortlistedCodes.includes(course.code);
            return (
              <div
                key={course.code}
                className="bg-white border border-stone-200 rounded-lg p-5 flex flex-col justify-between hover:border-stone-300 hover:shadow-xs transition-all"
              >
                <div>
                  {/* Top unboxed metadata */}
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900">{course.code}</span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span>{course.school}</span>
                    </div>
                    <span>{course.credits} Credits</span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onOpenDetails(course)}
                    className="text-base font-semibold text-stone-900 hover:text-[#b83e26] transition-colors cursor-pointer mb-2.5 leading-snug"
                  >
                    {course.name}
                  </h3>

                  <div className="text-xs text-stone-500 flex items-center gap-2 flex-wrap mb-4">
                    <span>Level: {course.level}</span>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span className="text-emerald-700 font-medium">Offered Winter 2027</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3.5 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => onOpenDetails(course)}
                    className="text-xs font-medium text-stone-700 hover:text-[#b83e26] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onToggleShortlist(course.code)}
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
      ) : (
        <div className="text-center py-16 border border-dashed border-stone-200 rounded-lg p-8">
          <h3 className="text-base font-semibold text-stone-800 mb-2">
            No courses match the active filters
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-5 leading-relaxed">
            Try choosing a different curated list, resetting search terms, or clearing school filters.
          </p>
          <button
            onClick={() => {
              setSelectedShelfId('all');
              setSelectedSchool('All');
              setSelectedCreditFilter('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs font-medium text-white bg-[#b83e26] hover:bg-[#9e321e] rounded-md transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
