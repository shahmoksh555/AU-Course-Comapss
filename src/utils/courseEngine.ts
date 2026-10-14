import {
  AdaptiveQuestion,
  CourseCategoryType,
  CourseMasterItem,
  EntryYear,
  GERSubCategory,
  MajorMeta,
  PrimaryObjective,
  ProgrammeMeta,
  Recommendation,
  StudentContext,
} from '../types';
import {
  COURSE_BY_CODE,
  COURSE_MASTER,
  CURRICULUM_2024_PLUS,
  CURRICULUM_PRE_2024,
  getGERSubCategory,
  WINTER_2027_OFFERINGS,
} from '../data/rawDatasets';

// 1. Dataset Selection Helper
export function getCurriculumForYear(year: EntryYear) {
  if (year === '2022' || year === '2023') {
    return CURRICULUM_PRE_2024;
  }
  return CURRICULUM_2024_PLUS;
}

// 2. Dependent Dropdown Lookups
export function getProgrammesForYear(year: EntryYear): ProgrammeMeta[] {
  const curriculum = getCurriculumForYear(year);
  return curriculum.programmes;
}

export function getMajorsForProgramme(
  year: EntryYear,
  programmeId: string
): MajorMeta[] {
  const curriculum = getCurriculumForYear(year);
  return curriculum.majors.filter((m) => m.programmeId === programmeId);
}

// 3. Compulsory Core Codes Set for Student Context
export function getCompulsoryCourseCodes(student: StudentContext): Set<string> {
  const curriculum = getCurriculumForYear(student.year);
  const coreCodes = new Set<string>();

  for (const req of curriculum.requirements) {
    if (req.programmeId === student.programmeId) {
      // If majorId is specified in the requirement, it must match the student's major
      if (!req.majorId || req.majorId === student.majorId) {
        coreCodes.add(req.courseCode);
      }
    }
  }

  return coreCodes;
}

// 4. Major Elective Pool Codes
export function getMajorElectivePoolCodes(student: StudentContext): Set<string> {
  const curriculum = getCurriculumForYear(student.year);
  const pool = new Set<string>();

  for (const item of curriculum.majorElectives) {
    if (
      item.programmeId === student.programmeId &&
      item.majorId === student.majorId
    ) {
      pool.add(item.courseCode);
    }
  }

  return pool;
}

// 5. Eligible Courses Calculation
export function getEligibleCourses(
  student: StudentContext,
  category: CourseCategoryType,
  gerCategory?: GERSubCategory
): CourseMasterItem[] {
  const winterOfferingsSet = new Set(WINTER_2027_OFFERINGS);
  const compulsoryCodes = getCompulsoryCourseCodes(student);
  const majorElectiveCodes = getMajorElectivePoolCodes(student);

  // We only consider courses that are offered in Winter 2027
  const winterCourses: CourseMasterItem[] = [];
  for (const code of WINTER_2027_OFFERINGS) {
    const masterCourse = COURSE_BY_CODE.get(code);
    if (masterCourse) {
      winterCourses.push(masterCourse);
    } else {
      // Fallback for code with no metadata
      winterCourses.push({
        code,
        name: code,
        level: 'Undergraduate',
        credits: 3.0,
        school: code.startsWith('E') || code.startsWith('C') ? 'SEAS' : 'AMSOM',
      });
    }
  }

  // Filter based on category
  const eligible = winterCourses.filter((course) => {
    // Rule: Never recommend School Core, Programme Core, Major Core, or Engineering Foundation Core
    if (compulsoryCodes.has(course.code)) {
      return false;
    }

    if (category === 'Major Elective') {
      return majorElectiveCodes.has(course.code);
    }

    if (category === 'Free Elective / Outside-Major Elective') {
      // Rule: Exclude courses belonging to student's compulsory and major-elective requirement pools
      if (compulsoryCodes.has(course.code) || majorElectiveCodes.has(course.code)) {
        return false;
      }
      return true;
    }

    if (category === 'General Education (GER)') {
      if (compulsoryCodes.has(course.code)) {
        return false;
      }

      const subCat = getGERSubCategory(course.code);
      if (!subCat) return false;

      if (!gerCategory || gerCategory === 'Not sure / Uncategorised GER') {
        return true;
      }

      return subCat === gerCategory;
    }

    return true;
  });

  return eligible;
}

// 6. Adaptive 5-6 Question Generator
export function getAdaptiveQuestions(
  objective: PrimaryObjective,
  context: StudentContext,
  category: CourseCategoryType,
  gerCategory?: GERSubCategory
): AdaptiveQuestion[] {
  const questions: AdaptiveQuestion[] = [];

  // Question 1: Workload pacing (adapted by objective)
  if (objective === 'Balance Seeker' || objective === 'Grade Seeker') {
    questions.push({
      id: 'workload_target',
      questionNumber: 1,
      prompt: 'What credit load and pacing will best safeguard your semester equilibrium?',
      subtext: 'We prioritize courses that fit your scheduling headroom.',
      options: [
        { label: 'Light (1.5 Credits)', subtext: 'Targeted half-semester modules with minimal continuous load', value: 'light_1_5' },
        { label: 'Standard (3.0 Credits)', subtext: 'Predictable weekly schedule with manageable milestones', value: 'standard_3' },
        { label: 'Flexible / Low-stress', subtext: 'Courses with continuous formative assessment over high-stakes exams', value: 'formative' },
      ],
    });
  } else {
    questions.push({
      id: 'workload_target',
      questionNumber: 1,
      prompt: 'How demanding of a workload are you planning for this course?',
      subtext: 'Matches courses to your target semester intensity.',
      options: [
        { label: 'Intensive & In-depth (3.0–4.0 Credits)', subtext: 'Ready for deep rigor and challenging deliverables', value: 'intensive' },
        { label: 'Moderate & Balanced (3.0 Credits)', subtext: 'Solid intellectual engagement with steady weekly pace', value: 'standard_3' },
        { label: 'Compact & Focused (1.5–2.0 Credits)', subtext: 'Focused, high-impact module with concise credit footprint', value: 'compact' },
      ],
    });
  }

  // Question 2: Learning & Evaluation Format (adapted to objective)
  if (objective === 'Career Builder') {
    questions.push({
      id: 'career_delivery',
      questionNumber: 2,
      prompt: 'What type of career deliverable or skill output do you most want to produce?',
      subtext: 'Career Builder matches prioritize tangible industry and venture competencies.',
      options: [
        { label: 'Venture & Market Strategy', subtext: 'Business plans, entrepreneurship, finance models, or family-firm growth', value: 'strategy' },
        { label: 'Analytics & Decision Tools', subtext: 'Applied business analytics, forecasting, or operations toolkits', value: 'analytics' },
        { label: 'Professional Communication & Client Pitch', subtext: 'Negotiation, strategic branding, and client-facing presentations', value: 'communication' },
        { label: 'Product & System Implementation', subtext: 'Prototyping, operational design, and practical workflows', value: 'product' },
      ],
    });
  } else if (objective === 'Skill Builder') {
    questions.push({
      id: 'skill_focus',
      questionNumber: 2,
      prompt: 'Which hands-on competency toolkit is your primary target?',
      options: [
        { label: 'Computational & Data Literacy', subtext: 'Programming, data visualization, and statistical modeling', value: 'computational' },
        { label: 'Financial & Accounting Acumen', subtext: 'Taxation, financial markets, valuation, and capital strategy', value: 'financial' },
        { label: 'Design & Visual Communication', subtext: 'Design thinking, UX/UI, studio art, or audio/media production', value: 'design' },
        { label: 'Analytical Writing & Research Methods', subtext: 'Literature synthesis, qualitative field methods, and policy memos', value: 'research' },
      ],
    });
  } else {
    questions.push({
      id: 'pedagogy_style',
      questionNumber: 2,
      prompt: 'Which classroom format helps you learn and perform at your best?',
      options: [
        { label: 'Discussion-led Seminars', subtext: 'Socratic dialogue, reading packets, and critical debate', value: 'seminar' },
        { label: 'Project & Studio Teams', subtext: 'Hands-on collaboration, tangible prototypes, and group reviews', value: 'project' },
        { label: 'Quantitative & Analytical Labs', subtext: 'Structured problem sets, algorithms, or empirical lab models', value: 'analytical' },
        { label: 'Experiential & Field Observation', subtext: 'City walks, ethnographic observation, and cultural immersion', value: 'field' },
      ],
    });
  }

  // Question 3: Curricular Domain Angle (adapted by course category)
  if (category === 'General Education (GER)') {
    questions.push({
      id: 'ger_theme',
      questionNumber: 3,
      prompt: 'What intellectual question would you find most refreshing to explore?',
      options: [
        { label: 'Human Heritage, Philosophy & Languages', subtext: 'Deep historical currents, ethical quandaries, and classical texts', value: 'humanities' },
        { label: 'Societal Systems, Cities & Public Policy', subtext: 'Urban realities, social stratification, and democratic institutions', value: 'social' },
        { label: 'Natural Living Systems & Biological Sciences', subtext: 'Brain science, physiology, ecology, and environmental health', value: 'biological' },
        { label: 'Creative Studio, Theatre & Visual Arts', subtext: 'Studio art, photography, theatre, sound design, and acting', value: 'arts' },
      ],
    });
  } else if (category === 'Major Elective') {
    questions.push({
      id: 'major_orientation',
      questionNumber: 3,
      prompt: 'Within your major elective pool, what focus area do you want to strengthen?',
      options: [
        { label: 'Advanced Specialist Theory', subtext: 'Rigorous conceptual foundations for honors or postgraduate study', value: 'specialist' },
        { label: 'Applied Industry Practice', subtext: 'Case studies, market applications, and contemporary sector challenges', value: 'applied' },
        { label: 'Emerging Technologies & Modern Methods', subtext: 'Cutting-edge digital tools, AI adoption, or new methodologies', value: 'emerging' },
      ],
    });
  } else {
    questions.push({
      id: 'outside_major_goal',
      questionNumber: 3,
      prompt: 'What is your main intention for stepping outside your major department?',
      options: [
        { label: 'Complementary Minor Foundation', subtext: 'Building structured credits toward an interdisciplinary minor', value: 'minor' },
        { label: 'Novel Perspective & Contrast', subtext: 'Exploring a discipline completely different from my home school', value: 'contrast' },
        { label: 'High-Utility Practical Tool', subtext: 'Gaining an adjacent tool that makes my major work more impactful', value: 'utility' },
      ],
    });
  }

  // Question 4: Assessment & Grading Model Preference
  questions.push({
    id: 'assessment_pref',
    questionNumber: 4,
    prompt: 'What evaluation structure do you feel most comfortable with this semester?',
    options: [
      { label: 'Continuous coursework & project deliverables', subtext: 'Regular incremental submissions rather than high-stakes exam blocks', value: 'continuous' },
      { label: 'Essays, research memos, and presentations', subtext: 'Expressing nuanced arguments through writing and class voice', value: 'written' },
      { label: 'Clear-cut objective problem sets & labs', subtext: 'Clear quantitative grading rubrics and technical tasks', value: 'problem_sets' },
    ],
  });

  // Question 5: School & Interdisciplinary Synergy
  questions.push({
    id: 'school_preference',
    questionNumber: 5,
    prompt: 'Do you have a preferred school or institutional style for this course?',
    options: [
      { label: 'Amrut Mody School of Management (AMSOM)', subtext: 'Management, marketing, finance, accounting, and operations', value: 'AMSOM' },
      { label: 'School of Arts and Sciences (SAS)', subtext: 'Humanities, social sciences, life sciences, math, and performing arts', value: 'SAS' },
      { label: 'School of Engineering and Applied Science (SEAS)', subtext: 'Computing, electronics, chemical, and engineering sciences', value: 'SEAS' },
      { label: 'Open to any school offering', subtext: 'Whatever course best matches my answers regardless of school', value: 'any' },
    ],
  });

  // Question 6: Semester Impact & Personal Milestone
  questions.push({
    id: 'semester_milestone',
    questionNumber: 6,
    prompt: 'At the end of Winter 2027, what outcome will make this course feel like a win?',
    options: [
      { label: 'A tangible portfolio project or business artifact', subtext: 'Something concrete to show mentors, recruiters, or investors', value: 'portfolio' },
      { label: 'A strong grade that maintained or boosted my GPA', subtext: 'Confident academic execution without surprise penalties', value: 'gpa' },
      { label: 'A transformed way of thinking about the world', subtext: 'Deep intellectual curiosity and personal growth', value: 'insight' },
    ],
  });

  return questions;
}

// 7. Heuristic Ranking & Recommendation Engine
export function generateRecommendations(
  eligibleCourses: CourseMasterItem[],
  objective: PrimaryObjective,
  answers: Record<string, string>,
  student: StudentContext
): Recommendation[] {
  if (eligibleCourses.length === 0) {
    return [];
  }

  const scored = eligibleCourses.map((course) => {
    let score = 50; // base score
    const rationaleParts: string[] = [];

    // Objective Scoring Signal
    switch (objective) {
      case 'Career Builder':
        if (
          course.school === 'AMSOM' ||
          course.code.startsWith('MGT') ||
          course.code.startsWith('MKT') ||
          course.code.startsWith('FAC') ||
          course.code.startsWith('FBE') ||
          course.code.startsWith('TOD')
        ) {
          score += 24;
          rationaleParts.push(`Aligns directly with your Career Builder objective in business, finance, or venture strategy.`);
        } else if (course.code.startsWith('CSE') || course.code.startsWith('DES')) {
          score += 18;
          rationaleParts.push(`Builds marketable technical or design capabilities.`);
        }
        break;

      case 'Skill Builder':
        if (
          course.code.startsWith('TOD') ||
          course.code.startsWith('CSE') ||
          course.code.startsWith('MAT') ||
          course.code.startsWith('STA') ||
          course.code.startsWith('FAC') ||
          course.code.startsWith('DES')
        ) {
          score += 24;
          rationaleParts.push(`Equips you with concrete, applied tools and methodologies.`);
        }
        break;

      case 'Balance Seeker':
        if (course.credits <= 2.0) {
          score += 26;
          rationaleParts.push(`Features a compact ${course.credits}-credit footprint to protect your semester balance.`);
        } else if (course.credits === 3.0) {
          score += 16;
          rationaleParts.push(`Offers steady, standard 3-credit pacing.`);
        } else {
          score -= 10;
        }
        break;

      case 'Grade Seeker':
        if (course.level === 'Undergraduate' && course.credits <= 3.0) {
          score += 20;
          rationaleParts.push(`Offers structured undergraduate learning with clear evaluation bounds.`);
        }
        break;

      case 'Explorer':
      case 'Cross-Disciplinary Student':
        if (
          (student.programmeId.startsWith('BTECH') && course.school !== 'SEAS') ||
          (student.programmeId.startsWith('BCOM') && course.school !== 'AMSOM') ||
          (student.programmeId.startsWith('BA') && course.school !== 'SAS')
        ) {
          score += 22;
          rationaleParts.push(`Expands your horizons with cross-disciplinary perspectives from ${course.school}.`);
        } else {
          score += 12;
        }
        break;

      case 'Major Enhancer':
        score += 18;
        rationaleParts.push(`Directly strengthens your academic concentration in ${student.majorName}.`);
        break;

      case 'Interest Follower':
        score += 15;
        rationaleParts.push(`Offers genuine intellectual curiosity in ${course.name}.`);
        break;
    }

    // Workload answer matching
    if (answers.workload_target === 'light_1_5' || answers.workload_target === 'compact') {
      if (course.credits <= 2.0) {
        score += 14;
        rationaleParts.push(`Matches your preference for compact credits (${course.credits} Cr).`);
      }
    } else if (answers.workload_target === 'intensive') {
      if (course.credits >= 3.0) {
        score += 12;
        rationaleParts.push(`Provides the credit depth (${course.credits} Cr) you requested.`);
      }
    }

    // School preference answer matching
    if (answers.school_preference && answers.school_preference !== 'any') {
      if (course.school === answers.school_preference) {
        score += 15;
        rationaleParts.push(`Offered by your preferred school (${course.school}).`);
      }
    }

    // Level check
    if (course.level === 'Undergraduate') {
      score += 5;
    }

    // Compose concise explanation
    let explanation = rationaleParts.slice(0, 2).join(' ');
    if (!explanation) {
      explanation = `Eligible ${course.school} offering matching your ${objective} profile for Winter 2027.`;
    }

    return {
      course,
      score,
      explanation,
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Take between 10 and 15 courses (or all available if < 10)
  const targetCount = Math.min(15, Math.max(Math.min(10, scored.length), scored.length));
  const slice = scored.slice(0, targetCount);

  // Normalize scores to heuristic fit percentages (82% - 98%)
  const maxScore = slice[0]?.score || 70;
  const minScore = slice[slice.length - 1]?.score || 40;
  const scoreRange = Math.max(1, maxScore - minScore);

  return slice.map((item, index) => {
    const isTopPick = index < 4;
    // Calculate normalized percentage
    const rawPct = 96 - Math.round(((maxScore - item.score) / scoreRange) * 14) - index;
    const fitPercentage = Math.max(78, Math.min(98, rawPct));

    const tags: string[] = [item.course.school, `${item.course.credits} Credits`, item.course.level];

    return {
      course: item.course,
      fitPercentage,
      explanation: item.explanation,
      isTopPick,
      isAvailableWinter2027: true,
      school: item.course.school,
      credits: item.course.credits,
      level: item.course.level,
      tags,
    };
  });
}
