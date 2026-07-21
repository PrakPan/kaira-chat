import dynamic from "next/dynamic";

// BotApp is a heavily interactive, browser-only application. Its render output
// intentionally diverges by viewport (`isMobile`, which is always false during
// SSR and resolves to the real value only on the client) and it relies on
// browser APIs throughout, so server-rendering it produces unavoidable
// hydration mismatches — with zero SEO benefit, since the chat UI contains no
// indexable content.
//
// Wrapping only this component in `dynamic(..., { ssr: false })` (per SEO ticket
// 1.1) keeps the surrounding page fully server-rendered — the <Head> title,
// meta, canonical and JSON-LD are unaffected — while the bot itself mounts on
// the client. Pages import this wrapper in place of BotApp.
const BotAppClient = dynamic(() => import("./BotApp"), { ssr: false });

export default BotAppClient;
