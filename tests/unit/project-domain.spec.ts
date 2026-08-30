import { expect, test } from '@playwright/test';
import { createActionPlan, isSavedFilter, isSavedMaxHours, isSavedPlan, isSavedProjects, isSavedQuery, PROJECTS, searchProjects } from '../../app/projectData';

test.describe('project domain rules', () => {
  test('exposes four stable neighbourhood projects', () => {
    expect(PROJECTS.map((project) => project.id)).toEqual(['orchard', 'repair', 'pantry', 'walk']);
  });

  for (const [query, expectedId] of [['garden', 'orchard'], ['mend', 'repair'], ['food', 'pantry'], ['safety', 'walk']] as const) {
    test(`matches “${query}” to ${expectedId}`, () => {
      expect(searchProjects(query).map((project) => project.id)).toContain(expectedId);
    });
  }

  test('matches any meaningful term in a natural-language query', () => {
    expect(searchProjects('food outdoors').map((project) => project.id)).toEqual(['orchard', 'pantry']);
  });

  test('combines category and maximum-hours constraints', () => {
    expect(searchProjects('', 'Food', 1).map((project) => project.id)).toEqual(['pantry']);
    expect(searchProjects('', 'Outdoors', 1)).toEqual([]);
  });

  test('builds plans in catalog order and ignores duplicates or unknown IDs', () => {
    const result = createActionPlan(['pantry', 'missing', 'orchard', 'pantry']);
    expect(result.projectIds).toEqual(['orchard', 'pantry']);
    expect(result.totalHours).toBe(3);
  });

  test('accepts only supported saved filters', () => {
    expect(isSavedFilter('Community')).toBe(true);
    expect(isSavedFilter('Everything')).toBe(false);
  });

  test('bounds persisted searches', () => {
    expect(isSavedQuery('garden')).toBe(true);
    expect(isSavedQuery('x'.repeat(301))).toBe(false);
    expect(isSavedQuery(42)).toBe(false);
  });

  test('validates persisted per-project time limits', () => {
    for (const value of [1, 1.5, 8]) expect(isSavedMaxHours(value)).toBe(true);
    for (const value of [0, 9, NaN, Infinity, -Infinity, null, '1']) expect(isSavedMaxHours(value)).toBe(false);
  });

  test('accepts only arrays of known project IDs as saved plans', () => {
    expect(isSavedPlan(['orchard', 'repair'])).toBe(true);
    expect(isSavedPlan(['orchard', 'unknown'])).toBe(false);
    expect(isSavedPlan(['community-riverside-walk-abc123'])).toBe(true);
    expect(isSavedPlan('orchard')).toBe(false);
  });

  test('validates human-approved community projects before restoration', () => {
    const proposal = {
      id: 'community-riverside-walk-abc123', title: 'Riverside walk', area: 'Harbourview',
      type: 'Community', time: 2, people: 0, color: 'violet', keywords: 'river litter',
      desc: 'Walk the riverside path and collect litter before it reaches the harbour.', communityCreated: true,
    };
    expect(isSavedProjects([proposal])).toBe(true);
    expect(isSavedProjects([{ ...proposal, time: 99 }])).toBe(false);
    expect(isSavedProjects([{ ...proposal, communityCreated: false }])).toBe(false);
  });
});
