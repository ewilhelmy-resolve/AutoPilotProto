# Rita - AI-Powered ITSM Automation Platform

Rita is an intelligent IT Service Management automation platform that uses AI to triage, respond to, and resolve support tickets automatically. Built with React, TypeScript, and modern web technologies.

## ✨ Features

### 🤖 Auto-Respond
Train Rita to draft intelligent responses based on your knowledge base and historical tickets. Rita learns your support style and improves with feedback.

- AI-powered response generation
- Knowledge base integration
- Training workflow with trust/teach feedback loop
- Real-time confidence metrics
- Celebration animations for positive feedback

### 📊 Auto-Populate
Automatically fill in missing ticket information using AI analysis of user messages and historical context.

- Smart field detection (Priority, Category, Assignee)
- Non-intrusive alerts with preview
- One-click population with undo support
- Confidence scoring for suggestions

### 📚 Knowledge Gap Detection
Identify missing knowledge articles and generate comprehensive documentation with AI assistance.

- Automatic gap detection in ticket clusters
- Multi-source article generation (historical tickets + web search)
- Markdown-based content editing
- Real-time preview and regeneration

### 🚀 Auto-Resolve (Premium)
Execute pre-approved workflows end-to-end to fully resolve tickets without human intervention.

- Workflow preview with step-by-step visualization
- ROI calculator (resolution time, cost savings, annual impact)
- Two-stage conversion flow (test → validate → upgrade)
- Handles 20-60% of L1/L2 tickets automatically

### 🛠️ Developer Tools
Built-in devtools for demos and development.

- Feature flags management
- Quick navigation to all features
- Demo scenario controls
- State reset for presentations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose (for full stack)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd resolve-onboarding-main
   ```

2. **Install dependencies**
   ```bash
   # Frontend (Rita Go)
   cd packages/client
   npm install

   # Backend API
   cd ../api-server
   npm install
   ```

3. **Run frontend only (mock mode)**
   ```bash
   cd packages/client
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173)

4. **Run full stack (with Docker)**
   ```bash
   # From repository root
   docker compose up -d
   ```

### Demo Mode

Rita includes a comprehensive demo mode with mock data:

1. Navigate to `/devtools` for demo controls
2. Use Quick Navigation to jump between features
3. Follow toast notifications for feature walkthroughs
4. Reset demo state anytime for fresh presentations

## 📁 Project Structure

```
resolve-onboarding-main/
├── packages/
│   ├── client/          # Rita Go - React/TypeScript frontend
│   ├── api-server/      # Node.js API with RabbitMQ + PostgreSQL
│   └── mock-service/    # Mock external service for development
├── docs/                # Documentation
├── legacy/              # Legacy POC code (maintenance mode)
└── docker-compose.yml   # Docker orchestration
```

## 🎯 Key Pages

- **Dashboard** - Overview metrics and insights
- **Tickets** - Ticket clustering and automation status
- **Ticket Groups** - Detailed view with automation controls
- **Chat** - Real-time AI chat interface
- **Settings** - User preferences and integrations
- **DevTools** (`/devtools`) - Demo controls and feature flags

## 🔧 Tech Stack

### Frontend (Rita Go)
- **React 18+** with **TypeScript 5+**
- **TanStack Query v5** - Server state management
- **Zustand** - Client state management
- **React Router v6** - Navigation
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Radix UI** - Accessible primitives
- **Vite** - Build tool

### Backend
- **Node.js** with **Express**
- **PostgreSQL** - Database
- **RabbitMQ** - Message queue
- **Keycloak** - Authentication (optional)

## 🎨 Design System

Rita uses [Figma designs](https://www.figma.com/design/TBw4XFq0g6o1S0y8xt5tLK/AutoPilot) with shadcn/ui components:

- Component-Based Architecture (CBA)
- WCAG 2.1 AA accessibility compliance
- Mobile-first responsive design
- Server-Sent Events (SSE) for real-time updates

## 📖 Documentation

- **CLAUDE.md** - Development standards and architecture
- **docs/** - Detailed technical documentation
- **packages/client/src/components/** - Component documentation in JSDoc

## 🚢 Deployment

### Production Build
```bash
cd packages/client
npm run build
npm run preview
```

### Docker Production
```bash
docker compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

This is a demo/prototype project. For development:

1. All new features go in `packages/client/` (Rita Go)
2. Follow TypeScript strict mode
3. Use feature flags for incomplete features (`src/types/featureFlags.ts`)
4. Test accessibility with screen readers
5. Commit with descriptive messages

## 📝 License

[Add your license here]

## 🎉 Demo Features

Try these workflows:

1. **Auto-Respond Training**
   - Navigate to Tickets → Email Signatures
   - Click "Train Rita" button
   - Review AI responses and provide feedback
   - Complete training to enable auto-responses

2. **Knowledge Gap Detection**
   - Navigate to Tickets → VPN Issues (no content)
   - Click yellow "Fill Gap" button
   - Generate AI-powered knowledge article
   - Edit and publish to knowledge base

3. **Auto-Resolve Premium**
   - Navigate to Tickets → Email Signatures
   - Click "Upgrade" next to Auto-Resolve
   - Preview workflow steps and ROI metrics
   - Run test workflow (free)
   - See upgrade conversion flow

4. **Auto-Populate**
   - Navigate to any ticket detail page
   - See smart alerts for missing information
   - Click "Add All" to populate fields
   - Review and save changes

## 🛟 Support

For questions or issues:
- Check `/devtools` for demo controls
- Review `CLAUDE.md` for development guidelines
- Inspect component source code for implementation details

---

**Built with ❤️ using React, TypeScript, and AI**
