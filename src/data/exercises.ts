import { Exercise } from '../types/fitness';

export const EXERCISES: Exercise[] = [
  // ==================== MONDAY: BACK (6 Exercises) ====================
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    primaryMuscle: 'back',
    secondaryMuscles: ['biceps', 'rear deltoids', 'forearms'],
    targetMuscleDisplay: 'Latissimus Dorsi (Lats)',
    equipment: 'cable',
    equipmentDisplay: 'Cable Lat Machine',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-12',
    restSeconds: 90,
    daySplit: 'monday',
    setup: 'Adjust the thigh pad securely so your thighs are locked down with feet flat on the floor. Grip the bar slightly wider than shoulder-width with an overhand grip.',
    bodyAlignment: 'Sit tall with your chest lifted, slight natural arch in lower back, and torso leaned back only 10-15 degrees.',
    movementSteps: [
      'Depress your shoulder blades down and back before bending your elbows.',
      'Pull the bar down toward your upper chest/collarbone, driving your elbows down and inward toward your hips.',
      'Squeeze your lats forcefully at the bottom for 1 second.',
      'Slowly return the bar to the starting stretch position under control over 2-3 seconds.'
    ],
    breathing: 'Exhale as you pull the bar down; inhale smoothly as you release the bar upward.',
    postureCues: [
      'Think of pulling with your elbows, not pulling with your hands.',
      'Avoid swinging or leaning excessively backward to yank the weight.',
      'Keep your wrists neutral and chest puffed out.'
    ],
    commonMistakes: [
      'Yanking the bar down behind the neck (strains cervical spine and rotator cuff).',
      'Using excessive body swing and momentum.',
      'Shrugging the shoulders up toward the ears.'
    ],
    injuryPreventionTips: [
      'Always pull in front of your head to the upper sternum, never behind the neck.',
      'Do not allow the weight stack to slam at the top.'
    ],
    beginnerAlternative: 'Underhand / Close-Grip Lat Pulldown or Band Lat Pulldown',
    homeAlternative: 'Resistance Band Door Pulldowns or Inverted Rows under a sturdy table',
    videoSearchQuery: 'lat pulldown proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'seated-cable-row',
    name: 'Seated Cable Row',
    primaryMuscle: 'back',
    secondaryMuscles: ['rhomboids', 'middle trapezius', 'biceps', 'erector spinae'],
    targetMuscleDisplay: 'Mid-Back & Rhomboids',
    equipment: 'cable',
    equipmentDisplay: 'Low Cable Row Machine',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-12',
    restSeconds: 90,
    daySplit: 'monday',
    setup: 'Sit on the bench facing the low pulley with knees slightly bent. Plant feet firmly on the footrests. Grasp the V-bar handle with a neutral grip.',
    bodyAlignment: 'Torso upright at 90 degrees to thighs, shoulders relaxed down, core engaged.',
    movementSteps: [
      'Retract your shoulder blades backward as you initiate the pull.',
      'Pull the handle into your lower abdomen/navel area while keeping elbows tucked close to your ribs.',
      'Pause and squeeze your shoulder blades together hard.',
      'Extend your arms forward with control, allowing a gentle natural stretch without rounding your lower back.'
    ],
    breathing: 'Exhale as you pull into your torso; inhale as you extend your arms back to the starting point.',
    postureCues: [
      'Chest high, proud posture throughout the set.',
      'Do not rock back and forth like a rowing boat; keep your torso stable.',
      'Drive elbows straight back behind you.'
    ],
    commonMistakes: [
      'Hyperextending or rocking violently at the hips.',
      'Flaring elbows out past 90 degrees.',
      'Rounding the lower back when returning the weight.'
    ],
    injuryPreventionTips: [
      'Maintain a tight brace in your abdominal wall to safeguard your lumbar spine.',
      'Keep knees soft and never locked straight.'
    ],
    beginnerAlternative: 'Chest-Supported Machine Row',
    homeAlternative: 'Seated Resistance Band Row anchored to feet or door frame',
    videoSearchQuery: 'seated cable row proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'chest-supported-row',
    name: 'Chest-Supported Row',
    primaryMuscle: 'back',
    secondaryMuscles: ['rhomboids', 'rear delts', 'latissimus dorsi', 'biceps'],
    targetMuscleDisplay: 'Upper Back & Rear Lats',
    equipment: 'dumbbell',
    equipmentDisplay: 'Incline Bench & Dumbbells (or Machine)',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-12',
    restSeconds: 90,
    daySplit: 'monday',
    setup: 'Set an adjustable bench to a 30 to 45-degree incline. Lie face down with your sternum supported on the pad and feet anchored to the floor. Grab a pair of dumbbells.',
    bodyAlignment: 'Spine neutral from neck to tailbone, neck in line with spine (not looking straight up).',
    movementSteps: [
      'Let your arms hang straight down with palms facing each other.',
      'Pull the dumbbells upward toward your lower ribs, focusing on squeezing your shoulder blades together.',
      'Hold the peak contraction at the top for 1 count.',
      'Lower the dumbbells slowly until your arms are fully extended.'
    ],
    breathing: 'Exhale as you row upward; inhale smoothly on the descent.',
    postureCues: [
      'Keep your chest glued to the bench pad; do not lift your torso off.',
      'Keep your chin slightly tucked to keep the neck safe.',
      'Concentrate on drawing the elbows back.'
    ],
    commonMistakes: [
      'Lifting your chest off the pad to assist the weight.',
      'Shrugging with the upper traps instead of mid-back.',
      'Dropping the weights quickly without eccentric control.'
    ],
    injuryPreventionTips: [
      'The chest pad eliminates lower back fatigue, making it the safest horizontal row for beginners with lumbar sensitivity.'
    ],
    beginnerAlternative: 'Machine Chest Supported Row',
    homeAlternative: 'Prone Dumbbell Row on Floor or Bed edge',
    videoSearchQuery: 'chest supported dumbbell row form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'one-arm-dumbbell-row',
    name: 'One-Arm Dumbbell Row',
    primaryMuscle: 'back',
    secondaryMuscles: ['lats', 'rear delts', 'biceps', 'forearms'],
    targetMuscleDisplay: 'Unilateral Lat & Upper Back',
    equipment: 'dumbbell',
    equipmentDisplay: 'Flat Bench & Single Dumbbell',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-12 each arm',
    restSeconds: 75,
    daySplit: 'monday',
    setup: 'Place your left knee and left hand on a flat bench. Keep your right foot planted firmly out to the side for stability. Pick up the dumbbell with your right hand.',
    bodyAlignment: 'Flat back parallel to the floor, head neutral, core actively braced.',
    movementSteps: [
      'Start with the dumbbell hanging directly beneath your shoulder.',
      'Pull the dumbbell in a smooth slight arc back toward your hip pocket, keeping the elbow close.',
      'Contract your lat fully at the top.',
      'Lower the dumbbell in a controlled 2-second tempo until you feel a gentle stretch in the lat.'
    ],
    breathing: 'Exhale during the row; inhale as you lower the weight.',
    postureCues: [
      'Pull toward your hip pocket rather than straight up to your chest.',
      'Do not rotate your torso or twist your spine to hoist the dumbbell.',
      'Both hips should stay square to the bench.'
    ],
    commonMistakes: [
      'Twisting the torso open toward the ceiling on every rep.',
      'Using momentum and dropping the weight violently.',
      'Rounding the spinal column.'
    ],
    injuryPreventionTips: [
      'Keep your supporting arm active and shoulder packed down, not slumped.',
      'Switch sides and match repetitions without resting between arms if conditioning allows.'
    ],
    beginnerAlternative: 'Supported Dumbbell Row with both hands on high incline',
    homeAlternative: 'Single Arm Backpack / Water Bottle Row',
    videoSearchQuery: 'one arm dumbbell row proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'straight-arm-pulldown',
    name: 'Straight-Arm Pulldown',
    primaryMuscle: 'back',
    secondaryMuscles: ['latissimus dorsi', 'teres major', 'abdominal core', 'triceps long head'],
    targetMuscleDisplay: 'Lat Isolation & Teres Major',
    equipment: 'cable',
    equipmentDisplay: 'High Cable Pulley & Straight/Curved Bar or Rope',
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '12-15',
    restSeconds: 60,
    daySplit: 'monday',
    setup: 'Attach a straight bar or rope to a high cable pulley. Stand about 2 feet back, hips hinged slightly backward, soft bend in knees.',
    bodyAlignment: 'Torso tilted forward around 30 degrees, spine neutral, arms extended forward with elbows softly unlocked.',
    movementSteps: [
      'Without bending your elbows any further, pull the bar down in a wide sweeping arc toward your upper thighs.',
      'Contract your lats firmly at the bottom of the movement.',
      'Slowly allow the cable to raise your arms back up to ear/eye level while feeling a deep stretch in the armpit/lat area.'
    ],
    breathing: 'Exhale as you push the bar down to your thighs; inhale as you return to the top.',
    postureCues: [
      'Lock your elbow angle at a slight 10-degree bend—do not turn this into a triceps pushdown!',
      'Imagine sweeping your arms around a large barrel.',
      'Keep your core tightly braced to prevent leaning backward.'
    ],
    commonMistakes: [
      'Bending and straightening the elbows (turning it into a tricep extension).',
      'Using too heavy of a stack and shrugging shoulders.'
    ],
    injuryPreventionTips: [
      'Select a moderate weight to master mind-muscle connection with the lats without elbow strain.'
    ],
    beginnerAlternative: 'Straight Arm Pulldown with Resistance Band',
    homeAlternative: 'Resistance Band Pullover lying on floor or bed',
    videoSearchQuery: 'straight arm cable pulldown form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'back-extension',
    name: 'Back Extension (Hyperextension)',
    primaryMuscle: 'back',
    secondaryMuscles: ['erector spinae', 'glutes', 'hamstrings'],
    targetMuscleDisplay: 'Lower Back & Spinal Erectors',
    equipment: 'machine',
    equipmentDisplay: '45-Degree Hyperextension Bench',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '12-15',
    restSeconds: 60,
    daySplit: 'monday',
    setup: 'Step onto the 45-degree hyperextension bench. Adjust the hip pad so the top edge rests just below your hip crease/pelvis so your hips can flex freely.',
    bodyAlignment: 'Feet secured under the ankle pads, legs straight with knees soft, hands crossed over chest or behind ears.',
    movementSteps: [
      'Hinge forward from the hips, lowering your upper body toward the floor until you feel a hamstring and spinal stretch.',
      'Contract your glutes and lower back to raise your torso back up in a smooth, controlled motion.',
      'Bring your body to a straight line from heels to head—do not hyperextend past neutral.'
    ],
    breathing: 'Inhale on the way down; exhale as you raise your torso back to the neutral straight line.',
    postureCues: [
      'Hinge at the hips, not by collapsing your upper back.',
      'Pause for a second at the top when body forms a straight 180-degree line.',
      'Avoid jerking or swinging up violently.'
    ],
    commonMistakes: [
      'Over-arching and hyperextending backward at the top (compresses lumbar discs).',
      'Using heavy weights before mastering bodyweight form.'
    ],
    injuryPreventionTips: [
      'Never hyperextend aggressively past a straight line. If you feel sharp pinching in the lower back, stop immediately.'
    ],
    beginnerAlternative: 'Bird-Dog on floor or Prone Cobra',
    homeAlternative: 'Floor Superman / Prone Back Extension or Glute Bridge',
    videoSearchQuery: 'back extension 45 degree proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },

  // ==================== TUESDAY: BICEPS (6 Exercises) ====================
  {
    id: 'ez-bar-curl',
    name: 'EZ-Bar Curl',
    primaryMuscle: 'biceps',
    secondaryMuscles: ['brachialis', 'brachioradialis', 'forearms'],
    targetMuscleDisplay: 'Biceps Brachii (Both Heads)',
    equipment: 'barbell',
    equipmentDisplay: 'EZ-Curl Bar',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '8-10',
    restSeconds: 75,
    daySplit: 'tuesday',
    setup: 'Hold the EZ-bar on the undulating inner grips with palms facing up and slightly inward (semi-supinated). Stand tall with feet shoulder-width apart.',
    bodyAlignment: 'Shoulders back, chest up, elbows tucked close to your ribs, knees slightly unlocked.',
    movementSteps: [
      'Keeping your upper arms stationary against your torso, curl the bar upward toward chest level.',
      'Squeeze your biceps intensely at the top contraction.',
      'Lower the weight back down slowly over 2-3 seconds until arms are nearly fully extended.'
    ],
    breathing: 'Exhale as you curl the bar up; inhale smoothly as you lower it down.',
    postureCues: [
      'Pin your elbows by your sides like door hinges.',
      'Do not rock your torso backward or swing your hips to generate momentum.',
      'Keep your wrists firm, not curled backward or limp.'
    ],
    commonMistakes: [
      'Swinging the back to lift heavier weights than your biceps can handle.',
      'Letting elbows drift forward excessively into front delt flexion.',
      'Dropping the bar down quickly without resistance.'
    ],
    injuryPreventionTips: [
      'The EZ-bar angle reduces wrist and forearm torque compared to a straight barbell, making it gentler on beginner wrists.'
    ],
    beginnerAlternative: 'Light Dumbbell Bicep Curl',
    homeAlternative: 'Resistance Band Standing Bicep Curl or Water Bottle Curls',
    videoSearchQuery: 'ez bar curl proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'alternating-dumbbell-curl',
    name: 'Alternating Dumbbell Curl',
    primaryMuscle: 'biceps',
    secondaryMuscles: ['forearms', 'brachioradialis'],
    targetMuscleDisplay: 'Biceps Brachii with Supination',
    equipment: 'dumbbell',
    equipmentDisplay: 'Pair of Dumbbells',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-12 each arm',
    restSeconds: 60,
    daySplit: 'tuesday',
    setup: 'Stand or sit on a bench holding a dumbbell in each hand at arms length by your sides, palms facing inward.',
    bodyAlignment: 'Core tight, shoulders held back, feet planted flat.',
    movementSteps: [
      'Begin curling one dumbbell up, rotating your wrist as you lift so your palm faces upward (supination) by the top.',
      'Squeeze the bicep peak hard at shoulder height.',
      'Lower the dumbbell with control while un-rotating back to neutral.',
      'Repeat with the opposite arm in an alternating rhythm.'
    ],
    breathing: 'Exhale during the upward curling phase; inhale during the downward eccentric phase.',
    postureCues: [
      'Turn your pinky slightly higher than your thumb at the top to maximize bicep peak contraction.',
      'Keep the resting arm still and under control while curling the working arm.'
    ],
    commonMistakes: [
      'Alternating so quickly that momentum takes over.',
      'Swinging elbows forward or flaring them wide.'
    ],
    injuryPreventionTips: [
      'Maintain full control; avoid twisting the lower back to heave the dumbbell up.'
    ],
    beginnerAlternative: 'Seated Dumbbell Curls on standard chair/bench',
    homeAlternative: 'Filled Water Bottle Alternating Curls',
    videoSearchQuery: 'alternating dumbbell curl proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'hammer-curl',
    name: 'Hammer Curl',
    primaryMuscle: 'biceps',
    secondaryMuscles: ['brachialis', 'brachioradialis', 'grip & forearms'],
    targetMuscleDisplay: 'Brachialis & Forearm Thickness',
    equipment: 'dumbbell',
    equipmentDisplay: 'Pair of Dumbbells',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-12',
    restSeconds: 60,
    daySplit: 'tuesday',
    setup: 'Stand upright holding dumbbells at your sides with a neutral grip (palms facing each other throughout the entire range).',
    bodyAlignment: 'Spine straight, shoulders depressed, chest lifted.',
    movementSteps: [
      'Keep upper arms pinned tightly to your ribcage.',
      'Curl the dumbbells forward and upward while maintaining the neutral thumb-up palm-facing grip.',
      'Pause and contract the outer arm (brachialis) and forearms at the top.',
      'Lower with control back to full extension.'
    ],
    breathing: 'Exhale as you raise the dumbbells; inhale on the eccentric descent.',
    postureCues: [
      'Think of tapping your thumb toward the front of your shoulder.',
      'Keep wrists rigid like hammers—do not twist or break wrist alignment.'
    ],
    commonMistakes: [
      'Allowing elbows to flare outward away from the body.',
      'Leaning the torso backward.'
    ],
    injuryPreventionTips: [
      'Neutral grip places the least strain on the distal bicep tendon and wrist joint.'
    ],
    beginnerAlternative: 'Seated Neutral Hammer Curl',
    homeAlternative: 'Backpack Hammer Curl holding side straps',
    videoSearchQuery: 'dumbbell hammer curl proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'incline-dumbbell-curl',
    name: 'Incline Dumbbell Curl',
    primaryMuscle: 'biceps',
    secondaryMuscles: ['long head of biceps', 'forearms'],
    targetMuscleDisplay: 'Biceps Long Head (Stretch Position)',
    equipment: 'dumbbell',
    equipmentDisplay: 'Incline Bench (45-60°) & Dumbbells',
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '10-12',
    restSeconds: 75,
    daySplit: 'tuesday',
    setup: 'Set an adjustable bench to a 45 to 60-degree angle. Sit back with your back flat against the pad and let your arms hang straight down behind your torso.',
    bodyAlignment: 'Head back against pad, shoulders retracted, full stretch on the anterior shoulder and bicep.',
    movementSteps: [
      'Starting with palms facing inward or forward, curl the dumbbells up without swinging your upper arms forward.',
      'Supinate wrists so palms face upward as you ascend.',
      'Squeeze the long head peak at the top.',
      'Lower the dumbbells slowly over 3 seconds until you feel a deep, controlled stretch at the bottom.'
    ],
    breathing: 'Exhale on the curl; inhale on the long stretch descent.',
    postureCues: [
      'Keep elbows pointing down toward the floor—do not let them drift forward to cheat the stretch.',
      'Use lighter dumbbells than you would use standing.'
    ],
    commonMistakes: [
      'Setting the bench too low (e.g. 30 degrees strains the anterior shoulder capsule in beginners).',
      'Lifting your shoulders off the bench.'
    ],
    injuryPreventionTips: [
      'Start with a conservative bench incline (around 60 degrees) before attempting lower inclines.'
    ],
    beginnerAlternative: 'Flat Bench Concentration Curl',
    homeAlternative: 'Seated Lean-Back Chair Curl',
    videoSearchQuery: 'incline dumbbell curl proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'preacher-curl',
    name: 'Preacher Curl',
    primaryMuscle: 'biceps',
    secondaryMuscles: ['short head of biceps', 'brachialis'],
    targetMuscleDisplay: 'Biceps Short Head (Peak Contraction)',
    equipment: 'barbell',
    equipmentDisplay: 'Preacher Bench & EZ-Bar or Dumbbell',
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '10-12',
    restSeconds: 75,
    daySplit: 'tuesday',
    setup: 'Adjust preacher seat so your armpits rest comfortably over the top of the slanted pad. Grasp an EZ-bar or dumbbells with an underhand grip.',
    bodyAlignment: 'Torso snug against the bench, chest up, arms resting flat along the pad.',
    movementSteps: [
      'Start with arms extended down the pad, stopping just short of a harsh elbow hyperextension.',
      'Curl the bar upward toward your shoulders by flexing at the elbows.',
      'Squeeze your inner biceps hard at the peak.',
      'Lower the weight smoothly under strict control back down the pad.'
    ],
    breathing: 'Exhale as you curl up; inhale as you lower down.',
    postureCues: [
      'Keep your triceps glued to the pad throughout the movement.',
      'Never bounce or violently snap into straight arms at the bottom.',
      'Keep wrists neutral.'
    ],
    commonMistakes: [
      'Dropping the weight quickly and hyper-extending the elbows at the bottom (high risk of bicep tendon tear).',
      'Lifting your body up off the seat.'
    ],
    injuryPreventionTips: [
      'Always stop 2-3 degrees before absolute elbow lockout at the bottom to protect the bicep tendon insertion.'
    ],
    beginnerAlternative: 'Machine Preacher Curl or Single Arm Dumbbell Preacher',
    homeAlternative: 'Concentration Curl with elbow resting on inner thigh',
    videoSearchQuery: 'preacher curl proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'cable-curl',
    name: 'Cable Curl',
    primaryMuscle: 'biceps',
    secondaryMuscles: ['forearms', 'brachialis'],
    targetMuscleDisplay: 'Constant-Tension Biceps',
    equipment: 'cable',
    equipmentDisplay: 'Low Cable Pulley with Straight or EZ-Attachment',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '12-15',
    restSeconds: 60,
    daySplit: 'tuesday',
    setup: 'Attach a short straight bar or rope to the bottom pulley. Stand 1 step back from the machine, holding the handle with an underhand grip at hip height.',
    bodyAlignment: 'Athletic stance, feet shoulder-width, knees slightly bent, elbows locked at sides.',
    movementSteps: [
      'Curl the cable handle upward toward your collarbone against the smooth resistance.',
      'Hold the peak contraction for 1 second against the constant tension.',
      'Lower the cable slowly, resisting the pull back to the starting point.'
    ],
    breathing: 'Exhale as you curl; inhale smoothly on release.',
    postureCues: [
      'Cables provide continuous tension even at the very top and bottom where dumbbells lose resistance.',
      'Keep wrists stiff and elbows tight.'
    ],
    commonMistakes: [
      'Leaning forward and backward.',
      'Letting the weight stack crash between reps.'
    ],
    injuryPreventionTips: [
      'Cable resistance is smooth and joint-friendly, ideal for high-rep pump work and joint health.'
    ],
    beginnerAlternative: 'Light Resistance Band Standing Curl',
    homeAlternative: 'Stepping on a looped resistance band and curling handles',
    videoSearchQuery: 'standing cable curl form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },

  // ==================== WEDNESDAY: CHEST (6 Exercises) ====================
  {
    id: 'barbell-bench-press',
    name: 'Barbell Bench Press',
    primaryMuscle: 'chest',
    secondaryMuscles: ['anterior deltoids', 'triceps', 'serratus anterior'],
    targetMuscleDisplay: 'Pectoralis Major (Mid & Overall Chest)',
    equipment: 'barbell',
    equipmentDisplay: 'Flat Bench, Olympic Barbell & Rack',
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '8-10',
    restSeconds: 120,
    daySplit: 'wednesday',
    setup: 'Lie flat on the bench with eyes directly under the racked bar. Plant your feet flat on the floor. Grip the bar with hands slightly wider than shoulder-width.',
    bodyAlignment: 'Retract your shoulder blades and pinch them into the bench pad, creating a slight natural arch in the lower back (buttocks and upper back remain firmly on pad).',
    movementSteps: [
      'Unrack the bar and hold it directly over your chest with straight arms.',
      'Lower the bar with control to your lower-to-mid sternum, keeping elbows tucked at roughly 45 to 70 degrees from your torso.',
      'Gently touch your chest without bouncing the bar off your ribs.',
      'Press the bar upward and slightly back toward your eye level in a subtle J-curve, locking out smoothly.'
    ],
    breathing: 'Inhale and brace your core on the descent; exhale forcefully as you press past the sticking point.',
    postureCues: [
      'Keep shoulder blades pinched down and back—never allow shoulders to roll forward off the bench.',
      'Drive your feet into the floor for whole-body stability.',
      'Never bounce the bar off your ribs.'
    ],
    commonMistakes: [
      'Flaring elbows out at 90 degrees in a T-shape (causes severe shoulder impingement).',
      'Lifting hips and buttocks off the bench to assist the lift.',
      'Bouncing the barbell off the sternum.'
    ],
    injuryPreventionTips: [
      'Always use a secure grip with thumbs wrapped around the bar (never use the false/suicide grip).',
      'Use safety pins or a spotter when lifting challenging weights.'
    ],
    beginnerAlternative: 'Dumbbell Flat Bench Press or Machine Chest Press',
    homeAlternative: 'Push-Ups or Resistance Band Floor Press',
    videoSearchQuery: 'barbell bench press proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    primaryMuscle: 'chest',
    secondaryMuscles: ['upper chest (clavicular head)', 'anterior deltoids', 'triceps'],
    targetMuscleDisplay: 'Upper Pectoralis Major',
    equipment: 'dumbbell',
    equipmentDisplay: 'Incline Bench (30-45°) & Dumbbells',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-12',
    restSeconds: 90,
    daySplit: 'wednesday',
    setup: 'Set an adjustable bench to an incline of 30 degrees (preferable) to 45 degrees. Sit with dumbbells resting on your thighs, then kick them up to shoulder level as you lean back.',
    bodyAlignment: 'Shoulder blades retracted and pressed against the bench, feet planted firmly on the floor.',
    movementSteps: [
      'Start with dumbbells just outside your upper chest, palms angled slightly inward at 45 degrees.',
      'Press the dumbbells upward toward each other in a slight triangle path, stopping just short of touching.',
      'Squeeze the upper chest at the top.',
      'Lower the dumbbells with control until you feel a comfortable stretch across the chest.'
    ],
    breathing: 'Inhale as you lower the dumbbells; exhale as you press upward.',
    postureCues: [
      'A 30-degree incline targets the upper chest best without shifting excessive stress onto the front deltoids.',
      'Tuck elbows roughly 45 degrees relative to your torso.',
      'Control the descent to avoid overstretching the shoulder joint.'
    ],
    commonMistakes: [
      'Setting the bench too steep (60 degrees turns it into a shoulder press).',
      'Clanging the dumbbells together violently at the top.',
      'Allowing elbows to flare straight out.'
    ],
    injuryPreventionTips: [
      'Do not drop the dumbbells at the end of the set; bring your knees up to meet the dumbbells and sit forward.'
    ],
    beginnerAlternative: 'Machine Incline Chest Press',
    homeAlternative: 'Decline Push-Ups (feet elevated on chair or bed)',
    videoSearchQuery: 'incline dumbbell press proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'machine-chest-press',
    name: 'Machine Chest Press',
    primaryMuscle: 'chest',
    secondaryMuscles: ['triceps', 'front shoulders'],
    targetMuscleDisplay: 'Chest (Safe Stable Hypertrophy)',
    equipment: 'machine',
    equipmentDisplay: 'Seated Chest Press Machine',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-12',
    restSeconds: 75,
    daySplit: 'wednesday',
    setup: 'Adjust the seat height so the machine handles align horizontally with mid-to-lower chest level. Select an appropriate weight pin.',
    bodyAlignment: 'Back and head pressed firmly against the back pad, feet flat on the floor.',
    movementSteps: [
      'Grasp handles with an overhand grip.',
      'Press the handles forward smoothly until arms are extended (do not aggressively lock elbows).',
      'Contract your chest muscles intensely.',
      'Return the handles slowly until you feel a full pectoral stretch without letting the weight stack touch down.'
    ],
    breathing: 'Exhale while pressing outward; inhale as the handles return backward.',
    postureCues: [
      'Keep shoulder blades pinned to the pad so your chest does the work instead of your shoulders rolling forward.',
      'Great for beginners to learn pressing mechanics without balance worries.'
    ],
    commonMistakes: [
      'Seat height set too low (handles at neck level, stressing shoulders).',
      'Letting the weight stack slam at the end of every rep.'
    ],
    injuryPreventionTips: [
      'Use the foot pedal lever (if equipped) to ease the handles forward into the starting position.'
    ],
    beginnerAlternative: 'Standard Machine Press with light weight',
    homeAlternative: 'Floor Dumbbell Press or Knee Push-Ups',
    videoSearchQuery: 'machine chest press proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'cable-fly',
    name: 'Cable Fly',
    primaryMuscle: 'chest',
    secondaryMuscles: ['anterior deltoids', 'inner chest sensation'],
    targetMuscleDisplay: 'Pectoralis Major (Tension in Squeeze)',
    equipment: 'cable',
    equipmentDisplay: 'Dual Cable Pulley Station',
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '12-15',
    restSeconds: 60,
    daySplit: 'wednesday',
    setup: 'Set pulleys at chest or shoulder height. Take a handle in each hand, step forward into a staggered stance for balance, and hold handles out with a slight bend in your elbows.',
    bodyAlignment: 'Torso leaned slightly forward, core engaged, chest puffed up.',
    movementSteps: [
      'Keeping the slight bend in your elbows fixed, bring your hands together in front of your chest in a hugging motion.',
      'Squeeze your chest together hard when your hands meet.',
      'Slowly open your arms back outward until you feel a comfortable chest stretch.'
    ],
    breathing: 'Exhale as you bring your hands together; inhale as you open your arms back up.',
    postureCues: [
      'Imagine hugging a large tree trunk.',
      'Do not turn this into a press—keep the elbow angle constant throughout.',
      'Maintain steady torso posture without rocking.'
    ],
    commonMistakes: [
      'Bending and pressing with the triceps.',
      'Stretching the arms too far behind the body plane (strains front shoulder capsule).'
    ],
    injuryPreventionTips: [
      'Stop the backward stretch when your elbows reach roughly the level of your torso.'
    ],
    beginnerAlternative: 'Pec Deck Machine Fly',
    homeAlternative: 'Resistance Band Chest Fly anchored to a door post',
    videoSearchQuery: 'standing cable fly proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'push-ups',
    name: 'Push-Ups',
    primaryMuscle: 'chest',
    secondaryMuscles: ['triceps', 'anterior deltoids', 'core & abs', 'serratus'],
    targetMuscleDisplay: 'Overall Chest & Calisthenic Core',
    equipment: 'bodyweight',
    equipmentDisplay: 'Floor / Exercise Mat',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-15 or to form failure',
    restSeconds: 60,
    daySplit: 'wednesday',
    setup: 'Place your hands on the floor slightly wider than shoulder-width, fingers spread forward. Extend your legs behind you onto your toes.',
    bodyAlignment: 'Create a rigid plank from head to heels. Squeeze your glutes and pull your belly button inward.',
    movementSteps: [
      'Lower your entire body in one solid piece by bending your elbows until your chest is 1-2 inches from the floor.',
      'Keep elbows at a 45-degree angle to your ribs (arrow shape, not T shape).',
      'Press through the floor to push yourself back up to the top plank position.'
    ],
    breathing: 'Inhale as you lower down; exhale as you push the ground away.',
    postureCues: [
      'Keep your neck neutral—do not let your head sag toward the floor.',
      'Do not allow your hips to sag or pike up into an inverted V.',
      'Full range of motion beats sloppy half-reps every time.'
    ],
    commonMistakes: [
      'Sagging lower back (lumbar extension from weak core engagement).',
      'Elbows flaring straight out to the sides at 90 degrees.'
    ],
    injuryPreventionTips: [
      'If you cannot perform standard push-ups with strict form, do incline push-ups with hands elevated on a bench or sturdy counter rather than sloppy knee push-ups.'
    ],
    beginnerAlternative: 'Incline Push-Ups on Bench / Wall Push-Ups',
    homeAlternative: 'Standard Floor Push-Ups',
    videoSearchQuery: 'perfect push up proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'pec-deck-fly',
    name: 'Pec Deck Fly (Machine Fly)',
    primaryMuscle: 'chest',
    secondaryMuscles: ['anterior deltoids'],
    targetMuscleDisplay: 'Pectoralis Major Isolation',
    equipment: 'machine',
    equipmentDisplay: 'Pec Deck / Butterfly Machine',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '12-15',
    restSeconds: 60,
    daySplit: 'wednesday',
    setup: 'Adjust the seat height so the machine handles or arm pads align directly with mid-chest level. Sit all the way back against the pad.',
    bodyAlignment: 'Upper back and head flat against backrest, chest lifted, feet flat on the ground.',
    movementSteps: [
      'Grasp handles with elbows slightly bent.',
      'Bring the handles together in a controlled arc in front of your chest.',
      'Hold the contraction and squeeze your inner chest for 1-2 seconds.',
      'Slowly reverse the motion until your elbows are even with your shoulders.'
    ],
    breathing: 'Exhale as you bring handles together; inhale as you slowly return to the open position.',
    postureCues: [
      'Do not allow your shoulders to shrug upward or round forward at peak contraction.',
      'Keep wrists firm and elbows slightly soft.'
    ],
    commonMistakes: [
      'Allowing the weight to stretch your arms too far back behind the torso.',
      'Using body momentum or leaning forward off the pad.'
    ],
    injuryPreventionTips: [
      'Set the machine range-of-motion limiter so it does not overstretch the anterior shoulder capsule at the start.'
    ],
    beginnerAlternative: 'Light Dumbbell Floor Fly',
    homeAlternative: 'Resistance Band Fly',
    videoSearchQuery: 'pec deck fly proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },

  // ==================== THURSDAY: TRICEPS (6 Exercises) ====================
  {
    id: 'cable-triceps-pushdown',
    name: 'Cable Triceps Pushdown',
    primaryMuscle: 'triceps',
    secondaryMuscles: ['lateral & medial triceps heads', 'forearms'],
    targetMuscleDisplay: 'Triceps Lateral & Medial Heads',
    equipment: 'cable',
    equipmentDisplay: 'High Cable Pulley & Straight Bar or V-Bar',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-12',
    restSeconds: 60,
    daySplit: 'thursday',
    setup: 'Attach a straight bar or V-bar to a high pulley. Stand with feet hip-width apart and hinge slightly forward at the hips. Grasp the bar with an overhand grip.',
    bodyAlignment: 'Pin your elbows firmly against the sides of your torso. They should act solely as hinges.',
    movementSteps: [
      'Start with forearms parallel to the floor or slightly higher.',
      'Push the bar downward until your arms are fully extended straight toward the floor.',
      'Lock out smoothly and squeeze your triceps for 1 count.',
      'Slowly allow the bar to rise back to 90 degrees while keeping your elbows stationary.'
    ],
    breathing: 'Exhale as you push the bar down; inhale as you release it upward.',
    postureCues: [
      'Do not let your elbows drift forward and backward like a pendulum.',
      'Keep wrists neutral—do not bend your wrists down into flexion.',
      'Stand close enough to keep the cable running in a straight line.'
    ],
    commonMistakes: [
      'Using shoulder momentum and letting elbows flare away from ribs.',
      'Leaning your upper body heavily on top of the bar to cheat the weight.'
    ],
    injuryPreventionTips: [
      'Keep the movement controlled. If your elbows hurt, switch from a straight bar to a rope attachment or V-bar to relieve wrist and elbow joint torque.'
    ],
    beginnerAlternative: 'Rope Pushdown with lighter resistance',
    homeAlternative: 'Resistance Band Triceps Pushdown tied to door top',
    videoSearchQuery: 'cable tricep pushdown proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'overhead-cable-triceps-extension',
    name: 'Overhead Cable Triceps Extension',
    primaryMuscle: 'triceps',
    secondaryMuscles: ['long head of triceps'],
    targetMuscleDisplay: 'Triceps Long Head (Peak Stretch)',
    equipment: 'cable',
    equipmentDisplay: 'Cable Pulley & Rope Attachment',
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '10-12',
    restSeconds: 75,
    daySplit: 'thursday',
    setup: 'Set cable to mid-chest or high level with rope attachment. Grab the rope, turn your back to the machine, and take a staggered stance, leaning forward at 45 degrees.',
    bodyAlignment: 'Upper arms positioned alongside your ears, core braced to prevent arching your lower back.',
    movementSteps: [
      'Bend elbows behind your head to feel a deep stretch in the triceps long head.',
      'Extend your elbows forward and overhead, pulling the rope handles apart at full lockout.',
      'Hold the peak contraction for 1 second.',
      'Carefully bend your elbows back into the deep stretch under control.'
    ],
    breathing: 'Exhale as you press the rope overhead; inhale as you let it stretch back behind your head.',
    postureCues: [
      'Keep your upper arms stationary—only the forearms should move.',
      'Separate the rope ends at full extension for extra tricep contraction.'
    ],
    commonMistakes: [
      'Flaring elbows excessively wide.',
      'Arching lower back heavily to assist the weight.'
    ],
    injuryPreventionTips: [
      'Because the long head attaches to the scapula, overhead extensions provide the maximum hypertrophy stretch. Warm up elbows thoroughly first.'
    ],
    beginnerAlternative: 'Seated Cable Overhead Extension',
    homeAlternative: 'Resistance Band Overhead Extension',
    videoSearchQuery: 'overhead cable tricep extension form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'dumbbell-overhead-triceps-extension',
    name: 'Dumbbell Overhead Triceps Extension',
    primaryMuscle: 'triceps',
    secondaryMuscles: ['long head of triceps'],
    targetMuscleDisplay: 'Triceps Long Head (Overhead Free Weight)',
    equipment: 'dumbbell',
    equipmentDisplay: 'Single Dumbbell & Flat/Utility Bench',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-12',
    restSeconds: 75,
    daySplit: 'thursday',
    setup: 'Sit on a sturdy bench. Cup the top inner plate of a single dumbbell with both hands in a diamond shape. Lift the dumbbell overhead at arms length.',
    bodyAlignment: 'Sit tall, chest up, core braced, feet planted on the floor.',
    movementSteps: [
      'Keeping upper arms close to your ears, lower the dumbbell behind your head by bending only at the elbows.',
      'Lower until your forearms pass parallel or you feel a comfortable stretch.',
      'Press the dumbbell back up smoothly to full arm extension.',
      'Contract triceps at the top.'
    ],
    breathing: 'Inhale as you lower the dumbbell behind your head; exhale as you press it back overhead.',
    postureCues: [
      'Keep your elbows pointed forward and as tucked as your shoulder mobility allows.',
      'Avoid clinking the dumbbell against your neck or back of head.'
    ],
    commonMistakes: [
      'Letting elbows flare completely out to the sides.',
      'Over-arching the lumbar spine.'
    ],
    injuryPreventionTips: [
      'Ensure a secure diamond grip with thumbs wrapped so the dumbbell cannot slip.'
    ],
    beginnerAlternative: 'Two-hand light Dumbbell or Seated Incline Tricep Extension',
    homeAlternative: 'Filled Water Bottle Two-Hand Overhead Extension',
    videoSearchQuery: 'seated dumbbell overhead tricep extension form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'close-grip-push-up',
    name: 'Close-Grip Push-Up (Diamond / Narrow)',
    primaryMuscle: 'triceps',
    secondaryMuscles: ['inner chest', 'anterior deltoids', 'core'],
    targetMuscleDisplay: 'Triceps & Pressing Power',
    equipment: 'bodyweight',
    equipmentDisplay: 'Floor / Exercise Mat',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '8-12',
    restSeconds: 60,
    daySplit: 'thursday',
    setup: 'Assume a push-up plank position with hands positioned inside shoulder-width (roughly 6-8 inches apart or thumbs touching).',
    bodyAlignment: 'Rigid body line from head to heels, glutes squeezed, core braced.',
    movementSteps: [
      'Lower your chest toward your hands while keeping your elbows tucked tightly against your ribs.',
      'Lower until your chest lightly touches or hovers above your hands.',
      'Push forcefully through your palms, feeling the triceps drive the lockout.'
    ],
    breathing: 'Inhale on the descent; exhale as you push up.',
    postureCues: [
      'Keep elbows grazing your sides rather than flaring out.',
      'If diamond hand placement hurts your wrists, widen hands slightly to shoulder-width with fingers pointed forward.'
    ],
    commonMistakes: [
      'Extreme diamond shape that strains the wrist joint in inflexible beginners.',
      'Sagging hips or lower back.'
    ],
    injuryPreventionTips: [
      'Elevate hands on a bench or wall if floor narrow push-ups create excessive wrist strain.'
    ],
    beginnerAlternative: 'Incline Narrow Push-Up on Bench',
    homeAlternative: 'Standard Narrow Push-Up on floor or sturdy table',
    videoSearchQuery: 'close grip narrow push up proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'assisted-dip',
    name: 'Assisted Dip (or Parallel Bar Dip)',
    primaryMuscle: 'triceps',
    secondaryMuscles: ['lower chest', 'anterior deltoids'],
    targetMuscleDisplay: 'Triceps Mass & Dip Variation',
    equipment: 'machine',
    equipmentDisplay: 'Assisted Dip Machine (or Dip Station / Bench)',
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '8-10',
    restSeconds: 90,
    daySplit: 'thursday',
    setup: 'Set the pin on the assisted dip machine (remember: more weight = more assistance/easier). Place your knees or feet on the pad and grip the parallel bars.',
    bodyAlignment: 'Keep your torso upright (to focus on triceps) rather than leaning deeply forward (which shifts emphasis to chest).',
    movementSteps: [
      'Start with arms fully extended supporting your weight.',
      'Lower yourself slowly by bending elbows until upper arms are roughly parallel to the floor (around 90-degree elbow bend).',
      'Press through the heels of your palms to push back up to straight arms.',
      'Squeeze the triceps at the top.'
    ],
    breathing: 'Inhale on the way down; exhale as you drive yourself up.',
    postureCues: [
      'Keep your torso as upright as possible to isolate the triceps.',
      'Keep elbows tracking backward, not flaring out.',
      'Do not dip deeper than 90 degrees if you have shoulder discomfort.'
    ],
    commonMistakes: [
      'Dipping way too deep and stressing the anterior shoulder capsule.',
      'Shrugging shoulders into the neck at the bottom.'
    ],
    injuryPreventionTips: [
      'Stop at a 90-degree elbow bend. Going below 90 degrees places excessive sheer force on the acromioclavicular (AC) joint.'
    ],
    beginnerAlternative: 'Bench Dips with feet flat on the floor',
    homeAlternative: 'Chair or Sturdy Bench Dips with knees bent',
    videoSearchQuery: 'assisted dip machine form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'dumbbell-triceps-kickback',
    name: 'Dumbbell Triceps Kickback',
    primaryMuscle: 'triceps',
    secondaryMuscles: ['lateral head of triceps', 'rear deltoids'],
    targetMuscleDisplay: 'Triceps Peak Contraction',
    equipment: 'dumbbell',
    equipmentDisplay: 'Flat Bench & Dumbbell',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '12-15',
    restSeconds: 60,
    daySplit: 'thursday',
    setup: 'Place your left knee and left hand on a bench with a flat back. Hold a light dumbbell in your right hand. Pull your right upper arm up parallel to your torso.',
    bodyAlignment: 'Upper arm glued parallel to torso, spine flat, neck neutral.',
    movementSteps: [
      'Keep your upper arm completely frozen.',
      'Extend your forearm backward until your entire arm is locked straight parallel to the floor.',
      'Squeeze the tricep intensely at peak contraction for 1 full second.',
      'Slowly bend your elbow back to a 90-degree angle without letting your upper arm drop.'
    ],
    breathing: 'Exhale as you kick the dumbbell back; inhale as you return to 90 degrees.',
    postureCues: [
      'The upper arm must never swing. Only the elbow moves.',
      'Use light weight—this is an isolation squeeze exercise, not a power lift.'
    ],
    commonMistakes: [
      'Swinging the upper arm like a pendulum.',
      'Using a dumbbell so heavy you cannot pause at peak extension.'
    ],
    injuryPreventionTips: [
      'Do not drop your shoulder or twist your spine. Keep your back flat.'
    ],
    beginnerAlternative: 'Cable Triceps Kickback',
    homeAlternative: 'Resistance Band Kickback anchored forward',
    videoSearchQuery: 'dumbbell tricep kickback proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },

  // ==================== FRIDAY: SHOULDERS + ABS (6 Exercises) ====================
  {
    id: 'seated-dumbbell-shoulder-press',
    name: 'Seated Dumbbell Shoulder Press',
    primaryMuscle: 'shoulders',
    secondaryMuscles: ['anterior deltoids', 'lateral deltoids', 'triceps', 'upper traps'],
    targetMuscleDisplay: 'Anterior & Medial Deltoids',
    equipment: 'dumbbell',
    equipmentDisplay: 'Adjustable Bench (Set to 75-85°) & Dumbbells',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '8-10',
    restSeconds: 90,
    daySplit: 'friday',
    setup: 'Set the bench nearly upright (around 75-85 degrees is gentler on the shoulders than a rigid 90 degrees). Kick dumbbells up to shoulder level with palms facing forward or slightly angled inward.',
    bodyAlignment: 'Back and head against the pad, feet firmly planted, core engaged.',
    movementSteps: [
      'Start with dumbbells at chin/ear height with elbows directly under wrists.',
      'Press the dumbbells overhead in a smooth arc until your arms are extended overhead.',
      'Do not clang the dumbbells together at the top.',
      'Lower the weights under control back to ear level over 2-3 seconds.'
    ],
    breathing: 'Inhale on the descent; exhale as you press overhead.',
    postureCues: [
      'Angle elbows forward roughly 20-30 degrees into the scapular plane (never press with elbows flared straight out).',
      'Note: Because yesterday (Thursday) was Triceps day, your triceps may feel fatigued. Select a manageable weight and focus on shoulder drive.',
      'Do not hyperextend or arch your lower back away from the bench.'
    ],
    commonMistakes: [
      'Pressing with elbows flared directly in line with ears (strains rotator cuff).',
      'Arching lower back heavily off the bench.'
    ],
    injuryPreventionTips: [
      'A slight 75-80 degree back angle allows proper scapular mechanics and prevents shoulder impingement.'
    ],
    beginnerAlternative: 'Seated Machine Shoulder Press',
    homeAlternative: 'Pike Push-Ups or Resistance Band Overhead Press',
    videoSearchQuery: 'seated dumbbell shoulder press proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'dumbbell-lateral-raise',
    name: 'Dumbbell Lateral Raise',
    primaryMuscle: 'shoulders',
    secondaryMuscles: ['lateral deltoid (side delt)', 'supraspinatus', 'upper traps'],
    targetMuscleDisplay: 'Lateral Deltoids (Shoulder Width)',
    equipment: 'dumbbell',
    equipmentDisplay: 'Pair of Light Dumbbells',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '12-15',
    restSeconds: 60,
    daySplit: 'friday',
    setup: 'Stand upright holding light dumbbells at your sides, palms facing inward. Hinge forward at the hips by just 5-10 degrees.',
    bodyAlignment: 'Athletic stance, slight bend in knees, core braced.',
    movementSteps: [
      'With elbows slightly bent (about 10-15 degrees), raise your arms out to the sides in the scapular plane (slightly forward of your torso).',
      'Raise until your elbows are at shoulder height.',
      'Lead with your elbows and keep wrists neutral.',
      'Lower the dumbbells slowly under control over 2-3 seconds.'
    ],
    breathing: 'Exhale as you raise the dumbbells; inhale on the slow descent.',
    postureCues: [
      'Think of pouring water from a pitcher or pushing your knuckles out toward the walls.',
      'Do not shrug your traps up toward your ears.',
      'Keep the weights light—ego lifting here only works the traps and damages rotator cuffs.'
    ],
    commonMistakes: [
      'Swinging hips and back to fling heavy dumbbells up.',
      'Lifting hands higher than elbows (removes tension from lateral delt).',
      'Raising straight out in a harsh T-plane.'
    ],
    injuryPreventionTips: [
      'Always raise in the scapular plane (roughly 30 degrees forward of your collarbone line) to avoid pinching the supraspinatus tendon.'
    ],
    beginnerAlternative: 'Cable Lateral Raise or Band Lateral Raise',
    homeAlternative: 'Water Bottle Lateral Raises with strict 3-second eccentric tempo',
    videoSearchQuery: 'dumbbell lateral raise proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'reverse-pec-deck',
    name: 'Reverse Pec Deck (Rear Delt Fly)',
    primaryMuscle: 'shoulders',
    secondaryMuscles: ['posterior deltoid (rear delt)', 'rhomboids', 'trapezius'],
    targetMuscleDisplay: 'Posterior Deltoids (Rear Shoulders)',
    equipment: 'machine',
    equipmentDisplay: 'Reverse Pec Deck / Rear Delt Machine',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '12-15',
    restSeconds: 60,
    daySplit: 'friday',
    setup: 'Sit facing the machine pad with your chest firmly supported. Adjust seat so the handles are at shoulder height. Grasp the neutral or horizontal handles.',
    bodyAlignment: 'Chest pressed to pad, spine neutral, slight bend in elbows.',
    movementSteps: [
      'With elbows softly unlocked, push the handles backward and outward in a wide arc.',
      'Squeeze the rear delts behind your shoulders as your arms reach the side plane.',
      'Pause for 1 second at full contraction.',
      'Slowly return the handles forward without letting the weight stack crash.'
    ],
    breathing: 'Exhale as you fly backward; inhale as you return forward.',
    postureCues: [
      'Keep your chest pinned against the pad to prevent cheating.',
      'Drive with the back of your shoulders, not by squeezing shoulder blades excessively together at the start.'
    ],
    commonMistakes: [
      'Shrugging shoulders into ears.',
      'Using momentum and slamming the weight stack.'
    ],
    injuryPreventionTips: [
      'Rear deltoid work is essential for posture balance against all the chest pressing done on Wednesday.'
    ],
    beginnerAlternative: 'Bent-Over Dumbbell Rear Delt Fly',
    homeAlternative: 'Resistance Band Pull-Apart with palms facing down',
    videoSearchQuery: 'reverse pec deck rear delt fly form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'cable-face-pull',
    name: 'Cable Face Pull',
    primaryMuscle: 'shoulders',
    secondaryMuscles: ['rear deltoids', 'rotator cuff (infraspinatus, teres minor)', 'rhomboids'],
    targetMuscleDisplay: 'Rear Delts & Rotator Cuff Health',
    equipment: 'cable',
    equipmentDisplay: 'Cable Pulley & Rope Attachment',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '12-15',
    restSeconds: 60,
    daySplit: 'friday',
    setup: 'Set the pulley to eye or upper-chest level with a rope attachment. Grasp the rope with a thumbs-backward overhand grip.',
    bodyAlignment: 'Step back into a staggered stance, upright posture, core engaged.',
    movementSteps: [
      'Pull the center of the rope directly toward your bridge of the nose or forehead.',
      'Simultaneously rotate your hands outward and backward so your knuckles face behind you (external rotation).',
      'Hold the contraction and feel your upper back and rear shoulders working.',
      'Slowly extend arms forward back to the starting stretch.'
    ],
    breathing: 'Exhale as you pull to your face; inhale as arms return forward.',
    postureCues: [
      'Think "double bicep pose" at the finish—elbows high and wide, hands rotated back.',
      'Crucial exercise for bulletproofing shoulders and fixing rounded desk posture.'
    ],
    commonMistakes: [
      'Pulling too low to the neck or chest (turns it into an upright row).',
      'Using way too much weight and leaning backward.'
    ],
    injuryPreventionTips: [
      'Keep weights moderate to allow full external rotation at the end of the pull.'
    ],
    beginnerAlternative: 'Resistance Band Face Pull',
    homeAlternative: 'Resistance Band Face Pull anchored to high door',
    videoSearchQuery: 'cable face pull proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'plank',
    name: 'Forearm Plank',
    primaryMuscle: 'abs',
    secondaryMuscles: ['transverse abdominis', 'glutes', 'obliques', 'lower back'],
    targetMuscleDisplay: 'Deep Core & Lumbar Stability',
    equipment: 'bodyweight',
    equipmentDisplay: 'Floor / Exercise Mat',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '30-45 seconds hold',
    restSeconds: 60,
    daySplit: 'friday',
    setup: 'Lie face down on an exercise mat. Place your forearms on the floor with elbows directly below your shoulders. Tuck toes under.',
    bodyAlignment: 'Raise your body so you form a straight, rigid line from head to heels.',
    movementSteps: [
      'Contract your abdominal muscles as if anticipating a punch.',
      'Squeeze your glutes and quads firmly to maintain pelvic stability.',
      'Hold the position without letting your hips sag or hike into the air.',
      'Breathe steadily throughout the hold.'
    ],
    breathing: 'Never hold your breath! Take slow, rhythmic breaths while keeping core braced.',
    postureCues: [
      'Tuck your pelvis slightly under (posterior pelvic tilt) to engage the abs and protect the lower back.',
      'Look down at the floor just past your hands to keep your neck neutral.'
    ],
    commonMistakes: [
      'Sagging hips (strains lower back discs).',
      'Hiking buttocks high in the air to escape core tension.',
      'Holding your breath.'
    ],
    injuryPreventionTips: [
      'If your lower back starts aching during a plank, stop immediately. It means your abs have fatigued and your spine is taking the load.'
    ],
    beginnerAlternative: 'Knee Plank (plank supported on knees)',
    homeAlternative: 'Standard Floor Plank',
    videoSearchQuery: 'forearm plank proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    primaryMuscle: 'abs',
    secondaryMuscles: ['rectus abdominis', 'obliques', 'hip flexors'],
    targetMuscleDisplay: 'Anterior Core & Anti-Extension',
    equipment: 'bodyweight',
    equipmentDisplay: 'Floor / Exercise Mat',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-12 reps per side',
    restSeconds: 60,
    daySplit: 'friday',
    setup: 'Lie flat on your back on a mat. Raise your arms straight up toward the ceiling. Lift your legs and bend your knees at a 90-degree angle (tabletop position).',
    bodyAlignment: 'Press your lower back flat into the floor—there should be zero gap between your lower back and the mat.',
    movementSteps: [
      'Slowly lower your right arm backward overhead while simultaneously extending your left leg straight out hovering just above the floor.',
      'Keep your lower back glued firmly to the floor throughout the reach.',
      'Return to the starting tabletop position.',
      'Repeat with your left arm and right leg in an alternating rhythm.'
    ],
    breathing: 'Exhale as you reach arm and opposite leg away; inhale as you return to center.',
    postureCues: [
      'If your lower back begins to arch off the floor, do not extend your leg as low.',
      'Move slowly and with total control—this is about precision stability.'
    ],
    commonMistakes: [
      'Letting the lower back arch up off the mat.',
      'Rushing through reps quickly.'
    ],
    injuryPreventionTips: [
      'One of the safest, most spine-friendly core exercises approved by physical therapists.'
    ],
    beginnerAlternative: 'Reverse Crunch on floor or Dead Bug with arms only',
    homeAlternative: 'Floor Dead Bug / Reverse Crunch',
    videoSearchQuery: 'dead bug exercise proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },

  // ==================== SATURDAY: LEGS (6 Exercises) ====================
  {
    id: 'squat',
    name: 'Squat (Barbell Back Squat / Goblet Squat)',
    primaryMuscle: 'legs',
    secondaryMuscles: ['quadriceps', 'glutes', 'hamstrings', 'adductors', 'core'],
    targetMuscleDisplay: 'Quadriceps, Glutes & Lower Body Power',
    equipment: 'barbell',
    equipmentDisplay: 'Squat Rack & Barbell (or Dumbbell for Goblet Squat)',
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '8-10',
    restSeconds: 120,
    daySplit: 'saturday',
    setup: 'Step under the barbell, resting it across your upper traps (high bar) or across rear delts (low bar). Grip the bar firmly. Unrack and take 2-3 calculated steps back. Set feet slightly wider than shoulder-width with toes angled outward 15-30 degrees.',
    bodyAlignment: 'Chest up, spine neutral, core braced 360 degrees, weight distributed evenly across your tripod foot (big toe, pinky toe, heel).',
    movementSteps: [
      'Take a deep breath into your belly and brace your core.',
      'Break simultaneously at the hips and knees, sitting down and back as if aiming for a chair between your heels.',
      'Descend until your hip crease drops to or just below parallel with your knee tops.',
      'Drive the floor away through your mid-foot, extending hips and knees evenly back to standing.'
    ],
    breathing: 'Inhale and brace core at the top; hold breath during descent; exhale forcefully as you drive up through the sticking point.',
    postureCues: [
      'Keep your knees tracking in the exact same direction as your toes—never let knees cave inward (valgus collapse).',
      'Keep your heels firmly on the ground.',
      'Maintain an upright chest without rounding your lumbar spine ("butt wink").'
    ],
    commonMistakes: [
      'Knees collapsing inward on the way up.',
      'Heels lifting off the ground (poor ankle mobility).',
      'Cutting depth to do quarter squats with way too much weight.'
    ],
    injuryPreventionTips: [
      'Beginners should start with Goblet Squats holding a dumbbell at chest height before loading a barbell on the back.',
      'Always set the safety spotter bars inside the rack at just below your parallel depth.'
    ],
    beginnerAlternative: 'Goblet Squat with Dumbbell or Bodyweight Box Squat',
    homeAlternative: 'Bodyweight Air Squats or Backpack Goblet Squats',
    videoSearchQuery: 'how to squat properly form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'leg-press',
    name: 'Leg Press (or Goblet Squat)',
    primaryMuscle: 'legs',
    secondaryMuscles: ['quadriceps', 'glutes', 'calves'],
    targetMuscleDisplay: 'Quadriceps & Glute Hypertrophy',
    equipment: 'machine',
    equipmentDisplay: '45-Degree Leg Press Machine',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-12',
    restSeconds: 90,
    daySplit: 'saturday',
    setup: 'Sit in the leg press machine with your lower back and hips pressed completely flush into the backrest. Place feet shoulder-width in the middle of the sled platform.',
    bodyAlignment: 'Spine fully supported, knees tracking in line with toes, hands gripping the side handles.',
    movementSteps: [
      'Disengage the safety handles by extending the sled slightly.',
      'Lower the sled platform slowly by bending your knees until they reach approximately a 90-degree angle.',
      'Ensure your lower back and tailbone do not curl up off the seat pad.',
      'Press through the mid-foot and heels to push the platform back up, stopping just short of hyperextending knees.'
    ],
    breathing: 'Inhale as the sled lowers toward you; exhale as you push the sled upward.',
    postureCues: [
      'NEVER lock your knees straight out violently at the top (can cause catastrophic knee hyperextension).',
      'Keep your pelvis glued to the seat—if your butt lifts, you are lowering the sled too deep for your mobility.'
    ],
    commonMistakes: [
      'Locking knees forcefully at top.',
      'Letting the pelvis roll off the seat pad (causes acute lumbar disc herniation).',
      'Placing hands on knees to push.'
    ],
    injuryPreventionTips: [
      'Always leave a soft, micro-bend in your knees at the top lockout.'
    ],
    beginnerAlternative: 'Goblet Squat or Bodyweight Wall Sit',
    homeAlternative: 'Step-Ups on a sturdy chair or box',
    videoSearchQuery: 'leg press machine proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift (RDL)',
    primaryMuscle: 'legs',
    secondaryMuscles: ['hamstrings', 'glutes', 'erector spinae', 'core', 'grip'],
    targetMuscleDisplay: 'Hamstrings & Posterior Chain',
    equipment: 'barbell',
    equipmentDisplay: 'Barbell or Pair of Dumbbells',
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '8-10',
    restSeconds: 90,
    daySplit: 'saturday',
    setup: 'Stand holding a barbell or dumbbells at thigh level with an overhand grip. Feet hip-width apart with a soft 15-degree bend in your knees.',
    bodyAlignment: 'Shoulders retracted, chest up, neutral neck, soft bend in knees fixed throughout the movement.',
    movementSteps: [
      'Keeping the knee angle fixed, push your hips directly backward as if trying to touch the wall behind you with your glutes.',
      'Slide the weights down close against your thighs and shins.',
      'Descend until you feel a profound stretch in your hamstrings (usually just below kneecaps or mid-shin).',
      'Drive your hips forward and squeeze your glutes at the top to return to standing.'
    ],
    breathing: 'Inhale and brace core as you hinge back; exhale as hips drive forward to lock out.',
    postureCues: [
      'This is a HIP HINGE, not a squat. Your knees should not bend forward.',
      'Keep the weights grazing against your legs to protect your lower back.',
      'Keep your back flat as a tabletop—do not round your spine.'
    ],
    commonMistakes: [
      'Rounding the lower back to reach lower to the floor.',
      'Turning it into a squat by bending knees forward.',
      'Looking up into the mirror (hyperextends the neck).'
    ],
    injuryPreventionTips: [
      'Stop lowering the moment your hips stop traveling backward. Reaching further just rounds your spine.'
    ],
    beginnerAlternative: 'Dumbbell Romanian Deadlift with light weights',
    homeAlternative: 'Dumbbell or Backpack Romanian Deadlift',
    videoSearchQuery: 'romanian deadlift rdl proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'leg-curl',
    name: 'Leg Curl (Lying or Seated)',
    primaryMuscle: 'legs',
    secondaryMuscles: ['hamstrings (biceps femoris, semitendinosus)', 'gastrocnemius'],
    targetMuscleDisplay: 'Hamstring Knee-Flexion Isolation',
    equipment: 'machine',
    equipmentDisplay: 'Lying or Seated Hamstring Curl Machine',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-12',
    restSeconds: 75,
    daySplit: 'saturday',
    setup: 'Lie prone or sit in the machine. Adjust the roller pad so it rests on the lower calves just beneath the calves and above the Achilles tendon. Align your knee joint with the machine pivot.',
    bodyAlignment: 'Torso secured against the pad, hands holding side handles firmly.',
    movementSteps: [
      'Curl the roller pad smoothly toward your glutes by flexing at the knees.',
      'Contract your hamstrings hard at peak bend for 1 second.',
      'Slowly release the weight over 2-3 seconds until legs are nearly straight.'
    ],
    breathing: 'Exhale as you curl your legs up; inhale as you slowly extend them back.',
    postureCues: [
      'Keep your hips down against the bench—do not let your butt lift up into the air on lying curls.',
      'Point your toes slightly forward (dorsiflexion) to maximize hamstring tension.'
    ],
    commonMistakes: [
      'Arching lower back and lifting hips off the bench pad.',
      'Kicking the weight up with momentum.'
    ],
    injuryPreventionTips: [
      'Control the lowering phase to protect the distal hamstring tendon.'
    ],
    beginnerAlternative: 'Single Leg Hamstring Curl Machine',
    homeAlternative: 'Floor Hamstring Slide Curls with socks on tile or Swiss Ball Curls',
    videoSearchQuery: 'seated lying leg curl proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'calf-raise',
    name: 'Calf Raise (Standing or Seated)',
    primaryMuscle: 'legs',
    secondaryMuscles: ['gastrocnemius', 'soleus', 'Achilles tendon'],
    targetMuscleDisplay: 'Calves (Gastrocnemius & Soleus)',
    equipment: 'machine',
    equipmentDisplay: 'Standing Calf Machine or Leg Press or Elevated Step with Dumbbells',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '15-20',
    restSeconds: 60,
    daySplit: 'saturday',
    setup: 'Step onto the calf raise block with the balls of your feet on the edge and heels hanging off. Shoulder pads resting comfortably on your shoulders (or seated with knee pad).',
    bodyAlignment: 'Legs straight with soft knees, spine upright, core tight.',
    movementSteps: [
      'Lower your heels deep below the step until you feel a deep, full calf stretch.',
      'Pause at the bottom stretch for 1 full second to eliminate Achilles elastic bounce.',
      'Drive up through the balls of your big toes onto tiptoes as high as possible.',
      'Hold the contraction at the peak for 1 second before lowering slowly.'
    ],
    breathing: 'Exhale as you rise onto toes; inhale as you lower your heels.',
    postureCues: [
      'Pause at the bottom stretch! Calves are spring-loaded; bouncing reps trains the tendon instead of growing muscle.',
      'Push through the big toe knuckle, not the outside of the foot.'
    ],
    commonMistakes: [
      'Rapidly bouncing up and down without pauses.',
      'Bending the knees to bounce the weight up.'
    ],
    injuryPreventionTips: [
      'Stretch calves gently after workouts to prevent nighttime cramps, especially in hot weather.'
    ],
    beginnerAlternative: 'Single-Leg Bodyweight Calf Raise on Stairs',
    homeAlternative: 'Stair Step Single Leg Calf Raises',
    videoSearchQuery: 'standing calf raise proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  },
  {
    id: 'split-squat',
    name: 'Split Squat (or Bulgarian Split Squat / Walking Lunge)',
    primaryMuscle: 'legs',
    secondaryMuscles: ['quadriceps', 'glutes', 'hamstrings', 'adductors', 'core stability'],
    targetMuscleDisplay: 'Unilateral Quads & Glute Balance',
    equipment: 'dumbbell',
    equipmentDisplay: 'Pair of Light Dumbbells or Bodyweight',
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '8-10 each leg',
    restSeconds: 75,
    daySplit: 'saturday',
    setup: 'Take a long stride forward so feet are staggered front-to-back about 3-4 feet apart. Keep feet hip-width apart side-to-side (like on train tracks, not a tightrope). Hold dumbbells at sides.',
    bodyAlignment: 'Torso upright or slightly leaned forward from the hips, chest high, eyes forward.',
    movementSteps: [
      'Lower your body straight down by bending both knees until your back knee hovers 1 inch above the floor.',
      'Both knees should reach approximately 90-degree angles.',
      'Push through the front heel and midfoot to return to the top position.',
      'Complete all reps for one leg, then switch.'
    ],
    breathing: 'Inhale as you descend; exhale as you push back up.',
    postureCues: [
      'Keep your front knee tracking over your second toe—do not let it cave inward.',
      'Drive mostly through your front leg; the back leg is merely an anchor.',
      'Unilateral work corrects muscle imbalances between left and right sides.'
    ],
    commonMistakes: [
      'Stance too narrow side-to-side, losing balance.',
      'Banging the back knee hard onto the floor.'
    ],
    injuryPreventionTips: [
      'Place a foam mat under the rear knee for safety. If balance is tough, hold onto a rack or wall with one hand.'
    ],
    beginnerAlternative: 'Static Bodyweight Split Squat or Reverse Lunge',
    homeAlternative: 'Walking Lunges across hallway or room',
    videoSearchQuery: 'split squat proper form tutorial',
    videoSource: 'YouTube Instructional',
    isVerifiedEmbed: false
  }
];

export const WORKOUT_DAYS = [
  { dayKey: 'monday', label: 'Monday', title: 'Back Focus', target: 'Back, Lats & Spinal Erectors' },
  { dayKey: 'tuesday', label: 'Tuesday', title: 'Biceps Focus', target: 'Biceps Brachii & Forearms' },
  { dayKey: 'wednesday', label: 'Wednesday', title: 'Chest Focus', target: 'Pectorals & Triceps assist' },
  { dayKey: 'thursday', label: 'Thursday', title: 'Triceps Focus', target: 'Triceps Heads (Long, Lateral, Medial)' },
  { dayKey: 'friday', label: 'Friday', title: 'Shoulders + Abs', target: 'Deltoids, Rotator Cuff & Core' },
  { dayKey: 'saturday', label: 'Saturday', title: 'Legs Focus', target: 'Quads, Hamstrings, Glutes & Calves' },
  { dayKey: 'sunday', label: 'Sunday', title: 'Rest & Recovery', target: 'Active Recovery, Mobility & Sleep' },
] as const;
