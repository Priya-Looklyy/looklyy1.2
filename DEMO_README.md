# Looklyy Demo Mode

A complete demonstration version of Looklyy that runs entirely on static data without requiring backend services.

## 🎭 Accessing Demo Mode

### Method 1: Simple URL (Recommended) 🚀
Just visit:
```
https://looklyy04.vercel.app/demo
```

### Method 2: URL Parameter
Add `?demo=true` to any Looklyy URL:
```
https://looklyy04.vercel.app/?demo=true
```

### Method 3: localStorage
Set `looklyy_demo_mode` to `'true'` in browser localStorage and reload the page.

**All methods will automatically redirect to the clean `/demo` URL.**

## ✨ Features

The demo showcases the complete Looklyy product flow:

### 1. **Authentication**
- Beautiful login/signup interface
- Google OAuth simulation
- No real authentication required - use any credentials

### 2. **Trending Page** 🔥
- 20+ curated fashion images from Unsplash
- Category filtering (All, Runway, Street Style, Trends)
- Heart/save functionality
- Smooth animations and transitions
- Load more pagination
- Trend scores and badges

### 3. **Wardrobe** ❤️
- Personal collection of heart-marked images
- Remove items with one click
- Empty state with call-to-action
- Share collection button

### 4. **Training Dashboard** 🎯
- Interactive image review interface
- Three actions: Approve (A), Reject (R), Duplicate (D)
- Keyboard shortcuts support
- Real-time statistics
- Progress tracking
- Session completion summary

### 5. **Admin Dashboard** ⚙️
- Password-protected admin interface (password: `demo`)
- Crawler control panel
- Training statistics
- System health monitoring
- Performance metrics
- Simulated actions with realistic delays

## 🎨 UI/UX Highlights

- **Modern Design**: Purple-pink gradient theme
- **Responsive**: Works on desktop, tablet, and mobile
- **Animations**: Smooth fade-ins, hover effects, transitions
- **Interactive**: Real-time feedback and state updates
- **Professional**: Clean, polished interface matching production standards

## 📊 Mock Data

All data is stored in `src/demo/data/mockImages.ts`:
- 20 trending fashion images
- User profile data
- Crawler statistics
- Training statistics
- Review session data

Images are sourced from Unsplash with high-quality fashion photography.

## 🔄 Demo Flow

1. **Start**: Visit `/demo`
2. **Login**: Enter any email/password or click Google sign-in
3. **Explore**: Browse trending fashion images
4. **Save**: Heart your favorite looks
5. **Wardrobe**: View saved items in your wardrobe
6. **Train**: Review images to "train the AI"
7. **Admin**: Access admin dashboard (password: `demo`)
8. **Exit**: Click "Exit Demo" to return to normal mode

## 🛠️ Technical Details

### Architecture
- **React Context**: `DemoProvider` manages all demo state
- **TypeScript**: Fully typed mock data interfaces
- **No Backend**: All operations happen client-side
- **localStorage**: Persists demo mode and authentication
- **Conditional Rendering**: Demo mode doesn't affect production code

### Files Structure
```
src/demo/
├── DemoApp.tsx          # Main demo app component
├── DemoProvider.tsx     # Demo state management
├── data/
│   └── mockImages.ts    # Static data
└── pages/
    ├── DemoAuthFlow.tsx    # Demo login
    ├── DemoTrending.tsx    # Demo trending page
    ├── DemoWardrobe.tsx    # Demo wardrobe
    ├── DemoTraining.tsx    # Demo training
    └── DemoAdmin.tsx       # Demo admin
```

### Integration
- Demo mode is checked in `src/App.jsx`
- URL param `?demo=true` or localStorage enables demo
- No modification to existing production code
- Clean separation of concerns

## 🎯 Use Cases

### Sales Demos
- Show complete product flow without setup
- No backend dependencies
- Works offline
- Consistent, predictable experience

### User Testing
- Gather feedback on UI/UX
- Test user flows
- No risk of affecting production data

### Presentations
- Quick product showcase
- Portfolio demonstrations
- Investor presentations

### Development
- Frontend testing without backend
- UI component development
- Style guide reference

## 🚀 Deployment

The demo is automatically deployed with the main application:
- **Demo URL**: `https://looklyy04.vercel.app/demo` ⭐ **Share this!**
- **Branch**: `demo-looklyy` (separate from main)
- **No Conflicts**: Demo code is isolated and doesn't affect production

### Easy Share Link
```
looklyy04.vercel.app/demo
```
Simple, clean, and memorable! Perfect for sharing with stakeholders, investors, or users.

## 🔧 Customization

### Adding More Images
Edit `src/demo/data/mockImages.ts` and add new entries to `mockTrendingImages`.

### Changing Stats
Modify `mockCrawlerStats`, `mockTrainingStats`, or `mockReviewSession` in the same file.

### Adjusting UI
All demo pages are in `src/demo/pages/` and can be customized independently.

### Branding
Update colors, logos, and text to match your branding requirements.

## 📝 Notes

- Demo mode is **completely isolated** from production
- No real data is created or modified
- Perfect for demonstrations and testing
- Can be enabled/disabled instantly
- Preserves all existing functionality

## 🎉 Demo Credentials

**Login**: Any email/password (e.g., `demo@looklyy.com` / `password`)  
**Admin Password**: `demo` or `looklyy-admin-2024`

## 🤝 Contributing

To enhance the demo:
1. Checkout `demo-looklyy` branch
2. Make changes in `src/demo/`
3. Test with `?demo=true`
4. Submit PR

---

**Enjoy exploring Looklyy! 🎭✨**
