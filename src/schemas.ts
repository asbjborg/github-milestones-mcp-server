import { z } from 'zod';

/**
 * Input schemas for GitHub Milestones MCP tools
 * Using Zod for runtime validation and type safety
 */

// Base repository schema
const repositorySchema = z.object({
  owner: z.string().describe('Repository owner (username or organization)'),
  repo: z.string().describe('Repository name'),
});

// Milestone state enum
const milestoneStateSchema = z.enum(['open', 'closed', 'all']).default('open');

// Milestone sort options
const milestoneSortSchema = z.enum(['due_on', 'completeness']).default('due_on');

// Milestone direction
const milestoneDirectionSchema = z.enum(['asc', 'desc']).default('asc');

// List milestones schema
export const listMilestonesSchema = z.object({
  ...repositorySchema.shape,
  state: milestoneStateSchema.optional().describe('Filter by milestone state'),
  sort: milestoneSortSchema.optional().describe('Sort milestones by'),
  direction: milestoneDirectionSchema.optional().describe('Sort direction'),
  per_page: z.number().min(1).max(100).default(30).optional().describe('Results per page'),
  page: z.number().min(1).default(1).optional().describe('Page number'),
});

// Get milestone schema
export const getMilestoneSchema = z.object({
  ...repositorySchema.shape,
  milestone_number: z.number().positive().describe('Milestone number'),
});

// Create milestone schema
export const createMilestoneSchema = z.object({
  ...repositorySchema.shape,
  title: z.string().min(1).describe('Milestone title'),
  description: z.string().optional().describe('Milestone description'),
  due_on: z.string().datetime().optional().describe('Due date (ISO 8601 format)'),
  state: z.enum(['open', 'closed']).default('open').optional().describe('Milestone state'),
});

// Update milestone schema
export const updateMilestoneSchema = z.object({
  ...repositorySchema.shape,
  milestone_number: z.number().positive().describe('Milestone number to update'),
  title: z.string().min(1).optional().describe('New milestone title'),
  description: z.string().optional().describe('New milestone description'),
  due_on: z.string().datetime().optional().describe('New due date (ISO 8601 format)'),
  state: z.enum(['open', 'closed']).optional().describe('New milestone state'),
});

// Delete milestone schema
export const deleteMilestoneSchema = z.object({
  ...repositorySchema.shape,
  milestone_number: z.number().positive().describe('Milestone number to delete'),
});

// Export types for use in the GitHub client
export type ListMilestonesParams = z.infer<typeof listMilestonesSchema>;
export type GetMilestoneParams = z.infer<typeof getMilestoneSchema>;
export type CreateMilestoneParams = z.infer<typeof createMilestoneSchema>;
export type UpdateMilestoneParams = z.infer<typeof updateMilestoneSchema>;
export type DeleteMilestoneParams = z.infer<typeof deleteMilestoneSchema>; 