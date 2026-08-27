export const PROJECTS = [
  { id: 'orchard', title: 'Revive the schoolyard orchard', area: 'North End', type: 'Outdoors', time: 2, people: 8, color: 'lime', keywords: 'garden gardening plants trees kids school nature grow', desc: 'Prune six trees, rebuild two beds, and make the harvest easier for students to share.' },
  { id: 'repair', title: 'Sunday repair table', area: 'Harbourview', type: 'Skills', time: 1, people: 4, color: 'blue', keywords: 'fix fixing mend clothes electronics reuse recycle maker', desc: 'Help neighbours mend lamps, patch clothes, and keep useful things out of landfill.' },
  { id: 'pantry', title: 'Restock the little pantry', area: 'West Commons', type: 'Food', time: 1, people: 12, color: 'coral', keywords: 'donate donation hunger groceries supplies meals food bank', desc: 'Coordinate a low-waste pantry refill with shelf-stable food and hygiene basics.' },
  { id: 'walk', title: 'Map a safer night walk', area: 'North End', type: 'Community', time: 2, people: 6, color: 'violet', keywords: 'safety accessibility lights walking streets map neighborhood community', desc: 'Walk the route together and log lighting, crossings, and accessibility gaps.' },
] as const;

export const FILTERS = ['All', 'Outdoors', 'Skills', 'Food', 'Community'] as const;
export type ProjectFilter = (typeof FILTERS)[number];

const PROJECT_IDS = new Set(PROJECTS.map((project) => project.id));

export function searchProjects(query = '', filter: ProjectFilter = 'All', maxHours = Infinity) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return PROJECTS.filter((project) => {
    const searchable = `${project.title} ${project.area} ${project.type} ${project.keywords} ${project.desc}`.toLowerCase();
    return (filter === 'All' || project.type === filter)
      && project.time <= maxHours
      && (!terms.length || terms.some((term) => searchable.includes(term)));
  });
}

export function createActionPlan(projectIds: readonly unknown[]) {
  const plan = PROJECTS.filter((project) => projectIds.includes(project.id));
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

export const isSavedPlan = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((id) => typeof id === 'string' && PROJECT_IDS.has(id as (typeof PROJECTS)[number]['id']));
