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
import { supabase } from './lib/supabase';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
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
    if (!supabase) {
      setAuthReady(true);
      return;
    }

    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) console.error('Could not restore Supabase session:', error.message);
      setIsLoggedIn(Boolean(data.session));
      setAuthReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session));
      setAuthReady(true);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('course_compass_shortlist_v2', JSON.stringify(shortlistedCodes));
    } catch {
      // Ignore unavailable browser storage.
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

    const eligible = getEligibleCourses(data.context, data.category, data.gerCategory);
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

  const handleSignOut = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Could not sign out:', error.message);
  };

  if (!authReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fbfaf8] text-stone-600">
        <p className="text-sm">Restoring your secure session…</p>
      </main>
    );
  }

  if (!isLoggedIn) {
    return <LoginPage onAuthenticated={() => setIsLoggedIn(true)} />;
  }

  const shortlistedCourses: CourseMasterItem[] = shortlistedCodes
    .map((code) => COURSE_BY_CODE.get(code))
    .filter((c): c is CourseMasterItem => c !== undefined);

  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col font-sans selection:bg-[#faf2f0] selection:text-[#b83e26]">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        shortlistCount={shortlistedCodes.length}
        hasCompletedSurvey={hasCompletedSurvey}
        onRetakeSurvey={hasCompletedSurvey ? handleRetakeJourney : undefined}
      />

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
              if (hasCompletedSurvey) handleRetakeJourney();
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
              if (hasCompletedSurvey) handleRetakeJourney();
            }}
          />
        )}
      </main>

      <CourseModal
        course={selectedCourseForModal}
        onClose={() => setSelectedCourseForModal(null)}
        isShortlisted={
          selectedCourseForModal ? shortlistedCodes.includes(selectedCourseForModal.code) : false
        }
        onToggleShortlist={handleToggleShortlist}
      />

      <footer className="mt-auto border-t border-stone-100 px-4 py-8 text-center text-xs text-stone-400">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-700">Course Compass</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Ahmedabad University Winter 2027 Offerings</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-stone-400">
            <span>Amrut Mody School of Management</span>
            <span aria-hidden="true">·</span>
            <span>School of Engineering and Applied Science</span>
            <span aria-hidden="true">·</span>
            <span>School of Arts and Sciences</span>
            <button type="button" onClick={handleSignOut} className="font-medium text-[#a83a25] hover:underline">Sign out</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
