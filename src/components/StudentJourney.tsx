import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Wrench,
  Compass,
  TrendingUp,
  Layers,
  Scale,
  Sparkles,
  Award,
  Check,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import {
  AdaptiveQuestion,
  CourseCategoryType,
  EntryYear,
  GERSubCategory,
  PrimaryObjective,
  StudentContext,
} from '../types';
import {
  getAdaptiveQuestions,
  getEligibleCourses,
  getMajorsForProgramme,
  getProgrammesForYear,
} from '../utils/courseEngine';

interface StudentJourneyProps {
  onComplete: (data: {
    objective: PrimaryObjective;
    context: StudentContext;
    category: CourseCategoryType;
    gerCategory?: GERSubCategory;
    surveyAnswers: Record<string, string>;
  }) => void;
  onSkipToExplore: () => void;
}

const OBJECTIVES: {
  title: PrimaryObjective;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    title: 'Career Builder',
    description: 'Target high-impact industry credentials, venture creation, family-business growth, and corporate readiness.',
    icon: Briefcase,
  },
  {
    title: 'Skill Builder',
    description: 'Acquire concrete hands-on competencies in data analytics, finance, programming, or design thinking.',
    icon: Wrench,
  },
  {
    title: 'Explorer',
    description: 'Encounter fresh intellectual horizons and unexpected perspectives outside your comfort zone.',
    icon: Compass,
  },
  {
    title: 'Major Enhancer',
    description: 'Deepen specialist mastery and advanced conceptual depth directly within your chosen degree discipline.',
    icon: TrendingUp,
  },
  {
    title: 'Cross-Disciplinary Student',
    description: 'Bridge distinct traditions—connecting management, engineering, and the liberal arts.',
    icon: Layers,
  },
  {
    title: 'Balance Seeker',
    description: 'Find engaging, manageable coursework with predictable pacing to safeguard your semester sanity.',
    icon: Scale,
  },
  {
    title: 'Interest Follower',
    description: 'Follow pure curiosity and personal passion without being bound strictly to pre-set career formulas.',
    icon: Sparkles,
  },
  {
    title: 'Grade Seeker',
    description: 'Discover accessible, transparently evaluated courses with clear rubrics to protect and enhance your GPA.',
    icon: Award,
  },
];

const ENTRY_YEARS: EntryYear[] = ['2022', '2023', '2024', '2025', '2026'];

const GER_CATEGORIES: GERSubCategory[] = [
  'Humanities and Languages',
  'Social Sciences',
  'Mathematical and Physical Sciences',
  'Biological and Life Sciences',
  'Performing and Visual Arts',
  'Not sure / Uncategorised GER',
];

export const StudentJourney: React.FC<StudentJourneyProps> = ({
  onComplete,
  onSkipToExplore,
}) => {
  // Step tracking: 1 (Objective), 2 (Student Context), 3 (Category), 4 (Adaptive Survey questions)
  const [journeyPhase, setJourneyPhase] = useState<'step1' | 'step2' | 'step3' | 'step4'>('step1');

  // Step 1: Objective
  const [selectedObjective, setSelectedObjective] = useState<PrimaryObjective | null>(null);

  // Step 2: Student Context
  const [selectedYear, setSelectedYear] = useState<EntryYear>('2024');
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<string>('');
  const [selectedMajorId, setSelectedMajorId] = useState<string>('');

  // Step 3: Course Category
  const [selectedCategory, setSelectedCategory] = useState<CourseCategoryType | null>(null);
  const [selectedGERCategory, setSelectedGERCategory] = useState<GERSubCategory>(
    'Not sure / Uncategorised GER'
  );

  // Step 4: Adaptive Survey
  const [adaptiveQuestions, setAdaptiveQuestions] = useState<AdaptiveQuestion[]>([]);
  const [surveyQuestionIndex, setSurveyQuestionIndex] = useState<number>(0);
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, string>>({});

  // Programs and majors for active year
  const availableProgrammes = getProgrammesForYear(selectedYear);
  const availableMajors = selectedProgrammeId
    ? getMajorsForProgramme(selectedYear, selectedProgrammeId)
    : [];

  // Reset major when programme changes
  const handleProgrammeChange = (progId: string) => {
    setSelectedProgrammeId(progId);
    const majors = getMajorsForProgramme(selectedYear, progId);
    setSelectedMajorId(majors.length > 0 ? majors[0].id : '');
  };

  const handleYearChange = (year: EntryYear) => {
    setSelectedYear(year);
    const progs = getProgrammesForYear(year);
    const firstProg = progs.length > 0 ? progs[0].id : '';
    setSelectedProgrammeId(firstProg);
    const majors = firstProg ? getMajorsForProgramme(year, firstProg) : [];
    setSelectedMajorId(majors.length > 0 ? majors[0].id : '');
  };

  // Move from Step 1 to Step 2
  const handleProceedFromStep1 = () => {
    if (!selectedObjective) return;
    if (!selectedProgrammeId && availableProgrammes.length > 0) {
      setSelectedProgrammeId(availableProgrammes[0].id);
      const majors = getMajorsForProgramme(selectedYear, availableProgrammes[0].id);
      if (majors.length > 0) setSelectedMajorId(majors[0].id);
    }
    setJourneyPhase('step2');
  };

  // Move from Step 2 to Step 3
  const handleProceedFromStep2 = () => {
    if (!selectedProgrammeId || !selectedMajorId) return;
    setJourneyPhase('step3');
  };

  // Move from Step 3 to Step 4 (Adaptive Survey initialization)
  const handleProceedFromStep3 = () => {
    if (!selectedCategory || !selectedObjective) return;

    const prog = availableProgrammes.find((p) => p.id === selectedProgrammeId);
    const maj = availableMajors.find((m) => m.id === selectedMajorId);
    const studentContext: StudentContext = {
      year: selectedYear,
      programmeId: selectedProgrammeId,
      programmeName: prog?.name || selectedProgrammeId,
      majorId: selectedMajorId,
      majorName: maj?.name || selectedMajorId,
    };

    const questions = getAdaptiveQuestions(
      selectedObjective,
      studentContext,
      selectedCategory,
      selectedGERCategory
    );

    setAdaptiveQuestions(questions);
    setSurveyQuestionIndex(0);
    setJourneyPhase('step4');
  };

  // Step 4: Survey answer selection & navigation
  const handleSelectSurveyAnswer = (questionId: string, answerValue: string) => {
    setSurveyAnswers((prev) => ({
      ...prev,
      [questionId]: answerValue,
    }));
  };

  const handleNextSurveyQuestion = () => {
    if (surveyQuestionIndex < adaptiveQuestions.length - 1) {
      setSurveyQuestionIndex((prev) => prev + 1);
    } else {
      // Completed survey!
      const prog = availableProgrammes.find((p) => p.id === selectedProgrammeId);
      const maj = availableMajors.find((m) => m.id === selectedMajorId);
      const studentContext: StudentContext = {
        year: selectedYear,
        programmeId: selectedProgrammeId,
        programmeName: prog?.name || selectedProgrammeId,
        majorId: selectedMajorId,
        majorName: maj?.name || selectedMajorId,
      };

      if (!selectedObjective || !selectedCategory) return;

      onComplete({
        objective: selectedObjective,
        context: studentContext,
        category: selectedCategory,
        gerCategory: selectedGERCategory,
        surveyAnswers,
      });
    }
  };

  const handleBackSurveyQuestion = () => {
    if (surveyQuestionIndex > 0) {
      setSurveyQuestionIndex((prev) => prev - 1);
    } else {
      setJourneyPhase('step3');
    }
  };

  // Render Step 1: Primary Objective
  if (journeyPhase === 'step1') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8 text-center max-w-xl mx-auto">
          <span className="text-xs font-semibold text-[#b83e26] uppercase tracking-wider block mb-2">
            Step 1 · Primary Objective
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight mb-2">
            What brings you to Course Compass?
          </h1>
          <p className="text-sm text-stone-500 leading-relaxed">
            Select the primary orientation guiding your course discovery for the Winter 2027 semester.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
          {OBJECTIVES.map((item) => {
            const isSelected = selectedObjective === item.title;
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                onClick={() => setSelectedObjective(item.title)}
                className={`p-4 sm:p-5 rounded-lg border text-left transition-all cursor-pointer flex items-start gap-4 ${
                  isSelected
                    ? 'border-[#b83e26] bg-[#faf2f0]/60 ring-1 ring-[#b83e26]'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/60'
                }`}
              >
                <div
                  className={`p-2 rounded-md shrink-0 transition-colors ${
                    isSelected ? 'bg-[#b83e26] text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-sm sm:text-base font-semibold ${
                        isSelected ? 'text-[#b83e26]' : 'text-stone-900'
                      }`}
                    >
                      {item.title}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-[#b83e26] stroke-[2.5]" />}
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-stone-200">
          <button
            onClick={onSkipToExplore}
            className="text-xs text-stone-500 hover:text-stone-800 underline underline-offset-4 cursor-pointer"
          >
            Skip to Explore Catalog
          </button>

          <button
            onClick={handleProceedFromStep1}
            disabled={!selectedObjective}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              selectedObjective
                ? 'bg-[#b83e26] hover:bg-[#9e321e] text-white shadow-xs'
                : 'bg-stone-100 text-stone-400 cursor-not-allowed'
            }`}
          >
            <span>Continue to Student Context</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Render Step 2: Student Context
  if (journeyPhase === 'step2') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-14">
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="font-semibold text-stone-700">Step 2 of 4</span>
            <span>Student Context</span>
          </div>
          <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#b83e26] transition-all w-1/2" />
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight mb-2">
            Your Academic Profile
          </h1>
          <p className="text-sm text-stone-500 leading-relaxed">
            We use your entry cohort and degree structure to apply official curriculum rules and prevent recommending required core courses.
          </p>
        </div>

        <div className="space-y-6 mb-10">
          {/* Entry Year */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
              Entry Year Cohort
            </label>
            <div className="grid grid-cols-5 gap-2">
              {ENTRY_YEARS.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearChange(year)}
                  className={`py-2 text-xs sm:text-sm font-medium rounded-md border text-center transition-colors cursor-pointer ${
                    selectedYear === year
                      ? 'border-[#b83e26] bg-[#b83e26] text-white'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-stone-400 mt-1.5">
              {selectedYear === '2022' || selectedYear === '2023'
                ? 'Curriculum: Pre-2024 active cohort dataset'
                : 'Curriculum: 2024+ curriculum structures'}
            </p>
          </div>

          {/* Programme */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
              Degree Programme
            </label>
            <select
              value={selectedProgrammeId}
              onChange={(e) => handleProgrammeChange(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#b83e26] focus:ring-1 focus:ring-[#b83e26]"
            >
              {availableProgrammes.map((prog) => (
                <option key={prog.id} value={prog.id}>
                  {prog.name} ({prog.id})
                </option>
              ))}
            </select>
          </div>

          {/* Major */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
              Major / Academic Concentration
            </label>
            <select
              value={selectedMajorId}
              onChange={(e) => setSelectedMajorId(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#b83e26] focus:ring-1 focus:ring-[#b83e26]"
            >
              {availableMajors.map((maj) => (
                <option key={maj.id} value={maj.id}>
                  {maj.name} ({maj.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-stone-200">
          <button
            onClick={() => setJourneyPhase('step1')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={handleProceedFromStep2}
            disabled={!selectedProgrammeId || !selectedMajorId}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              selectedProgrammeId && selectedMajorId
                ? 'bg-[#b83e26] hover:bg-[#9e321e] text-white shadow-xs'
                : 'bg-stone-100 text-stone-400 cursor-not-allowed'
            }`}
          >
            <span>Continue to Course Category</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Render Step 3: Course Category
  if (journeyPhase === 'step3') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-14">
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="font-semibold text-stone-700">Step 3 of 4</span>
            <span>Course Category</span>
          </div>
          <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#b83e26] transition-all w-3/4" />
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight mb-2">
            What kind of course are you looking for?
          </h1>
          <p className="text-sm text-stone-500 leading-relaxed">
            Select the curriculum bucket you are aiming to fulfill for Winter 2027.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {/* Option A: Major Elective */}
          <button
            onClick={() => setSelectedCategory('Major Elective')}
            className={`w-full p-4 sm:p-5 rounded-lg border text-left transition-all cursor-pointer flex items-start justify-between ${
              selectedCategory === 'Major Elective'
                ? 'border-[#b83e26] bg-[#faf2f0]/60 ring-1 ring-[#b83e26]'
                : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
            }`}
          >
            <div>
              <div className="text-base font-semibold text-stone-900 mb-1">
                Major Elective
              </div>
              <p className="text-xs sm:text-sm text-stone-500">
                Filtered strictly using your official Major Elective pool from the curriculum dataset.
              </p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                selectedCategory === 'Major Elective'
                  ? 'border-[#b83e26] bg-[#b83e26] text-white'
                  : 'border-stone-300 bg-white'
              }`}
            >
              {selectedCategory === 'Major Elective' && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
            </div>
          </button>

          {/* Option B: Free Elective / Outside-Major Elective */}
          <button
            onClick={() => setSelectedCategory('Free Elective / Outside-Major Elective')}
            className={`w-full p-4 sm:p-5 rounded-lg border text-left transition-all cursor-pointer flex items-start justify-between ${
              selectedCategory === 'Free Elective / Outside-Major Elective'
                ? 'border-[#b83e26] bg-[#faf2f0]/60 ring-1 ring-[#b83e26]'
                : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
            }`}
          >
            <div>
              <div className="text-base font-semibold text-stone-900 mb-1">
                Free Elective / Outside-Major Elective
              </div>
              <p className="text-xs sm:text-sm text-stone-500">
                Courses outside your major requirements. Excludes your School Core, Programme Core, Major Core, and your major's specific electives; Major Electives from other majors are eligible and recommended.
              </p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                selectedCategory === 'Free Elective / Outside-Major Elective'
                  ? 'border-[#b83e26] bg-[#b83e26] text-white'
                  : 'border-stone-300 bg-white'
              }`}
            >
              {selectedCategory === 'Free Elective / Outside-Major Elective' && (
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
            </div>
          </button>

          {/* Option C: General Education (GER) */}
          <button
            onClick={() => setSelectedCategory('General Education (GER)')}
            className={`w-full p-4 sm:p-5 rounded-lg border text-left transition-all cursor-pointer flex items-start justify-between ${
              selectedCategory === 'General Education (GER)'
                ? 'border-[#b83e26] bg-[#faf2f0]/60 ring-1 ring-[#b83e26]'
                : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
            }`}
          >
            <div>
              <div className="text-base font-semibold text-stone-900 mb-1">
                General Education (GER)
              </div>
              <p className="text-xs sm:text-sm text-stone-500">
                Foundational inquiry courses across the five Ahmedabad University liberal education areas.
              </p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                selectedCategory === 'General Education (GER)'
                  ? 'border-[#b83e26] bg-[#b83e26] text-white'
                  : 'border-stone-300 bg-white'
              }`}
            >
              {selectedCategory === 'General Education (GER)' && (
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
            </div>
          </button>
        </div>

        {/* If GER is selected, show the 6 sub-options */}
        {selectedCategory === 'General Education (GER)' && (
          <div className="p-4 sm:p-5 bg-stone-50 border border-stone-200 rounded-lg mb-8">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-3">
              Choose GER Academic Area
            </label>
            <div className="space-y-2">
              {GER_CATEGORIES.map((gerCat) => (
                <button
                  key={gerCat}
                  onClick={() => setSelectedGERCategory(gerCat)}
                  className={`w-full p-3 text-xs sm:text-sm rounded-md border text-left transition-colors cursor-pointer flex items-center justify-between ${
                    selectedGERCategory === gerCat
                      ? 'border-[#b83e26] bg-white text-[#b83e26] font-semibold'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <span>{gerCat}</span>
                  {selectedGERCategory === gerCat && (
                    <Check className="w-4 h-4 text-[#b83e26]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-stone-200">
          <button
            onClick={() => setJourneyPhase('step2')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={handleProceedFromStep3}
            disabled={!selectedCategory}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              selectedCategory
                ? 'bg-[#b83e26] hover:bg-[#9e321e] text-white shadow-xs'
                : 'bg-stone-100 text-stone-400 cursor-not-allowed'
            }`}
          >
            <span>Start Adaptive Survey</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Render Step 4: Adaptive Quick Survey (1 question per screen with progress indicator)
  const currentQ = adaptiveQuestions[surveyQuestionIndex];
  if (!currentQ) return null;

  const currentAnswer = surveyAnswers[currentQ.id];
  const isLastQuestion = surveyQuestionIndex === adaptiveQuestions.length - 1;
  const progressPercent = ((surveyQuestionIndex + 1) / adaptiveQuestions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-14">
      {/* Progress header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
          <span className="font-semibold text-stone-700">
            Adaptive Question {surveyQuestionIndex + 1} of {adaptiveQuestions.length}
          </span>
          <span className="text-stone-500 font-medium">
            Signal: {selectedObjective}
          </span>
        </div>
        <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#b83e26] transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question prompt */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight leading-snug mb-2">
          {currentQ.prompt}
        </h1>
        {currentQ.subtext && (
          <p className="text-sm text-stone-500">{currentQ.subtext}</p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3 mb-10">
        {currentQ.options.map((opt) => {
          const isSelected = currentAnswer === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => handleSelectSurveyAnswer(currentQ.id, opt.value)}
              className={`w-full p-4 sm:p-5 rounded-lg border text-left transition-all cursor-pointer flex items-start justify-between group ${
                isSelected
                  ? 'border-[#b83e26] bg-[#faf2f0]/60 ring-1 ring-[#b83e26]'
                  : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
              }`}
            >
              <div className="pr-4">
                <div
                  className={`text-sm sm:text-base font-semibold mb-1 ${
                    isSelected ? 'text-[#b83e26]' : 'text-stone-900'
                  }`}
                >
                  {opt.label}
                </div>
                <div className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                  {opt.subtext}
                </div>
              </div>

              <div
                className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'border-[#b83e26] bg-[#b83e26] text-white'
                    : 'border-stone-300 bg-white group-hover:border-stone-400'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200">
        <button
          onClick={handleBackSurveyQuestion}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={handleNextSurveyQuestion}
          disabled={!currentAnswer}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
            currentAnswer
              ? 'bg-[#b83e26] hover:bg-[#9e321e] text-white shadow-xs'
              : 'bg-stone-100 text-stone-400 cursor-not-allowed'
          }`}
        >
          <span>{isLastQuestion ? 'Generate Recommendations' : 'Next Question'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
