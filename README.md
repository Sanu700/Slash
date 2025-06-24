# Slash Experiences

Welcome to Slash Experiences - Your Gateway to Memorable Moments!

Curated experience gifts that create lasting memories. We believe in the power of experiences over material possessions.

## Recent Updates
- Fixed footer duplication in homepage
- Updated social media links (Instagram, Facebook, YouTube)
- Improved documentation and README
- Enhanced UI/UX for better user experience

## Features

- Modern React (Vite + TypeScript)
- Beautiful, responsive UI
- Social media integration (Instagram, Facebook, Twitter, LinkedIn, YouTube)
- Newsletter subscription
- Experience browsing and booking
- Admin dashboard (with mock/demo data fallback)
- Supabase integration for backend services
- Netlify serverless functions for payments

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/your-username/your-repo.git
cd Slash-13
npm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
yarn dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) (or your configured port).

### Building for Production

```bash
npm run build
# or
yarn build
```

### Linting & Formatting

```bash
npm run lint
npm run format
```

## Deployment

- **Netlify:** The project is ready for Netlify deployment. Serverless functions are in `netlify/functions/`.
- **Supabase:** Configure your Supabase credentials in the appropriate environment files.

## Project Structure

```
Slash-13/
  ├── src/
  │   ├── components/         # UI components
  │   ├── pages/              # Page components
  │   ├── lib/                # Utilities and services
  │   ├── contexts/           # React context providers
  │   ├── hooks/              # Custom React hooks
  │   └── styles/             # Global and component styles
  ├── netlify/functions/      # Netlify serverless functions
  ├── public/                 # Static assets
  ├── supabase/               # Supabase functions and migrations
  ├── package.json
  └── README.md
```

## Social Media

- [Instagram](https://www.instagram.com/slashsocials)
- [Facebook](https://facebook.com/social_slashexp)
- [Twitter](https://x.com/social_slashexp?t=2hMgiF7n9Z-6px4AIhXhgA&s=09)
- [LinkedIn](https://www.linkedin.com/company/slash-adbc/)
- [YouTube](https://youtube.com/@social_slashexp)

## License

[MIT](LICENSE)

---

> Built with ❤️ by the Slash Experiences team.

### Test: Added Instagram scraper functionality

