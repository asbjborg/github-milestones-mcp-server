import { Octokit } from '@octokit/rest';
import {
  ListMilestonesParams,
  GetMilestoneParams,
  CreateMilestoneParams,
  UpdateMilestoneParams,
  DeleteMilestoneParams,
} from './schemas.js';

/**
 * GitHub Milestones API Client
 * 
 * Handles all interactions with GitHub's Milestones API
 * Uses Octokit for robust API communication
 */
export class GitHubMilestonesClient {
  private octokit: Octokit;

  constructor() {
    const token = process.env.GITHUB_TOKEN || process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
    
    if (!token) {
      throw new Error(
        'GitHub token is required. Set GITHUB_TOKEN or GITHUB_PERSONAL_ACCESS_TOKEN environment variable.'
      );
    }

    this.octokit = new Octokit({
      auth: token,
      userAgent: 'github-milestones-mcp-server/1.0.0',
    });
  }

  /**
   * List milestones for a repository
   */
  async listMilestones(params: ListMilestonesParams) {
    try {
      const response = await this.octokit.rest.issues.listMilestones({
        owner: params.owner,
        repo: params.repo,
        state: params.state || 'open',
        sort: params.sort || 'due_on',
        direction: params.direction || 'asc',
        per_page: params.per_page || 30,
        page: params.page || 1,
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to list milestones: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get details of a specific milestone
   */
  async getMilestone(params: GetMilestoneParams) {
    try {
      const response = await this.octokit.rest.issues.getMilestone({
        owner: params.owner,
        repo: params.repo,
        milestone_number: params.milestone_number,
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get milestone: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new milestone
   */
  async createMilestone(params: CreateMilestoneParams) {
    try {
      const createData: any = {
        owner: params.owner,
        repo: params.repo,
        title: params.title,
      };

      // Add optional parameters if provided
      if (params.description !== undefined) {
        createData.description = params.description;
      }
      if (params.due_on !== undefined) {
        createData.due_on = params.due_on;
      }
      if (params.state !== undefined) {
        createData.state = params.state;
      }

      const response = await this.octokit.rest.issues.createMilestone(createData);

      return {
        content: [
          {
            type: 'text' as const,
            text: `Successfully created milestone "${params.title}". Details:\n${JSON.stringify(response.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to create milestone: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update an existing milestone
   */
  async updateMilestone(params: UpdateMilestoneParams) {
    try {
      const updateData: any = {
        owner: params.owner,
        repo: params.repo,
        milestone_number: params.milestone_number,
      };

      // Add optional parameters if provided
      if (params.title !== undefined) {
        updateData.title = params.title;
      }
      if (params.description !== undefined) {
        updateData.description = params.description;
      }
      if (params.due_on !== undefined) {
        updateData.due_on = params.due_on;
      }
      if (params.state !== undefined) {
        updateData.state = params.state;
      }

      const response = await this.octokit.rest.issues.updateMilestone(updateData);

      return {
        content: [
          {
            type: 'text' as const,
            text: `Successfully updated milestone #${params.milestone_number}. Details:\n${JSON.stringify(response.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to update milestone: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a milestone
   */
  async deleteMilestone(params: DeleteMilestoneParams) {
    try {
      await this.octokit.rest.issues.deleteMilestone({
        owner: params.owner,
        repo: params.repo,
        milestone_number: params.milestone_number,
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: `Successfully deleted milestone #${params.milestone_number} from ${params.owner}/${params.repo}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to delete milestone: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 