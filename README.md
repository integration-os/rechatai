# Rechat 🤖

Rechat is an open-source AI platform that revolutionizes app development by automatically building both frontend applications and backend connectors. It leverages AI to generate complete, production-ready applications with seamless third-party integrations through IntegrationsOS, eliminating the complexity of manual integration development.

## ✨ Features

- 🏗️ Full-stack App Generation
  - Automated frontend application building
  - Automatic backend connector generation
  - Ready-to-deploy complete solutions
- 🔌 Comprehensive Integration Support
  - Pre-built connectors for popular services
  - Custom connector generation
  - Automatic API handling and authentication
- 🤖 AI-Powered Development
  - Intelligent code generation
  - Context-aware application building
  - Smart integration optimization
- 💡 Smart Features
  - Real-time updates with Convex
  - Secure authentication via Clerk
  - Modern UI with Shadcn UI
  - Customizable themes and interfaces

## 🚀 Tech Stack

- [Next.js 13+](https://nextjs.org/) - React Framework
- [Convex](https://www.convex.dev/) - Backend and Database
- [Clerk](https://clerk.dev/) - Authentication and User Management
- [IntegrationsOS](https://integrationsos.com/) - Integration Infrastructure
- [Shadcn UI](https://ui.shadcn.com/) - UI Components
- [OpenAI API](https://openai.com/api/) - AI Code Generation
- [Claude API](https://anthropic.com/) - AI Logic Processing

## 🎯 How It Works

1. **Define Your App**: Describe your desired application and required integrations
2. **AI Generation**: Rechat's AI generates both frontend and backend code
3. **Integration Creation**: Automatic generation of necessary API connectors
4. **Deploy**: Get a production-ready application with working integrations

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/integration-os/rechatai.git
cd rechat
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your environment variables:
```env
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# AI Models
OPENAI_API_KEY=
CLAUDE_API_KEY=

# Database
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# IntegrationsOS
INTEGRATIONSOS_API_KEY=
NEXT_PUBLIC_INTEGRATIONSOS_CLIENT_ID=
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## 🔧 Configuration

### Authentication
ReChat uses Clerk for authentication. Configure your Clerk application and add the necessary environment variables.

### AI Models
1. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/)
2. Get your Claude API key from Anthropic
3. Add both keys to your environment variables

### IntegrationsOS Setup
1. Create an account at [IntegrationsOS](https://integrationsos.com/)
2. Create a new project and get your API credentials
3. Add the IntegrationsOS API key and client ID to your environment variables

### Database
Set up your Convex database and add the deployment URL to your environment variables.


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [IntegrationsOS](https://integrationsos.com/)
- [Next.js](https://nextjs.org/)
- [Convex](https://www.convex.dev/)
- [Clerk](https://clerk.dev/)
- [OpenAI](https://openai.com/)
- [Anthropic](https://anthropic.com/)
- [Shadcn UI](https://ui.shadcn.com/)

## 📧 Contact

Project Link: [https://github.com/integration-os/rechatai.git](https://github.com/integration-os/rechatai.git)

---
Built with ❤️ by IntegrationsOS Community
