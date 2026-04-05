# ClayPortal Sora Demo Brief

## What to make

Create a short brand-film style demo for ClayPortal.

Goal:
- show that ClayPortal builds custom AI software for companies
- feel premium, clean, and product-led
- match the current landing page: mostly white, strong black contrast, minimal copy

Best format:
- 16:9
- 12 to 15 seconds
- 1080p if your Sora plan supports it
- ambient sound only
- no dialogue

## Important constraint

Do not rely on Sora for precise readable UI text.

Use Sora for:
- motion
- lighting
- atmosphere
- premium product-film framing

Use real screen capture in edit for:
- dashboards
- tables
- readable product states
- exact branded UI

## Recommended Sora setup

Use the Sora Video Editor on web with:
- aspect ratio: `16:9`
- duration: `14s`
- variations: `2`
- camera motion: slow dolly, slow pan, no whip moves
- style: premium SaaS brand film

If you use Storyboard, split it into 4 beats:
- `0s - 3s`
- `3s - 7s`
- `7s - 11s`
- `11s - 14s`

## Master prompt

```text
Create a premium 14-second launch film for a software company called ClayPortal that builds custom AI solutions for companies.

Visual style: clean white environments, black contrast surfaces, soft daylight, subtle shadows, minimal composition, premium SaaS brand film, polished enterprise feel, understated and confident, modern product cinematography.

Show a sequence of elegant product-led scenes:

Scene 1: a bright white workspace with a large desktop display and a minimal web application interface visible from a slight angle, soft morning light, calm camera dolly, refined materials, no clutter.

Scene 2: close-up product shots of clean interface cards, charts, and workflow panels sliding into place on a screen, crisp reflections, shallow depth of field, smooth motion, premium enterprise software aesthetic.

Scene 3: a strong black contrast environment with floating product surfaces and subtle analytics panels, dramatic but minimal, soft highlights, premium composition, controlled motion.

Scene 4: return to a bright white setting with a final composed product frame that feels ready for a homepage hero section, generous whitespace, centered composition, elegant finish.

Keep the film minimal and expensive-looking. No people. No robots. No neon cyberpunk. No purple glow. No sci-fi holograms. No busy office scenes. No exaggerated futuristic effects. No dense text inside the interface. Leave clean surfaces for post-production titles.

Color direction: white, warm off-white, charcoal, soft gray, small hints of muted blue only if needed.

Motion direction: slow, smooth, deliberate, premium.

The final result should feel like a world-class SaaS launch video for a company selling custom AI software to businesses.
```

## Storyboard version

Use this if you want tighter control in Storyboard.

### Card 1: `0s - 3s`

```text
Bright white studio-like workspace, large monitor with a clean enterprise web application, soft daylight, slow cinematic dolly, premium product commercial look, minimal scene, no readable UI text.
```

### Card 2: `3s - 7s`

```text
Macro product shots of interface modules and workflow panels moving smoothly into place, crisp reflections, shallow depth of field, elegant SaaS visuals, no people, no clutter.
```

### Card 3: `7s - 11s`

```text
Dark charcoal contrast environment with premium software panels suspended in space, subtle analytics surfaces, controlled motion, dramatic but restrained lighting, luxury enterprise software mood.
```

### Card 4: `11s - 14s`

```text
Return to a bright white homepage-ready composition with a polished product frame centered in the scene, spacious layout, premium brand-film finish, calm ending.
```

## Remix prompt

Use this after the first generation if the result is too generic:

```text
Make it more minimal, more premium, and more product-led. Reduce visual noise. Remove generic AI imagery. Keep the environment mostly white with one strong dark contrast section. Make the composition feel like a top-tier SaaS homepage video.
```

## Negative direction

Avoid:
- robots
- humanoid AI imagery
- stock-office scenes
- smiling teams around laptops
- bright neon colors
- purple gradients
- busy futuristic interfaces
- unreadable fake text dominating the frame
- fast motion

## Edit plan after export

After you export the best Sora clip:
- cut it down to `10s - 14s`
- overlay 2 to 4 short text beats in post
- optionally replace one or two frames with real ClayPortal screen capture
- export final MP4 as:

`public/demo/clayportal-sora-demo.mp4`

Optional poster:

`public/demo/clayportal-sora-demo.jpg`

## Suggested title overlays

Keep overlays very short:
- `Custom AI`
- `Built for the company`
- `Portals`
- `Operations`
- `Workflows`

## Sources

- https://openai.com/sora/
- https://help.openai.com/en/articles/9957612-generating-videos-on-sora
