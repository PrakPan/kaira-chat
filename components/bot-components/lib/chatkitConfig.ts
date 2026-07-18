import { StartScreenPrompt, ToolOption } from "@openai/chatkit";

export const readEnvString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;

export const CHATKIT_API_URL = "https://chat.tarzanway.com/chatkit" ?? "/chatkit";

/**
 * ChatKit requires a domain key at runtime. Use the local fallback while
 * developing, and register a production domain key for deployment:
 * https://platform.openai.com/settings/organization/security/domain-allowlist
 */
export const CHATKIT_API_DOMAIN_KEY =
  "domain_pk_696754fadf1c8195819b97790bc86f6201e83d8d7d8fa747";



export const DEFAULT_START_SCREEN_PROMPTS = [
  {
    label: "Beach & Spa vacation",
    prompt: "Help me plan a relaxing beach vacation with spa treatments",
    icon: "sparkle",
  },
  {
    label: "Bali relaxation plan",
    prompt: "Create a peaceful retreat itinerary for Bali focusing on scenic spots and relaxation",
    icon: "maps",
  },
  {
    label: "Adventure trip",
    prompt: "Plan an adventure trip with thrilling outdoor activities",
    icon: "globe",
  },
];
