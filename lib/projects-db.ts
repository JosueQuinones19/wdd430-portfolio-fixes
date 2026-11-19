import { sql } from '@vercel/postgres';

export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  type?: string;
  [key: string]: unknown;
}

export const PROJECTS_PER_PAGE = 6;

function normalizeTechnologies(rawTech: unknown): string[] {
  if (Array.isArray(rawTech)) {
    return rawTech
      .map((item) => String(item).trim())
      .filter((item) => item.length > 0);
  }

  if (typeof rawTech === 'string') {
    const trimmed = rawTech.trim();
    if (!trimmed) return [];

    try {
      const parsed: unknown = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => String(item).trim())
          .filter((item) => item.length > 0);
      }
    } catch {
      // Not a JSON array; treat as comma-separated list
    }

    return trimmed
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return [];
}

function normalizeProjectRow(row: Record<string, unknown>): Project {
  const normalized: Project = {
    ...row,
    id: Number(row.id ?? 0),
    title: String(row.title ?? ''),
    description: String(row.description ?? ''),
    technologies: normalizeTechnologies(row.technologies),
  };

  if (typeof row.link === 'string') {
    normalized.link = row.link;
  }

  if (typeof row.type === 'string') {
    normalized.type = row.type;
  }

  return normalized;
}

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
    const { rows } = await sql`
      SELECT *
      FROM projects
      WHERE type = ${cleanType}
      ORDER BY id ASC
    `;
    return rows.map((row) => normalizeProjectRow(row as Record<string, unknown>));
  }

  const { rows } = await sql`
    SELECT *
    FROM projects
    ORDER BY id ASC
  `;
  return rows.map((row) => normalizeProjectRow(row as Record<string, unknown>));
}

export async function getProjectById(id: number): Promise<Project | null> {
  if (!Number.isInteger(id) || id < 1) {
    return null;
  }

  const { rows } = await sql`
    SELECT *
    FROM projects
    WHERE id = ${id}
    LIMIT 1
  `;

  if (!rows[0]) {
    return null;
  }

  return normalizeProjectRow(rows[0] as Record<string, unknown>);
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

  const { rows } = await sql`
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

  return rows.map((row) => normalizeProjectRow(row as Record<string, unknown>));
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