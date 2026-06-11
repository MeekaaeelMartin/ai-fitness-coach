export type PostTemplate = "welcome" | "seasonal" | "motivation" | "pricing" | "challenge" | "brand";
export type PostFormat = "square" | "portrait" | "story";

export interface GeneratedPostContent {
  template: PostTemplate;
  format: PostFormat;
  badge: string;
  headline: string;
  subheadline: string;
  body: string;
  footer: string;
  caption: string;
  hashtags: string[];
}

const BASE_HASHTAGS = [
  "#AIFitnessCoach",
  "#FitnessSA",
  "#SouthAfrica",
  "#WorkoutPlan",
  "#MealPlan",
  "#FitnessMotivation",
  "#TrainSmart",
  "#HealthyLiving",
];

function pickTemplate(prompt: string): PostTemplate {
  const p = prompt.toLowerCase();
  if (/welcome|hello|intro|launch|new/.test(p)) return "welcome";
  if (/december|january|february|march|april|may|june|july|august|september|october|november|summer|winter|spring|season|month|holiday|festive|new year/.test(p)) return "seasonal";
  if (/price|pricing|offer|subscribe|r500|plan|deal|afford/.test(p)) return "pricing";
  if (/challenge|30 day|programme|program|transform|goal/.test(p)) return "challenge";
  if (/motivat|tip|mindset|quote|inspire|discipline|consistency/.test(p)) return "motivation";
  return "brand";
}

function monthLabel(): string {
  return new Date().toLocaleDateString("en-ZA", { month: "long" });
}

function buildContent(prompt: string, format: PostFormat): GeneratedPostContent {
  const template = pickTemplate(prompt);
  const month = monthLabel();
  const p = prompt.trim();

  const defaults: Record<PostTemplate, Omit<GeneratedPostContent, "template" | "format" | "caption" | "hashtags">> = {
    welcome: {
      badge: "🇿🇦 Built for South Africans",
      headline: "Welcome to AI Fitness Coach",
      subheadline: "Your plan. Your budget. Your schedule.",
      body: "Personalised workouts and meal plans in Rands. Start for free and train smarter from day one.",
      footer: "aifitnesscoach.co.za",
    },
    seasonal: {
      badge: `${month} Fitness`,
      headline: `${month} Goals Start Now`,
      subheadline: "Don't wait for Monday. Start today.",
      body: p.length > 10 ? p : `Make ${month} the month you commit. Custom workouts, meals in your budget, and daily tracking.`,
      footer: "Start for free · From R500/month",
    },
    motivation: {
      badge: "Daily Motivation",
      headline: "Show Up For Yourself",
      subheadline: "Small steps. Real results.",
      body: p.length > 10 ? p : "Consistency beats perfection. Log your workouts, track your meals, and earn points as you progress.",
      footer: "AI Fitness Coach",
    },
    pricing: {
      badge: "Simple Pricing",
      headline: "Start Free. Train Smart.",
      subheadline: "R500/month for full access",
      body: "Personalised workouts, meal plans, progress tracking, and exports. Priced in Rands for South Africans.",
      footer: "No credit card to start",
    },
    challenge: {
      badge: "30-Day Challenge",
      headline: "Your Challenge Starts Today",
      subheadline: "Workouts + meals + tracking",
      body: p.length > 10 ? p : "Take the assessment, get your plan, and track every workout and meal. Earn points and level up.",
      footer: "Join thousands training with us",
    },
    brand: {
      badge: "AI Fitness Coach",
      headline: "Train Smarter. Eat Better.",
      subheadline: "Personalised for your life",
      body: p.length > 10 ? p : "Workouts matched to your equipment. Meals within your budget. Built for South Africa.",
      footer: "🇿🇦 Start for free today",
    },
  };

  const content = defaults[template];
  const extraTags =
    template === "seasonal"
      ? [`#${month}Fitness`, "#SummerBody", "#NewYearNewMe"]
      : template === "pricing"
        ? ["#AffordableFitness", "#FitnessApp"]
        : template === "welcome"
          ? ["#Welcome", "#NewMembers"]
          : [];

  const hashtags = [...new Set([...BASE_HASHTAGS, ...extraTags])].slice(0, 12);

  const caption = [
    content.headline,
    "",
    content.body,
    "",
    content.subheadline,
    "",
    "👉 Start your free plan at aifitnesscoach.co.za",
    "",
    hashtags.join(" "),
  ].join("\n");

  return { template, format, ...content, caption, hashtags };
}

export function generatePostFromPrompt(prompt: string, format: PostFormat = "square"): GeneratedPostContent {
  return buildContent(prompt, format);
}

export const POST_DIMENSIONS: Record<PostFormat, { width: number; height: number }> = {
  square: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
};
