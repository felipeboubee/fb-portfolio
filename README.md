# Felipe Boubee — Portfolio

A professional portfolio built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**.

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, social links, selected work |
| `/about` | About — bio + at-a-glance facts |
| `/projects` | Projects grid, filterable by discipline |
| `/projects/[slug]` | Project write-up as an engineering decision record (problem, approach, trade-offs, discipline detail, what I'd do differently) |
| `/ee-mindmap` | Interactive EE Mind Map — **unlisted**, reachable by direct URL only |
| `/admin` | Project entry generator, with per-discipline templates (not linked in site nav) |

Projects are categorised as **automation**, **robotics**, **electronics** or
**digital design**, and each carries an honest status — `complete`,
`in-progress` or `planned`. Anything not complete says so on the page.

See `CLAUDE.md` for the data model, conventions and the gotchas worth knowing
before editing.

## Color Palettes Used

- **Blues** (palette 30636): `#096192`, `#1171ba`, `#1399c6`, `#24aae2`, `#0e8c7f`
- **Neutrals** (palette 18976): `#1f222b`, `#8f9294`, `#a4bcc4`, `#d9e0e2`, `#f4f3f3`

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Deployed on Vercel
