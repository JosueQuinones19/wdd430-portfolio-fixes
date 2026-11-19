import { sql } from '@vercel/postgres';

export interface Project {
  id: number;
  title: string;
  description: string;
  type?: string;
  [key: string]: unknown;
}

export const PROJECTS_PER_PAGE = 6; // Adjust page size as needed

export function sanitizeSearchQuery(rawQuery?: string): string {
  if (!rawQuery) return '';
  // Trim, cap length, and strip control/null characters
  return rawQuery.replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, 100);
}

export function sanitizePageNumber(rawPage?: string): number {
  const parsed = Number(rawPage);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return 1;
  }
  return parsed;
}

export async function getProjects(): Promise<Project[]> {
  const { rows } = await sql<Project>`
    SELECT *
    FROM projects
    ORDER BY id ASC
  `;
  return rows;
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