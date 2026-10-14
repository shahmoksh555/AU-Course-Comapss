import { CuratedShelf } from '../types';
import { COURSE_BY_CODE } from './rawDatasets';

function getCoursesByCodes(codes: string[]) {
  return codes
    .map((code) => COURSE_BY_CODE.get(code))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);
}

export const CURATED_SHELVES: CuratedShelf[] = [
  {
    id: 'career_foundations',
    title: 'Career & Industry Foundations',
    description: 'High-value management, corporate finance, venture creation, and operations courses built for professional readiness in the corporate and entrepreneurial world.',
    courses: getCoursesByCodes([
      'MGT342', 'MGT323', 'FAC331', 'FBE101', 'MKT341', 'TOD221', 'TOD326', 'FAC133'
    ]),
  },
  {
    id: 'tech_data',
    title: 'Technology & Data Literacy',
    description: 'Foundational computing, cybersecurity, user experience, and applied business analytics accessible across non-engineering and engineering majors alike.',
    courses: getCoursesByCodes([
      'CSE103', 'CSE212', 'DGT101', 'TOD310', 'CSC201', 'CSE408', 'DES202', 'STA101'
    ]),
  },
  {
    id: 'ger_humanities',
    title: 'General Education: Humanities & Languages',
    description: 'Deep inquiry into Indian and global histories, philosophical ethics, literary traditions, and classical languages satisfying broad inquiry requirements.',
    courses: getCoursesByCodes([
      'HST103', 'HST205', 'HST315', 'LIT210', 'LIT220', 'PHI120', 'GER112', 'SAN102'
    ]),
  },
  {
    id: 'ger_social_sciences',
    title: 'General Education: Social Sciences & Policy',
    description: 'Explore the dynamics of human behavior, economic policy choices, urban social inequalities, and psychological resilience.',
    courses: getCoursesByCodes([
      'ECO100', 'ECO110', 'ECO292', 'SPS203', 'SPS260', 'SPS354', 'PSY220', 'PSY350'
    ]),
  },
  {
    id: 'ger_math_physical',
    title: 'General Education: Mathematical & Physical Sciences',
    description: 'Strengthen quantitative reasoning, mathematical modeling, probability, and foundational physical laws of mechanics and thermodynamics.',
    courses: getCoursesByCodes([
      'MAT142', 'MAT215', 'MAT248', 'MAT305', 'PHY111', 'PHY212', 'STA102', 'PHY313'
    ]),
  },
  {
    id: 'ger_biological',
    title: 'General Education: Biological & Life Sciences',
    description: 'Examine living systems, neurobiology, brain function, environmental sustainability, and cellular mechanisms without needing high school biology.',
    courses: getCoursesByCodes([
      'BIO107', 'BIO114', 'BIO177', 'BIO200', 'BIO250', 'BIO311', 'BIO330', 'ENV103'
    ]),
  },
  {
    id: 'ger_arts',
    title: 'General Education: Performing & Visual Arts',
    description: 'Hands-on creative practice across studio painting, street theatre, photography, classical Hindustani music, and visual communication.',
    courses: getCoursesByCodes([
      'PVA101', 'PVA112', 'PVA130', 'PVA171', 'PVA228', 'MUS101', 'MUS103', 'DES102'
    ]),
  },
  {
    id: 'balanced_electives',
    title: 'Balanced & High-Flexibility Electives',
    description: 'Curated 1.0–2.0 credit courses with manageable pacing designed to round out your schedule without adding intense midterm exam stress.',
    courses: getCoursesByCodes([
      'DGT101', 'FAC124', 'MGT136', 'MGT208', 'MGT341', 'FBE101', 'SPS267', 'ENR306'
    ]),
  },
];
