/**
 * TypeScript type definitions for GitHub Milestones MCP Server
 */

// GitHub API Milestone type (from Octokit)
export interface GitHubMilestone {
  id: number;
  number: number;
  title: string;
  description: string | null;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  due_on: string | null;
  closed_at: string | null;
  creator: GitHubUser;
  open_issues: number;
  closed_issues: number;
  url: string;
  html_url: string;
  labels_url: string;
  node_id: string;
}

// GitHub User type
export interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  type: string;
  site_admin: boolean;
}

// MCP Tool Response type
export interface MCPToolResponse {
  content: Array<{
    type: 'text' | 'image' | 'resource';
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
}

// Error response type
export interface ErrorResponse {
  error: {
    message: string;
    code?: string;
    details?: any;
  };
}

// Environment configuration
export interface Environment {
  GITHUB_TOKEN?: string;
  GITHUB_PERSONAL_ACCESS_TOKEN?: string;
  NODE_ENV?: 'development' | 'production' | 'test';
} 