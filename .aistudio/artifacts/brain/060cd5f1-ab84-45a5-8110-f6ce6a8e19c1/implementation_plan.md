# Course Compass — Comprehensive Curriculum & Adaptive Recommendation Upgrade

Upgrade the Course Compass application to use authentic Ahmedabad University curriculum datasets, a rigorous multi-step student journey with adaptive questioning, and accurate Winter 2027 semester offerings filtering.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were clarified and confirmed with the user:
> - **Adaptive Survey Presentation**: Questions will be presented **one question per screen with a progress indicator**, preserving focused cognitive load and clean interaction.
> - **Curated Explore Tab**: Organized into **8 broad, universally useful curated collections** that benefit the vast majority of students across all disciplines rather than narrow skill tags.

- **Confirmed Decision 1**: Adaptive survey uses sequential 1-question-per-screen layout with step progress indicators.
- **Confirmed Decision 2**: Explore tab structured with 8 broad curated shelves spanning Career Foundations, Tech/Data Literacy, GER disciplines (Humanities, Social Sciences, Math/Physical, Biological, Arts), and Balanced Electives.
- **Confirmed Decision 3**: Strict adherence to official Winter 2027 offerings (203 available courses), authentic curriculum core exclusion, and heuristic match scores without hallucinated course attributes.

---

## 1. Overview & Core Concept

- **What It Does**: Guides Ahmedabad University students through an intelligent 5-step discovery journey:
  1. **Primary Objective**: Identifies student orientation (Career Builder, Skill Builder, Explorer, Major Enhancer, Cross-Disciplinary Student, Balance Seeker, Interest Follower, Grade Seeker).
  2. **Student Context**: Dependent selection of Entry Year (2022–2026), Programme, and Major using the appropriate curriculum dataset (Pre-2024 vs. 2024+).
  3. **Course Category**: Targets Major Electives, Free/Outside-Major Electives, or General Education (GER) across 5 academic divisions or uncategorized.
  4. **Adaptive Quick Survey**: 5–6 targeted questions dynamically generated based on objective, year, major, and course category.
  5. **Recommendations**: 10–15 eligible Winter 2027 courses split into top 3–5 highlighted matches with fit percentages and rationale, plus secondary eligible recommendations.
- **Target Audience**: Undergraduate and master's students at Ahmedabad University (AMSOM, SEAS, SAS) preparing for the Winter 2027 registration cycle.
- **Key Value**: Guarantees curricular eligibility (excluding cores and unoffered courses), demystifies elective options, and saves time with grounded advice.

---

## 2. User Experience & Visual Design

### Key User Flows

```
┌─────────────────────────┐
│ Step 1: Objective       │ -> 8 student personas (Career Builder, Balance Seeker, etc.)
└────────────┬────────────┘
             ▼
┌─────────────────────────┐
│ Step 2: Student Context │ -> Year (2022-2026) -> Programme -> Major (Curriculum-linked)
└────────────┬────────────┘
             ▼
┌─────────────────────────┐
│ Step 3: Category Choice │ -> Major Elective / Free Elective / GER (5 sub-areas + Any)
└────────────┬────────────┘
             ▼
┌─────────────────────────┐
│ Step 4: Adaptive Survey │ -> 5-6 dynamic, one-by-one questions tailored to answers
└────────────┬────────────┘
             ▼
┌─────────────────────────┐
│ Step 5: Recommendations │ -> Top 3-5 Featured (fit %) + Secondary list (up to 15)
│                         │ -> "Get More Personalised Recommendations" notice
└─────────────────────────┘
```

### Visual Identity & Theme
- **Canvas**: Clean pure white (`#FFFFFF`) with subtle stone structural surfaces (`border-stone-200`, `bg-stone-50`).
- **Accent**: Ahmedabad University signature terracotta brick (`#B83E26`, hover `#9E321E`, light wash `#FAF2F0`).
- **Typography**: Clean `Plus Jakarta Sans`, unboxed metadata separated by `·`, tabular numerals, and no static pill badge clutter.
- **Course Modals & Cards**: Preserves existing course card interactions, syllabus inspection modal, and local shortlist planning.

### Curated Explore Tab (8 Universal Shelves)
1. **Career & Industry Foundations**: Strategic management, corporate finance, venture creation, operations.
2. **Technology & Data Literacy**: Computing for inquirers, data visualization, AI principles, HCI.
3. **GER — Humanities & Languages**: History, philosophy, languages (Sanskrit, Urdu, German, Persian), ethics.
4. **GER — Social Sciences & Policy**: Economics, urban sociology, geopolitics, psychology of well-being.
5. **GER — Mathematical & Physical Sciences**: Calculus, linear algebra, statistics, mechanics, thermodynamics.
6. **GER — Biological & Life Sciences**: Concepts of biology, neurobiology, ecology, physiology.
7. **GER — Performing & Visual Arts**: Studio art, photography, theatre, Hindustani music, scenic design.
8. **Balanced & High-Flexibility Electives**: 1.5–3.0 credit courses ideal for balancing a heavy semester workload.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full In-Memory Dataset Processing**
  - *Chosen Approach*: Convert the attached CSV datasets (`Course_Master_Bundle.csv`, `Semester_Offerings_Winter_2027.csv`, `Major_Master_2024Plus_Bundle.csv`, `Major_Master_Pre2024_Bundle.csv`) into structured, strongly typed TypeScript data tables loaded directly in the client bundle.
  - *Why*: Zero network latency, instant dependent dropdown filtering, and offline-capable student matching without server round-trips.
- **Decision 2: Strict Exclusion of Core Courses**
  - *Chosen Approach*: For any student context, build a strict set of excluded course codes (`SCHOOL_CORE`, `PROGRAMME_CORE`, `MAJOR_CORE`, `PROGRAMME_AND_MAJOR_CORE`, `ENGINEERING_FOUNDATION_CORE`).
  - *Why*: As mandated, students must never be recommended core courses as electives.
- **Decision 3: Transparent Heuristic Scoring**
  - *Chosen Approach*: Fit percentage computed from available structured metadata (school offering, level, credits, course code prefix, category affinity, workload fit, and adaptive question weights). Clear disclosure note indicating heuristic matching.
  - *Why*: Avoids hallucinating unprovided course descriptions, prerequisites, or popularity stats while providing relevant rankings.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Course Compass Client                           │
├────────────────────────────────────────────────────────────────────────┤
│  Data Layer:                                                           │
│  - courseMasterData.ts (400+ courses, credits, schools, levels)        │
│  - winter2027Offerings.ts (203 available Winter 2027 codes)            │
│  - curriculumBundles.ts (2024+ & Pre-2024 programme/major core/pools) │
├────────────────────────────────────────────────────────────────────────┤
│  Logic & Engine:                                                       │
│  - eligibilityFilter.ts (excludes Cores, filters by Winter 2027)       │
│  - adaptiveQuestionEngine.ts (selects 5-6 targeted questions)          │
│  - rankingMatcher.ts (scores eligible courses by objective & answers)  │
├────────────────────────────────────────────────────────────────────────┤
│  UI Views & Components:                                                │
│  - App.tsx (tab orchestrator: Matcher, Explore, Shortlist)             │
│  - StepperJourney.tsx (Steps 1, 2, 3, 4 with adaptive steps)           │
│  - RecommendationsView.tsx (Top 3-5 Featured + Secondary 6-15)         │
│  - ExploreView.tsx (8 Curated Universal Shelves + Search & Filter)     │
│  - CourseModal.tsx (Detailed view with Winter 2027 verification)       │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Pipeline Details
- **Year Mapping**:
  - `2024, 2025, 2026` -> Sourced from `Major_Master_2024Plus_Bundle.csv`.
  - `2022, 2023` -> Sourced from `Major_Master_Pre2024_Bundle.csv`.
- **Eligibility Validation**:
  - `isWinter2027Available(code)`: Must exist in `Semester_Offerings_Winter_2027.csv`.
  - `isCoreCourse(code, studentContext)`: Excluded if tagged as core for the programme/major.
  - `isMajorElective(code, studentContext)`: Must be in the student's explicit `MAJOR_ELECTIVE` pool.
  - `isFreeElective(code, studentContext)`: Must NOT be in any core or major elective pool for the student.
  - `isGER(code, category)`: Filtered by GER domain code mappings (Humanities, Social Sciences, Math/Physical, Bio, Arts).
