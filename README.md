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


## Enhanced Search with Autocomplete
- **Smart Search**: Search across experience titles, descriptions, locations, categories, and more
- **Real-time Suggestions**: Get instant autocomplete suggestions as you type
- **Keyboard Navigation**: Use arrow keys to navigate through suggestions and Enter to select
- **Fuzzy Matching**: Intelligent search that matches partial words and phrases
- **Relevance Sorting**: Results are sorted by relevance (title matches first, then location, then category)
- **Visual Feedback**: Hover effects and selection highlighting for better UX

#### Search Features:
- Type at least 2 characters to see suggestions
- Search works across multiple fields:
  - Experience titles
  - Descriptions
  - Locations
  - Categories
  - Duration
  - Participant information
- Keyboard shortcuts:
  - `↑/↓` Arrow keys to navigate suggestions
  - `Enter` to select highlighted suggestion
  - `Escape` to close suggestions
  - `Enter` (when no suggestion selected) to perform search
- Click outside to close suggestions
- Clear button (X) to reset search

#### Example Usage:
- Type "Poe" → Shows "Poetry Workshop" if available
- Type "Mumbai" → Shows all experiences in Mumbai
- Type "Adventure" → Shows all adventure-related experiences
- Type "Spa" → Shows spa and wellness experiences

## 🎯 **New Feature: Location Scroll Menu**

### **What's New:**
- **Location Scroll Menu**: A horizontal scrollable menu on the homepage with all major Indian cities
- **Predefined Locations**: Contains 200+ major Indian cities including Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, Jaipur, and many more
- **Interactive Selection**: Click on any location to select it and see feedback
- **Responsive Design**: Works perfectly on all screen sizes with smooth horizontal scrolling

### **How to Test:**

1. **Start the Development Server:**
   ```bash
   npm run dev
   ```

2. **Test the Location Menu:**
   - Visit the homepage
   - Scroll down to the "Explore by Location" section
   - Click on different location buttons to select them
   - Try clicking "All India" to deselect any location
   - See the feedback message when you select a location
   - Test the horizontal scrolling on mobile devices

### **Features:**
- ✅ Horizontal scrollable location menu with 200+ Indian cities
- ✅ "All India" option to deselect location
- ✅ Interactive location selection with visual feedback
- ✅ Responsive design with smooth scrolling
- ✅ Hidden scrollbars for better UX
- ✅ Visual feedback for selected location
- ✅ Gradient overlay for better scrolling experience

### **Included Cities:**
Major cities like Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, Jaipur, Surat, Lucknow, Kanpur, Nagpur, Indore, Thane, Bhopal, Visakhapatnam, Patna, Vadodara, Ghaziabad, Ludhiana, Agra, Nashik, Faridabad, Meerut, Rajkot, Varanasi, Srinagar, Aurangabad, Dhanbad, Amritsar, Allahabad, Ranchi, Howrah, Coimbatore, Jabalpur, Gwalior, Vijayawada, Jodhpur, Madurai, Raipur, Kota, Guwahati, Chandigarh, and many more!

---

## Getting Started


