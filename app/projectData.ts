export type ProjectCategory = 'Outdoors' | 'Skills' | 'Food' | 'Community';
export type ProjectColor = 'lime' | 'blue' | 'coral' | 'violet';

export interface Project {
  id: string;
  title: string;
  area: string;
  type: ProjectCategory;
  time: number;
  people: number;
  color: ProjectColor;
  keywords: string;
  desc: string;
  communityCreated?: boolean;
}

export const PROJECTS: Project[] = [
  { id: 'orchard', title: 'Revive the schoolyard orchard', area: 'North End', type: 'Outdoors', time: 2, people: 8, color: 'lime', keywords: 'garden gardening plants trees kids school nature grow', desc: 'Prune six trees, rebuild two beds, and make the harvest easier for students to share.' },
  { id: 'repair', title: 'Sunday repair table', area: 'Harbourview', type: 'Skills', time: 1, people: 4, color: 'blue', keywords: 'fix fixing mend clothes electronics reuse recycle maker', desc: 'Help neighbours mend lamps, patch clothes, and keep useful things out of landfill.' },
  { id: 'pantry', title: 'Restock the little pantry', area: 'West Commons', type: 'Food', time: 1, people: 12, color: 'coral', keywords: 'donate donation hunger groceries supplies meals food bank', desc: 'Coordinate a low-waste pantry refill with shelf-stable food and hygiene basics.' },
  { id: 'walk', title: 'Map a safer night walk', area: 'North End', type: 'Community', time: 2, people: 6, color: 'violet', keywords: 'safety accessibility lights walking streets map neighborhood community', desc: 'Walk the route together and log lighting, crossings, and accessibility gaps.' },
];

export const FILTERS = ['All', 'Outdoors', 'Skills', 'Food', 'Community'] as const;
export type ProjectFilter = (typeof FILTERS)[number];

const PROJECT_IDS = new Set(PROJECTS.map((project) => project.id));

export function searchProjects(query = '', filter: ProjectFilter = 'All', maxHours = Infinity, catalog: readonly Project[] = PROJECTS) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return catalog.filter((project) => {
    const searchable = `${project.title} ${project.area} ${project.type} ${project.keywords} ${project.desc}`.toLowerCase();
    return (filter === 'All' || project.type === filter)
      && project.time <= maxHours
      && (!terms.length || terms.some((term) => searchable.includes(term)));
  });
}

export function createActionPlan(projectIds: readonly unknown[], catalog: readonly Project[] = PROJECTS) {
  const plan = catalog.filter((project) => projectIds.includes(project.id));
  return {
    plan,
    projectIds: plan.map((project) => project.id),
    totalHours: plan.reduce((sum, project) => sum + project.time, 0),
  };
}

export const isSavedFilter = (value: unknown): value is ProjectFilter =>
  typeof value === 'string' && FILTERS.includes(value as ProjectFilter);

export const isSavedQuery = (value: unknown): value is string =>
  typeof value === 'string' && value.length <= 300;

export const isSavedMaxHours = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 1 && value <= 8;

export const isSavedPlan = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((id) => typeof id === 'string' && (PROJECT_IDS.has(id) || /^community-[a-z0-9-]+$/.test(id)));

export const isSavedProjects = (value: unknown): value is Project[] =>
  Array.isArray(value) && value.every((project) => {
    if (!project || typeof project !== 'object') return false;
    const item = project as Partial<Project>;
    return typeof item.id === 'string'
      && /^community-[a-z0-9-]+$/.test(item.id)
      && typeof item.title === 'string' && item.title.length > 0 && item.title.length <= 100
      && typeof item.area === 'string' && item.area.length > 0 && item.area.length <= 80
      && typeof item.desc === 'string' && item.desc.length > 0 && item.desc.length <= 300
      && typeof item.keywords === 'string'
      && typeof item.time === 'number' && item.time >= 1 && item.time <= 8
      && typeof item.people === 'number' && item.people >= 0
      && ['Outdoors', 'Skills', 'Food', 'Community'].includes(item.type ?? '')
      && ['lime', 'blue', 'coral', 'violet'].includes(item.color ?? '')
      && item.communityCreated === true;
  });
