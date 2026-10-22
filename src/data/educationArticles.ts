export interface EducationArticle {
  id: string;
  category: 'training' | 'nutrition' | 'recovery' | 'safety' | 'myths';
  title: string;
  readTime: string;
  summary: string;
  keyTakeaways: string[];
  content: string[];
}

export const EDUCATION_ARTICLES: EducationArticle[] = [
  {
    id: 'warm-up-protocols',
    category: 'training',
    title: 'The Smart 10-Minute Gym Warm-Up (No Treadmill Exhaustion)',
    readTime: '4 min read',
    summary: 'Why walking 30 minutes on a treadmill is not a strength warm-up, and how specific dynamic mobility sets up your joints for heavy lifts.',
    keyTakeaways: [
      'Cold muscles have lower elasticity and higher injury risk.',
      'Never do long passive static stretching before lifting; it temporarily decreases peak force output.',
      'Use 3-5 minutes of light cardio + 3 minutes of joint circles + pyramid ramp-up warm-up sets.'
    ],
    content: [
      'Many beginners in India enter the gym and either start bench pressing heavy immediately, or spend 45 minutes sweating on the treadmill before touching weights.',
      'A true weight-training warm-up has two goals: raise core body temperature and prepare the specific joint capsules and neurological pathways for the day’s exercises.',
      'Protocol:',
      '1. General elevation (3-4 mins): Fast walking or jumping jacks to break a light sweat.',
      '2. Joint mobility (3 mins): Arm circles, band face pulls, hip 90/90 openers, and bodyweight squats.',
      '3. Specific ramp-up sets: On your first exercise (e.g. Lat Pulldown or Bench Press), do 1 set with the empty bar or 30% weight for 10 reps, 1 set with 50% for 6 reps, then 1 set with 75% for 3 reps before working weights.'
    ]
  },
  {
    id: 'progressive-overload',
    category: 'training',
    title: 'Progressive Overload: The Only Rule That Actually Builds Muscle',
    readTime: '5 min read',
    summary: 'You do not need "muscle confusion" or new exercises every week. Learn how tracking small progressive increases builds real physique changes.',
    keyTakeaways: [
      'Muscles only grow when forced to adapt to a tension greater than they previously experienced.',
      'Progressive overload is not just adding weight—it includes doing +1 rep with clean form, resting 15s less, or controlling the negative.',
      'Keep a training log (use GymSaathi’s tracker) so you remember your previous numbers.'
    ],
    content: [
      'A common misconception propagated in local gyms is that you must "shock the muscle" with 10 different random exercises every session.',
      'In reality, the body adapts to progressive mechanical tension. If you bench press 40 kg for 8 reps today, and 6 months later you bench press 60 kg for 8 reps with identical clean form, your chest is physically forced to be larger.',
      'Double Progression Method for Beginners:',
      'Pick a rep range (e.g., 8-12 reps).',
      'Start with a weight you can lift for 8 clean reps.',
      'Over successive weeks, stay with that weight until you can complete 12 clean reps on all 3 sets.',
      'Only then, increase the weight by 2.5 kg or 5 kg, which will drop your reps back down toward 8. Repeat the cycle.'
    ]
  },
  {
    id: 'protein-calorie-science',
    category: 'nutrition',
    title: 'Indian Diet Reality: Protein, Dal Myths & Budget Muscle Building',
    readTime: '6 min read',
    summary: 'Unpacking the common Indian vegetarian protein myths, ranking the most cost-effective protein sources in ₹ per gram, and understanding macros.',
    keyTakeaways: [
      '1 bowl of cooked dal contains only 7-9g protein alongside 30-35g carbohydrates. Dal is primarily a carbohydrate source with secondary protein, not a pure protein powerhouse.',
      'Soy chunks are safe, healthy, and provide 52g protein per 100g at just ~₹25/100g—the highest protein per rupee in India.',
      'Whey protein is simply powdered milk byproduct (curd whey) filtered and dried; it is not steroids, chemicals, or dangerous for healthy kidneys.'
    ],
    content: [
      'In traditional Indian households, we are often told that "eating dal, roti, and milk is more than enough for bodybuilding." While Indian food is wholesome and delicious, traditional vegetarian diets are typically carb-heavy and protein-deficient for active lifters.',
      'An individual lifting weights needs approximately 1.4 to 1.8 grams of protein per kilogram of body weight.',
      'Protein Value Comparison (Cost per 30g Protein in India):',
      '1. Soy Chunks: ~₹15 for 30g protein (Unbeatable budget champion)',
      '2. Whole Eggs (4-5 eggs): ~₹30-35 for 30g protein',
      '3. Low-Fat Paneer / Curd: ~₹55-70 for 30g protein',
      '4. Chicken Breast (120g): ~₹45 for 30g protein',
      '5. Traditional Dal (requires 3.5 bowls!): High calorie overhead (~700 kcal) for 30g protein.',
      'The Soy Chunk Myth: Scientific human clinical trials have repeatedly shown that dietary phytoestrogens in soy do not alter testosterone or raise estrogen in men when consumed in standard dietary portions (up to 50g dry daily).'
    ]
  },
  {
    id: 'sleep-recovery-hydration',
    category: 'recovery',
    title: 'Sleep, Hydration & Why Muscles Actually Grow on Rest Days',
    readTime: '4 min read',
    summary: 'You do not grow in the gym; you break down muscle fibers in the gym. Sleep and hydration are when repair and protein synthesis happen.',
    keyTakeaways: [
      'During deep slow-wave sleep, the pituitary gland releases the majority of daily human growth hormone (HGH).',
      'A 2% drop in body hydration can decrease weightlifting strength by up to 10-15%.',
      'Sunday rest is not a wasted day—it prevents central nervous system (CNS) burnout and joint tendonitis.'
    ],
    content: [
      'When you lift weights, you create microscopic tears in the myofilaments and deplete glycogen stores.',
      'Muscle Protein Synthesis (MPS) peaks over the 24-48 hours after your workout, provided you supply adequate amino acids (protein) and deep sleep.',
      'Sleep Hygiene Tips for Students & Working Lifters:',
      '- Aim for 7 to 8 hours of uninterrupted sleep.',
      '- Avoid heavy caffeine or pre-workout drinks after 4:00 PM.',
      '- Keep your sleeping room cool and dark.',
      'Hydration in Indian Summers:',
      '- In Indian heat and non-AC gyms, sweat rates can exceed 1 to 1.5 liters per hour.',
      '- Keep a 1-liter water bottle at the gym. Add a pinch of pink salt or lemon if sweating profusely to maintain electrolyte balance.'
    ]
  },
  {
    id: 'common-gym-mistakes',
    category: 'safety',
    title: '7 Biggest Mistakes Beginners Make in Indian Gyms',
    readTime: '5 min read',
    summary: 'From ego-lifting with swinging elbows to skipping leg days and buying expensive fake mass-gainers, avoid these pitfalls.',
    keyTakeaways: [
      'Never let gym ego dictate your weight. Clean form with 10kg builds more muscle than sloppy swinging with 25kg.',
      'Mass Gainers are mostly cheap maltodextrin sugar sold at exorbitant prices. Real food (bananas, oats, peanut butter, milk) is healthier and cheaper.',
      'Skipping leg day creates severe postural instability and muscular imbalances.'
    ],
    content: [
      '1. Ego Lifting: Moving the weight from point A to point B using momentum rather than feeling the target muscle contract and stretch.',
      '2. Quarter Squats & Half Reps: Cutting range of motion in half just to put heavy 20kg plates on the bar. Full depth with lighter weight recruits twice the muscle fibers.',
      '3. Believing Mass Gainers are "Magic": Commercial mass gainers are 70% simple sugar (maltodextrin). You can make a superior, clean mass gainer at home using 250ml milk + 50g oats + 1 banana + 1 tbsp peanut butter.',
      '4. Training Every Single Day Without Rest: Seven intense workouts a week leads to chronic fatigue, tendonitis, and decreased immune health. Sunday rest is non-negotiable.',
      '5. Not Tracking Weights: Relying on memory means you lift the same comfortable weight every session for years.',
      '6. Ignoring Upper Back and Rear Delts: Over-training chest while ignoring rows leads to kyphotic (rounded) "caveman" shoulders.',
      '7. Taking Unverified Pills or Injections: Never accept unlabeled pills, injections, or "special fat-loss powder" from gym instructors. True fitness is built on real nutrition and patient effort.'
    ]
  },
  {
    id: 'red-flags-safety',
    category: 'safety',
    title: 'Safety First: When to Stop Exercising and Seek Medical Evaluation',
    readTime: '4 min read',
    summary: 'Learn the critical difference between healthy muscular burn/soreness (DOMS) and sharp structural injury warnings.',
    keyTakeaways: [
      'Muscle soreness (DOMS) is diffuse, feels like an ache 24-48 hours later, and improves with gentle movement.',
      'Sharp, sudden, stabbing, or joint-located pain is an immediate signal to STOP.',
      'Never train through joint pain or take painkillers to mask injury during a workout.'
    ],
    content: [
      'Delayed Onset Muscle Soreness (DOMS):',
      'Normal soreness feels like a dull, stiff ache across the muscle belly that peaks 24 to 48 hours after trying a new movement. It gradually subsides over 3 to 4 days.',
      'Red Flags — Stop the Exercise Immediately If You Feel:',
      '1. Sharp or stabbing sensations inside your knee, shoulder socket, or lower spine.',
      '2. Sudden "pop", snap, or tearing sensation.',
      '3. Tingling, numbness, or shooting electrical pain traveling down your arm or leg (signs of nerve compression).',
      '4. Dizziness, sudden cold sweat, nausea, or chest tightness.',
      'Rule of Thumb: If an exercise causes pain inside a joint, swap it for a joint-friendly variation (e.g. swap barbell flat bench for dumbbell press on a slight incline, or swap back squats for goblet box squats).'
    ]
  }
];
