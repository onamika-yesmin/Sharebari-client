# ShareBari - Borrow Nearby

A hyperlocal item sharing and rental marketplace built with Next.js, React, and modern web technologies.

## 🎯 What is ShareBari?

ShareBari is a community-driven rental platform that lets neighbors share idle items with each other. Instead of buying something you'll only use once or twice, rent it from someone nearby and save money while supporting your local community.

## ✨ Features

- **Browse Items**: Search and discover rentable items in your neighborhood
- **Add Listings**: List your own items for rent with photos, pricing, and availability
- **Secure Checkout**: Stripe-powered payment processing
- **User Profiles**: Build trust with ratings and reviews
- **Dashboard**: Manage your rentals and track earnings
- **Multiple Categories**: Tools, electronics, kitchen appliances, event gear, and more
- **Flexible Pricing**: Set daily rates and rental terms

## 🛠️ Tech Stack

**Frontend:**
- Next.js 16 (React 19)
- TypeScript
- Tailwind CSS + PostCSS
- EB Garamond Font
- GSAP for animations
- Lucide React Icons

**Features & Libraries:**
- Google OAuth Authentication
- Stripe Payment Integration
- Form validation with React Hook Form + Zod
- Beautiful alerts with SweetAlert2
- Toast notifications with Sonner
- Charts with Recharts
- Image upload & optimization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/onamika-yesmin/Sharebari-client.git
cd Sharebari-client

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Development

```bash
# Start the development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
src/
├── app/              # Next.js app directory (pages)
│   ├── (routes)/     # Page routes
│   ├── layout.tsx    # Root layout
│   └── globals.css   # Global styles
├── components/       # Reusable components
│   ├── SiteHeader.tsx    # Navigation
│   ├── SiteFooter.tsx    # Footer
│   ├── ItemCard.tsx      # Product card
│   └── ...
├── lib/             # Utilities & helpers
│   ├── api.ts           # API calls
│   ├── gsap-animations.ts # Animation utilities
│   └── ...
└── public/          # Static assets
```

## 🎨 Design & Branding

- **Primary Color**: Deep Blue (#0f172e)
- **Accent Color**: Vibrant Teal (#00d4aa)
- **Font**: EB Garamond (elegant serif)
- **Animations**: GSAP with ScrollTrigger for smooth interactions
- **Logo**: ShareBari Dark Green brand mark
- **Responsive**: Mobile-first design for all devices

## 📱 Key Pages

| Page | Purpose |
|------|---------|
| `/` | Home with featured listings |
| `/explore` | Browse & filter items |
| `/categories` | Browse by category |
| `/items/[id]` | Item details |
| `/items/add` | Add new listing |
| `/items/manage` | Manage your listings |
| `/checkout/[itemId]` | Checkout flow |
| `/dashboard` | Seller dashboard |
| `/profile` | User profile |

## 🔐 Authentication

- Email/Password authentication
- Google OAuth login
- Secure JWT tokens
- Protected routes

## 💳 Payment Integration

- Stripe Checkout
- Secure transactions
- Order confirmation

## 📊 Analytics

- User engagement tracking
- Rental history
- Rating & review system
- Seller performance metrics

## ♿ Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Respects `prefers-reduced-motion`

## 🚢 Deployment

Deploy to Vercel, Netlify, AWS Amplify, or Docker.

**Recommended:**
```bash
npm run build
npm start
```

## 📜 License

MIT License - See LICENSE file for details.

## 👥 Contributors

**Anamika Yeasmin** - Lead Developer

## 🙏 Acknowledgments

- Next.js & React community
- Stripe for payments
- Google for OAuth
- Tailwind CSS for styling
- GSAP for animations

---

**Made with ❤️ for Bangladesh communities**
