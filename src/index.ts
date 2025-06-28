#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { GitHubMilestonesClient } from './github-client.js';
import { 
  listMilestonesSchema,
  createMilestoneSchema,
  updateMilestoneSchema,
  deleteMilestoneSchema,
  getMilestoneSchema
} from './schemas.js';

/**
 * GitHub Milestones MCP Server
 * 
 * Provides milestone management capabilities for GitHub repositories
 * through the Model Context Protocol (MCP).
 * 
 * Created by Claude AI Assistant as a standalone solution for
 * GitHub milestone operations missing from the official GitHub MCP server.
 */

const server = new Server(
  {
    name: 'github-milestones-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// Initialize GitHub client
const githubClient = new GitHubMilestonesClient();

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_milestones',
        description: 'List milestones for a GitHub repository',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string', description: 'Repository owner (username or organization)' },
            repo: { type: 'string', description: 'Repository name' },
            state: { type: 'string', enum: ['open', 'closed', 'all'], description: 'Filter by milestone state', default: 'open' },
            sort: { type: 'string', enum: ['due_on', 'completeness'], description: 'Sort milestones by', default: 'due_on' },
            direction: { type: 'string', enum: ['asc', 'desc'], description: 'Sort direction', default: 'asc' },
            per_page: { type: 'number', minimum: 1, maximum: 100, description: 'Results per page', default: 30 },
            page: { type: 'number', minimum: 1, description: 'Page number', default: 1 }
          },
          required: ['owner', 'repo'],
          additionalProperties: false
        },
      },
      {
        name: 'get_milestone',
        description: 'Get details of a specific milestone',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string', description: 'Repository owner (username or organization)' },
            repo: { type: 'string', description: 'Repository name' },
            milestone_number: { type: 'number', minimum: 1, description: 'Milestone number' }
          },
          required: ['owner', 'repo', 'milestone_number'],
          additionalProperties: false
        },
      },
      {
        name: 'create_milestone',
        description: 'Create a new milestone in a GitHub repository',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string', description: 'Repository owner (username or organization)' },
            repo: { type: 'string', description: 'Repository name' },
            title: { type: 'string', minLength: 1, description: 'Milestone title' },
            description: { type: 'string', description: 'Milestone description' },
            due_on: { type: 'string', format: 'date-time', description: 'Due date (ISO 8601 format)' },
            state: { type: 'string', enum: ['open', 'closed'], description: 'Milestone state', default: 'open' }
          },
          required: ['owner', 'repo', 'title'],
          additionalProperties: false
        },
      },
      {
        name: 'update_milestone',
        description: 'Update an existing milestone',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string', description: 'Repository owner (username or organization)' },
            repo: { type: 'string', description: 'Repository name' },
            milestone_number: { type: 'number', minimum: 1, description: 'Milestone number to update' },
            title: { type: 'string', minLength: 1, description: 'New milestone title' },
            description: { type: 'string', description: 'New milestone description' },
            due_on: { type: 'string', format: 'date-time', description: 'New due date (ISO 8601 format)' },
            state: { type: 'string', enum: ['open', 'closed'], description: 'New milestone state' }
          },
          required: ['owner', 'repo', 'milestone_number'],
          additionalProperties: false
        },
      },
      {
        name: 'delete_milestone',
        description: 'Delete a milestone from a repository',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string', description: 'Repository owner (username or organization)' },
            repo: { type: 'string', description: 'Repository name' },
            milestone_number: { type: 'number', minimum: 1, description: 'Milestone number to delete' }
          },
          required: ['owner', 'repo', 'milestone_number'],
          additionalProperties: false
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!args) {
    throw new Error('Missing required arguments');
  }

  try {
    switch (name) {
      case 'list_milestones':
        return await githubClient.listMilestones(args as any);
      
      case 'get_milestone':
        return await githubClient.getMilestone(args as any);
      
      case 'create_milestone':
        return await githubClient.createMilestone(args as any);
      
      case 'update_milestone':
        return await githubClient.updateMilestone(args as any);
      
      case 'delete_milestone':
        return await githubClient.deleteMilestone(args as any);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    throw new Error(`Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('GitHub Milestones MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server failed to start:', error);
  process.exit(1);
}); 