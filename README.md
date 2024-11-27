# ReChat 🤖

ReChat is an open-source AI chat platform that allows users to interact with multiple AI models (OpenAI GPT, Anthropic Claude) in a unified interface. Built with modern web technologies and designed for seamless user experience.

## ✨ Features

- 🤖 Multi-AI Model Support (OpenAI GPT, Anthropic Claude)
- 🔄 Real-time chat with AI using Convex
- 👥 User authentication and management with Clerk
- 🔌 Extensible integrations system
- 💅 Modern UI built with Next.js 13+ and Shadcn UI
- 🌐 Real-time updates and collaboration
- 🎨 Customizable themes and interface

## 🚀 Tech Stack

- [Next.js 13+](https://nextjs.org/) - React Framework
- [Convex](https://www.convex.dev/) - Backend and Database
- [Clerk](https://clerk.dev/) - Authentication and User Management
- [Shadcn UI](https://ui.shadcn.com/) - UI Components
- [OpenAI API](https://openai.com/api/) - GPT Integration
- [Claude API](https://anthropic.com/) - Claude Integration
- [TypeScript](https://www.typescriptlang.org/) - Type Safety

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rechat.git
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

### Database
Set up your Convex database and add the deployment URL to your environment variables.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Convex](https://www.convex.dev/)
- [Clerk](https://clerk.dev/)
- [OpenAI](https://openai.com/)
- [Anthropic](https://anthropic.com/)
- [Shadcn UI](https://ui.shadcn.com/)

## 📧 Contact

Project Link: [https://github.com/yourusername/rechat](https://github.com/yourusername/rechat)

---
Built with ❤️ by [Your Name/Organization]
