---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.

## Agnostic Naming — Non-Negotiable

Every identifier — token, component, file, constant, CSS variable, hook, type — must describe
**role or function**, never a project name, client name, or business domain.

**The rule:** names describe WHAT something does. Values carry the brand/project identity.

```ts
// ✅ Correct — role-based, portable across any project
brandColor.primary      = '#C0392B'
brandColor.accent       = '#F5C000'
brandColor.dark         = '#1A1A1A'
spacing.md              = '1.5rem'
<HeroSection />
useAuth()
UserRepository

// ❌ Wrong — coupled to a specific project or client
brandColor.soverumPrimary   = '#C0392B'
brandColor.corfRed          = '#8B0000'
brandColor.acmeCorporateBlue = '#003087'
<SoverumHeroSection />
useCorfAuth()
CorfUserRepository
```

This applies universally:
- **Design tokens**: `primary`, `accent`, `dark`, `surface`, `muted` — not `clientnamePrimary`
- **Components**: `HeroSection`, `FeatureCard`, `CTASection` — not `ProjectNameHero`
- **Hooks**: `useAuth`, `useLogin`, `useUsers` — not `useSoverumAuth`
- **Constants**: `ROUTES`, `ROLES`, `AUTH_COOKIE_NAME` — not `SOVERUM_ROUTES`
- **Types/interfaces**: `UserEntity`, `AuthPayload` — not `SoverumUser`
- **CSS variables**: `--color-primary`, `--font-display` — not `--soverum-red`
- **Files**: `user.repository.ts`, `hero-section.styled.ts` — not `soverum-hero.styled.ts`

**Why:** When the project is cloned or the client changes, only the **values** change — never the
names. Components, hooks, and tokens remain reusable without renaming. This is what makes an
architecture truly agnostic and a starter actually replicable.

## Visual QA with agent-browser

After implementing any frontend component or page, validate visually using `agent-browser` (Vercel Labs CLI — installed globally):

```bash
# Start dev server first, then:
agent-browser open http://localhost:3000
agent-browser screenshot --full --annotate   # labeled screenshot for review
agent-browser scroll down 800
agent-browser screenshot --full              # capture below-fold sections

# Responsive check
agent-browser set viewport 375 812          # mobile
agent-browser screenshot
agent-browser set viewport 1280 800         # desktop
agent-browser screenshot
```

**When to use:**
- After implementing or updating any page or section
- After applying design tokens / color changes
- When verifying hover states, spacing, and typography at real scale
- Before reporting a UI task as complete

**Key commands for design review:**
- `agent-browser snapshot -i` — accessibility tree of interactive elements
- `agent-browser screenshot --annotate` — numbered labels overlay (useful for iteration feedback)
- `agent-browser eval "document.documentElement.computedStyle"` — verify CSS variables applied
- `agent-browser find role button` — confirm all CTAs are reachable

**Note on brand-specified fonts:** When a project has a defined corporate identity (e.g. Roboto, Inter, or a custom font from a brand guide), that overrides the general creative direction. Brand consistency trumps stylistic variety for client work.