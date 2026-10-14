export type PrimaryObjective =
  | 'Career Builder'
  | 'Skill Builder'
  | 'Explorer'
  | 'Major Enhancer'
  | 'Cross-Disciplinary Student'
  | 'Balance Seeker'
  | 'Interest Follower'
  | 'Grade Seeker';

export type EntryYear = '2022' | '2023' | '2024' | '2025' | '2026';

export type CourseCategoryType =
  | 'Major Elective'
  | 'Free Elective / Outside-Major Elective'
  | 'General Education (GER)';

export type GERSubCategory =
  | 'Humanities and Languages'
  | 'Social Sciences'
  | 'Mathematical and Physical Sciences'
  | 'Biological and Life Sciences'
  | 'Performing and Visual Arts'
  | 'Not sure / Uncategorised GER';

export interface StudentContext {
  year: EntryYear;
  programmeId: string;
  programmeName: string;
  majorId: string;
  majorName: string;
}

export interface CourseMasterItem {
  courseId?: string;
  code: string;
  name: string;
  level: 'Undergraduate' | 'Masters' | string;
  credits: number;
  school: 'AMSOM' | 'SAS' | 'SEAS' | string;
}

export interface ProgrammeMeta {
  id: string;
  name: string;
}

export interface MajorMeta {
  id: string;
  programmeId: string;
  name: string;
}

export interface CurriculumRequirement {
  programmeId: string;
  majorId?: string;
  requirementType:
    | 'SCHOOL_CORE'
    | 'PROGRAMME_CORE'
    | 'MAJOR_CORE'
    | 'PROGRAMME_AND_MAJOR_CORE'
    | 'ENGINEERING_FOUNDATION_CORE';
  courseCode: string;
}

export interface MajorElectivePoolItem {
  programmeId: string;
  majorId: string;
  courseCode: string;
}

export interface CurriculumDataset {
  programmes: ProgrammeMeta[];
  majors: MajorMeta[];
  requirements: CurriculumRequirement[];
  majorElectives: MajorElectivePoolItem[];
}

export interface AdaptiveQuestion {
  id: string;
  questionNumber: number;
  prompt: string;
  subtext?: string;
  options: {
    label: string;
    subtext: string;
    value: string;
    signalWeights?: Record<string, number>;
  }[];
}

export interface Recommendation {
  course: CourseMasterItem;
  fitPercentage: number;
  explanation: string;
  isTopPick: boolean;
  isAvailableWinter2027: boolean;
  school: string;
  credits: number;
  level: string;
  tags: string[];
}

export interface CuratedShelf {
  id: string;
  title: string;
  description: string;
  courses: CourseMasterItem[];
}
