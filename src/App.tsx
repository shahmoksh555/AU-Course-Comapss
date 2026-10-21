import React, { useState, useEffect } from 'react';
import {
  CourseCategoryType,
  CourseMasterItem,
  GERSubCategory,
  PrimaryObjective,
  Recommendation,
  StudentContext,
} from './types';
import { COURSE_BY_CODE } from './data/rawDatasets';
import { generateRecommendations, getEligibleCourses } from './utils/courseEngine';
import { Header } from './components/Header';
import { StudentJourney } from './components/StudentJourney';
import { RecommendationsView } from './components/RecommendationsView';
import { ExploreView } from './components/ExploreView';
import { ShortlistView } from './components/ShortlistView';
import { CourseModal } from './components/CourseModal';
import { LoginPage } from './components/LoginPage';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'survey' | 'explore' | 'shortlist'>('survey');
  const [hasCompletedSurvey, setHasCompletedSurvey] = useState(false);

  // Recommendations state
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedObjective, setSelectedObjective] = useState<PrimaryObjective | null>(null);
  const [studentContext, setStudentContext] = useState<StudentContext | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CourseCategoryType | null>(null);

  // Course modal state
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<CourseMasterItem | null>(null);

  // Shortlist state with localStorage persistence
  const [shortlistedCodes, setShortlistedCodes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('course_compass_shortlist_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('course_compass_shortlist_v2', JSON.stringify(shortlistedCodes));
    } catch {
      // ignore
    }
  }, [shortlistedCodes]);

  const handleToggleShortlist = (courseCode: string) => {
    setShortlistedCodes((prev) =>
      prev.includes(courseCode)
        ? prev.filter((code) => code !== courseCode)
        : [...prev, courseCode]
    );
  };

  const handleClearShortlist = () => {
    setShortlistedCodes([]);
  };

  // Called when student finishes the 4-step survey journey
  const handleJourneyComplete = (data: {
    objective: PrimaryObjective;
    context: StudentContext;
    category: CourseCategoryType;
    gerCategory?: GERSubCategory;
    surveyAnswers: Record<string, string>;
  }) => {
    setSelectedObjective(data.objective);
    setStudentContext(data.context);
    setSelectedCategory(data.category);

    // 1. Calculate eligible courses according to curriculum datasets & Winter 2027 offerings
    const eligible = getEligibleCourses(data.context, data.category, data.gerCategory);

    // 2. Rank and score recommendations
    const results = generateRecommendations(
      eligible,
      data.objective,
      data.surveyAnswers,
      data.context,
      data.category
    );

    setRecommendations(results);
    setHasCompletedSurvey(true);
    setActiveTab('survey');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetakeJourney = () => {
    setHasCompletedSurvey(false);
    setActiveTab('survey');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keep all existing course discovery functionality behind the entry screen.
  if (!isLoggedIn) {
    return <LoginPage onContinue={() => setIsLoggedIn(true)} />;
  }

  // Shortlisted Course Master items
  const shortlistedCourses: CourseMasterItem[] = shortlistedCodes
    .map((code) => COURSE_BY_CODE.get(code))
    .filter((c): c is CourseMasterItem => c !== undefined);

  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col font-sans selection:bg-[#faf2f0] selection:text-[#b83e26]">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        shortlistCount={shortlistedCodes.length}
        hasCompletedSurvey={hasCompletedSurvey}
        onRetakeSurvey={hasCompletedSurvey ? handleRetakeJourney : undefined}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'survey' && (
          <>
            {!hasCompletedSurvey ? (
              <StudentJourney
                onComplete={handleJourneyComplete}
                onSkipToExplore={() => setActiveTab('explore')}
              />
            ) : (
              selectedObjective &&
              studentContext &&
              selectedCategory && (
                <RecommendationsView
                  recommendations={recommendations}
                  objective={selectedObjective}
                  studentContext={studentContext}
                  category={selectedCategory}
                  shortlistedCodes={shortlistedCodes}
                  onToggleShortlist={handleToggleShortlist}
                  onOpenDetails={setSelectedCourseForModal}
                  onRetake={handleRetakeJourney}
                  onGoToExplore={() => setActiveTab('explore')}
                  onGoToShortlist={() => setActiveTab('shortlist')}
                />
              )
            )}
          </>
        )}

        {activeTab === 'explore' && (
          <ExploreView
            shortlistedCodes={shortlistedCodes}
            onToggleShortlist={handleToggleShortlist}
            onOpenDetails={setSelectedCourseForModal}
            onStartSurvey={() => {
              setActiveTab('survey');
              if (hasCompletedSurvey) {
                handleRetakeJourney();
              }
            }}
          />
        )}

        {activeTab === 'shortlist' && (
          <ShortlistView
            courses={shortlistedCourses}
            onRemoveCourse={handleToggleShortlist}
            onClearAll={handleClearShortlist}
            onOpenDetails={setSelectedCourseForModal}
            onGoToExplore={() => setActiveTab('explore')}
            onGoToSurvey={() => {
              setActiveTab('survey');
              if (hasCompletedSurvey) {
                handleRetakeJourney();
              }
            }}
          />
        )}
      </main>

      {/* Course Details Modal */}
      <CourseModal
        course={selectedCourseForModal}
        onClose={() => setSelectedCourseForModal(null)}
        isShortlisted={
          selectedCourseForModal ? shortlistedCodes.includes(selectedCourseForModal.code) : false
        }
        onToggleShortlist={handleToggleShortlist}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-stone-100 py-8 px-4 text-center text-xs text-stone-400 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-700">Course Compass</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Ahmedabad University Winter 2027 Offerings</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <span>Amrut Mody School of Management</span>
            <span aria-hidden="true">·</span>
            <span>School of Engineering and Applied Science</span>
            <span aria-hidden="true">·</span>
            <span>School of Arts and Sciences</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
