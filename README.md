# GymSaathi — Your Personal Fitness Companion 🇮🇳

GymSaathi is a personal fitness platform designed specifically for gym beginners and students in India. It unites personalized workout planning, smart Indian diet plans with real market prices, kitchen inventory cooking, exercise video demonstrations with posture cues, metabolic calculators, and consistency tracking.

---

## 🌟 Key Features

1. **7-Day Workout Split (Mon-Sat + Sunday Recovery)**:
   - **Monday**: Back (Lat Pulldown, Seated Cable Row, Chest-Supported Row, One-Arm Dumbbell Row, Straight-Arm Pulldown, Back Extension)
   - **Tuesday**: Biceps (EZ-Bar Curl, Alternating Dumbbell Curl, Hammer Curl, Incline Dumbbell Curl, Preacher Curl, Cable Curl)
   - **Wednesday**: Chest (Barbell Bench Press, Incline Dumbbell Press, Machine Chest Press, Cable Fly, Push-Ups, Pec Deck Fly)
   - **Thursday**: Triceps (Cable Triceps Pushdown, Overhead Cable Extension, Dumbbell Overhead Extension, Close-Grip Push-Up, Assisted Dip, Dumbbell Triceps Kickback)
   - **Friday**: Shoulders + Abs (Seated Dumbbell Shoulder Press, Lateral Raise, Reverse Pec Deck, Cable Face Pull, Plank, Dead Bug)
   - **Saturday**: Legs (Squat, Leg Press / Goblet Squat, Romanian Deadlift, Leg Curl, Calf Raise, Split Squat)
   - **Sunday**: Rest and Active Recovery (walking, mobility, 3.5L hydration, 8h sleep)
   - Every exercise has step-by-step setup, body alignment, breathing mechanics, golden cues, common mistakes, injury prevention tips, home workout alternatives, and genuine YouTube form search links.

2. **Dual-Mode Indian Diet Planner**:
   - **MODE A: Automatic Diet Plan**: Generates complete daily Indian meals (Breakfast, Mid-Morning, Lunch, Snack, Dinner) using rotis, rice, dal, paneer, soy chunks, eggs, curd, and seasonal fruits based on your BMR, TDEE, and budget. Includes live portion adjustments (+/-) and food swapping.
   - **MODE B: What's in Your Kitchen?**: Pick available ingredients and their quantities. GymSaathi formulates realistic meals using those exact ingredients first, calculates remaining inventory, and discloses protein gaps honestly with low-cost recommendations.

3. **Metabolic Calorie, Protein & BMI Calculator**:
   - Uses the documented Mifflin-St Jeor formula for BMR, activity multipliers for TDEE, Asian-Indian BMI screening cutoffs, goal-aligned surplus/deficit, and hydration guidelines. Includes medical cautions for minors and disordered eating history.

4. **Progress & Consistency Tracker**:
   - Log body weight, waist measurements, completed workouts, and daily nutrition. Interactive SVG trend charts, log history table, and 1-click CSV export.

5. **Science-Informed Fitness Education**:
   - Evidence-based guides on warm-ups, progressive overload double progression, debunking dal & soy myths, sleep hygiene, and red-flag symptoms to stop training immediately.

6. **100% Local Browser Privacy**:
   - All state is stored locally using `localStorage`. No mandatory API keys, tracking, or remote logins. Includes 1-click JSON backup export and restore.

---

## 🚀 Installation & Local Development

### Prerequisites
- Node.js (v18 or higher) or Bun

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
The app will be running at `http://localhost:3000`.

### 3. Run Unit Tests (Pure Logic)
```bash
tsx --test src/utils/fitnessCalculators.test.ts
tsx --test src/utils/dietGenerator.test.ts
```

### 4. Build for Production
```bash
npm run build
```

The production assets will be generated in the `dist` directory.

---

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (Dark charcoal `#0c100e` + Vibrant lime green `#84cc16`)
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti
- **Storage**: Browser LocalStorage with schema validation and JSON export/import
- **Testing**: Node.js built-in test runner (`node:test`, `node:assert/strict`) via `tsx`

---

## 📋 License
Apache-2.0
