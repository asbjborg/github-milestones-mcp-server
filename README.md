# GitHub Milestones MCP Server

MCP server for GitHub Milestones API - filling the gap in the official GitHub MCP server

## 🎯 Project Purpose

The official [GitHub MCP Server](https://github.com/github/github-mcp-server) provides excellent tools for issues, pull requests, and files, but **completely lacks milestone support**. This standalone MCP server fills that gap by providing full milestone management capabilities through the Model Context Protocol (MCP).

### Why This Exists

**The Problem**:

- GitHub's official MCP server omits milestone endpoints
- No clean way to manage project milestones through Cursor/MCP

**The Solution**:

- Dedicated MCP server focused solely on GitHub Milestones API
- Proper milestone semantics (due dates, progress tracking, etc.)
- Composable with the existing GitHub MCP server
- Clean separation of concerns

## 🚀 Features

### Core Milestone Operations

- ✅ **List Milestones** - Get all milestones for a repository
- ✅ **Get Milestone** - Fetch specific milestone details
- ✅ **Create Milestone** - Create new milestones with due dates
- ✅ **Update Milestone** - Modify existing milestones
- ✅ **Delete Milestone** - Remove milestones

### MCP Integration

- ✅ **Full MCP Protocol Support** - Works with any MCP-compatible client
- ✅ **Type-Safe Schemas** - Zod validation for all inputs
- ✅ **Proper Error Handling** - Meaningful error messages
- ✅ **Composable Design** - Works alongside other MCP servers

## 🏗️ Architecture

### Project Structure

```text
src/
├── index.ts          # Main MCP server entry point
├── github-client.ts  # GitHub API client (Octokit wrapper)
├── schemas.ts        # Zod schemas for input validation
└── types.ts          # TypeScript type definitions (to be created)

Docker/
├── Dockerfile        # Multi-stage build for optimized production image
├── docker-compose.yml # Container orchestration
└── .dockerignore     # Build context optimization
```

### Key Design Decisions

1. **Multi-stage Docker Build** - Optimized production image with minimal attack surface
2. **Octokit for API Access** - Robust, well-maintained GitHub API client
3. **Zod for Validation** - Runtime type safety and clear error messages
4. **MCP SDK** - Official Model Context Protocol implementation
5. **TypeScript** - Type safety and better developer experience
6. **ESM Modules** - Modern JavaScript module system
7. **Security-first Containerization** - Non-root user, minimal dependencies in production

## 🛠️ Implementation Roadmap

### Phase 1: Core Functionality ✅

- [x] Basic project structure
- [x] MCP server setup with proper tool registration
- [x] GitHub client with authentication
- [x] All 5 milestone operations (CRUD + list)
- [x] Input validation with Zod schemas

### Phase 2: Enhanced Features (Next Steps)

- [ ] Add milestone progress calculations
- [ ] Support for milestone descriptions with markdown
- [ ] Bulk operations (e.g., close multiple milestones)
- [ ] Integration with GitHub Projects API
- [ ] Better error responses with actionable suggestions

### Phase 3: Production Ready

- [x] **Multi-stage Docker build** - Optimized production images
- [x] **Security hardening** - Non-root container user, minimal attack surface
- [ ] Comprehensive error handling and retry logic
- [ ] Logging and observability
- [ ] Performance optimizations (caching, rate limiting)
- [ ] Documentation and examples

## 🐳 Docker Optimizations

This project uses a **multi-stage Docker build** for production-ready containerization:

### Build Stages

1. **Builder Stage** (`node:18-alpine AS builder`)
   - Installs all dependencies (including dev dependencies)
   - Compiles TypeScript to JavaScript
   - Prepares the application for production

2. **Production Stage** (`node:18-alpine AS production`)
   - Installs only production dependencies (`--omit=dev`)
   - Copies built application from builder stage
   - Creates non-root user for security
   - Results in minimal, secure final image

### Benefits

- **Smaller Image Size** - Production stage excludes dev dependencies and source code
- **Enhanced Security** - Non-root user execution, minimal attack surface
- **Faster Deployments** - Optimized layers and reduced image size
- **Build Consistency** - Reproducible builds across environments

> 💡 **Having Docker/MCP setup issues?** See our [troubleshooting guide](https://asbjborg.github.io/posts/how-to-actually-setup-github-mcp-server-with-docker-in-cursor/) for solutions to common environment variable problems.

## 🔧 Development Setup

### Prerequisites

- Node.js 18+ OR Docker
- GitHub Personal Access Token with `repo` scope
- TypeScript knowledge (for development)

### Option 1: Docker Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/asbjborg/github-milestones-mcp-server.git
cd github-milestones-mcp-server

# Set up environment
export GITHUB_TOKEN="your_github_token_here"

# Build with optimized multi-stage Docker build
npm run docker:build

# Run the containerized server
npm run docker:run

# Or use docker-compose for easier management
docker-compose up -d
```

### Option 2: Local Node.js Setup

```bash
# Clone the repository
git clone https://github.com/asbjborg/github-milestones-mcp-server.git
cd github-milestones-mcp-server

# Install dependencies
npm install

# Set up environment
export GITHUB_TOKEN="your_github_token_here"
# or
export GITHUB_PERSONAL_ACCESS_TOKEN="your_github_token_here"

# Build the project
npm run build

# Run in development mode
npm run dev
```

### Testing the Server

```bash
# Docker
npm run docker:run

# Local Node.js
npm run start

# The server runs on stdio - test with MCP client tools
# or integrate with Cursor MCP configuration
```

## 📋 MCP Configuration

### Docker Setup (Recommended)

Add to your `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "github-milestones": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "--init",
        "--stop-timeout=5",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "github-milestones-mcp-server:latest"
      ]
    }
  }
}
```

**Docker Args Explained:**

- `--init` - Ensures proper signal handling and zombie process reaping
- `--stop-timeout=5` - Sets 5-second timeout for graceful container shutdown
- `-e GITHUB_PERSONAL_ACCESS_TOKEN` - Passes your GitHub token from environment

### 🚨 Troubleshooting MCP Docker Setup

**Having issues with "authorization denied" or Docker environment variables?**

The official Cursor/GitHub MCP documentation has known issues with Docker environment variable handling. The problem is mixing Cursor's MCP `env` section (JSON) with Docker's `-e` flags, causing shell substitution like `${GITHUB_TOKEN}` to become literal strings instead of resolving to actual token values.

**Key insight:** Use `-e VARNAME` (without values) to pass environment variables from your host, avoiding JSON substitution issues entirely.

📖 **For detailed troubleshooting and step-by-step fixes, see:**  
[How to Actually Setup GitHub MCP Server with Docker in Cursor (The Working Guide)](https://asbjborg.github.io/posts/how-to-actually-setup-github-mcp-server-with-docker-in-cursor/)

### Local Node.js Setup

```json
{
  "mcpServers": {
    "github-milestones": {
      "command": "node",
      "args": ["/path/to/github-milestones-mcp-server/dist/index.js"],
      "env": {
        "GITHUB_TOKEN": "your_token_here"
      }
    }
  }
}
```

## 🔌 Usage Examples

### With Cursor Agent

Once configured, you can ask Cursor:

- *"List all open milestones in this repository"*
- *"Create a milestone for Q1 2025 with due date March 31st"*
- *"Update milestone 5 to be closed"*
- *"Show me details of milestone 3"*

### Programmatic Usage

```typescript
// The server exposes these MCP tools:
await callTool('list_milestones', {
  owner: 'your-username',
  repo: 'your-project',
  state: 'open'
});

await callTool('create_milestone', {
  owner: 'your-username', 
  repo: 'your-project',
  title: 'Q1 2025 Release',
  description: 'First quarter feature release',
  due_on: '2025-03-31T23:59:59Z'
});
```

## 🤝 Integration Patterns

### With Existing GitHub MCP Server

This server is designed to complement, not replace, the official GitHub MCP server:

```json
{
  "mcpServers": {
    "github": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "--init",
        "--stop-timeout=5",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "-e",
        "GITHUB_TOOLSETS=issues,pull_requests,repos",
        "ghcr.io/github/github-mcp-server:latest"
      ]
    },
    "github-milestones": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "--init",
        "--stop-timeout=5",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "github-milestones-mcp-server:latest"
      ]
    }
  }
}
```

Now you have:

- **Full GitHub functionality** (issues, PRs, files) from the official server
- **Complete milestone management** from this dedicated server

## 📚 API Reference

### Tool: `list_milestones`

List milestones for a repository.

**Parameters:**

- `owner` (string, required) - Repository owner
- `repo` (string, required) - Repository name  
- `state` (enum, optional) - Filter by state: 'open', 'closed', 'all'
- `sort` (enum, optional) - Sort by: 'due_on', 'completeness'
- `direction` (enum, optional) - Sort direction: 'asc', 'desc'
- `per_page` (number, optional) - Results per page (1-100)
- `page` (number, optional) - Page number

### Tool: `get_milestone`

Get details of a specific milestone.

**Parameters:**

- `owner` (string, required) - Repository owner
- `repo` (string, required) - Repository name
- `milestone_number` (number, required) - Milestone number

### Tool: `create_milestone`

Create a new milestone.

**Parameters:**

- `owner` (string, required) - Repository owner
- `repo` (string, required) - Repository name
- `title` (string, required) - Milestone title
- `description` (string, optional) - Milestone description
- `due_on` (string, optional) - Due date (ISO 8601 format)
- `state` (enum, optional) - Initial state: 'open', 'closed'

### Tool: `update_milestone`

Update an existing milestone.

**Parameters:**

- `owner` (string, required) - Repository owner
- `repo` (string, required) - Repository name
- `milestone_number` (number, required) - Milestone to update
- `title` (string, optional) - New title
- `description` (string, optional) - New description
- `due_on` (string, optional) - New due date
- `state` (enum, optional) - New state

### Tool: `delete_milestone`

Delete a milestone.

**Parameters:**

- `owner` (string, required) - Repository owner
- `repo` (string, required) - Repository name
- `milestone_number` (number, required) - Milestone to delete

## 🔒 Security Considerations

- **GitHub Token** - Requires repo scope, store securely
- **Input Validation** - All inputs validated with Zod schemas
- **Error Handling** - No sensitive data leaked in error messages
- **Rate Limiting** - Inherits GitHub API rate limits (5000/hour)

## 🤝 Contributing

This project follows standard contribution practices:

1. **Issues** - Use GitHub issues for bug reports and feature requests
2. **Pull Requests** - Follow conventional commit format
3. **Code Style** - ESLint configuration provided
4. **Testing** - Add tests for new features

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

## 🙋‍♂️ Support

- **GitHub Issues** - Bug reports and feature requests
- **Documentation** - This README and inline code comments
- **Community** - Share improvements and use cases

---

## 🧠 AI Development Notes

This section is for AI assistants continuing development

### Current Implementation Status

- ✅ **MCP Server Framework** - Fully functional with proper tool registration
- ✅ **GitHub Integration** - Octokit client with authentication
- ✅ **All CRUD Operations** - Complete milestone management
- ✅ **Type Safety** - Zod schemas and TypeScript types

### Next Development Priorities

1. **Error Handling** - Improve error messages and recovery
2. **Testing** - Add unit and integration tests
3. **Performance** - Add caching and rate limit handling
4. **Documentation** - Add more usage examples

### Code Quality Guidelines

- Follow existing TypeScript patterns
- Maintain MCP protocol compliance
- Keep error messages user-friendly
- Use descriptive variable names
- Add JSDoc comments for public APIs

### Known Issues to Address

- Rate limiting not implemented
- No retry logic for failed requests
- Error responses could be more actionable
- Missing integration tests

This project is ready for active development and production use!
