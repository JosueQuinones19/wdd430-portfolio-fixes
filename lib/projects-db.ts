import { sql } from '@vercel/postgres';

export interface Project {
  id: number;
  title: string;
  description: string;
  type?: string;
  technologies: string[] | string;
  [key: string]: unknown;
}

export const PROJECTS_PER_PAGE = 6;

export function sanitizeSearchQuery(rawQuery?: string): string {
  if (!rawQuery) return '';
  return rawQuery.replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, 100);
}

export function sanitizePageNumber(rawPage?: string): number {
  const parsed = Number(rawPage);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return 1;
  }
  return parsed;
}

export async function getProjects(type?: string | null): Promise<Project[]> {
  if (type && type.trim() !== '') {
    const cleanType = type.trim();
    const { rows } = await sql<Project>`
      SELECT *
      FROM projects
      WHERE type = ${cleanType}
      ORDER BY id ASC
    `;
    return rows;
  }

  const { rows } = await sql<Project>`
    SELECT *
    FROM projects
    ORDER BY id ASC
  `;
  return rows;
}

export async function getProjectById(id: number): Promise<Project | null> {
  if (!Number.isInteger(id) || id < 1) {
    return null;
  }

  const { rows } = await sql<Project>`
    SELECT *
    FROM projects
    WHERE id = ${id}
    LIMIT 1
  `;

  return rows[0] ?? null;
}

export async function fetchFilteredProjects(
  rawQuery?: string,
  rawPage?: string,
  itemsPerPage: number = PROJECTS_PER_PAGE
): Promise<Project[]> {
  const query = sanitizeSearchQuery(rawQuery);
  const currentPage = sanitizePageNumber(rawPage);
  const offset = (currentPage - 1) * itemsPerPage;
  const pattern = `%${query}%`;

  const { rows } = await sql<Project>`
    SELECT *
    FROM projects
    WHERE
      ${query === ''}
      OR title ILIKE ${pattern}
      OR description ILIKE ${pattern}
    ORDER BY id ASC
    LIMIT ${itemsPerPage}
    OFFSET ${offset}
  `;

  return rows;
}

export async function fetchProjectsPages(
  rawQuery?: string,
  itemsPerPage: number = PROJECTS_PER_PAGE
): Promise<number> {
  const query = sanitizeSearchQuery(rawQuery);
  const pattern = `%${query}%`;

  const { rows } = await sql<{ count: string }>`
    SELECT COUNT(*)::text AS count
    FROM projects
    WHERE
      ${query === ''}
      OR title ILIKE ${pattern}
      OR description ILIKE ${pattern}
  `;

  const totalItems = Number(rows[0]?.count ?? 0);
  return Math.max(1, Math.ceil(totalItems / itemsPerPage));
}