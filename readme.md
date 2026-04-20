Design a modern, production-grade e-commerce UI using React + Tailwind CSS + shadcn/ui components.

Follow these strict design rules:

1. Theme & Colors:

* Use a soft neutral base with:

  * Background: bg-muted/40 (page background)
  * Surfaces: bg-background (cards, sections)
  * Borders: subtle border (border class)
  * Text:

    * Primary: text-foreground
    * Secondary: text-muted-foreground
* Accent color: warm orange (#D85A30)

  * Use for primary buttons, highlights, and active states
* Do NOT use random colors (no blue, no hardcoded gray, etc.)

2. Layout System:

* Use clean spacing and consistent structure:

  * Page padding: px-6 py-10
  * Container: max-w-6xl mx-auto
  * Cards: rounded-xl border bg-background p-6
* Use flex and grid layouts (responsive first)

3. Typography:

* Headings: text-xl or text-2xl font-medium tracking-tight
* Labels: text-xs text-muted-foreground
* Body text: text-sm
* Keep everything minimal and clean (no heavy bold everywhere)

4. Components (shadcn style):

* Buttons:

  * Primary: bg-orange-600 hover:bg-orange-700 text-white
  * Secondary: outline variant
* Use:

  * Card
  * Avatar
  * Badge
  * Input
  * Button
* Use lucide-react icons where appropriate (small, subtle)

5. Design Style:

* Minimal, clean, and modern (like shadcn or Vercel UI)
* Soft shadows or no shadows (prefer border-based design)
* No gradients unless explicitly needed
* No clutter — spacing is more important than decoration

6. UX Rules:

* Center important content when needed
* Use loading states (spinner or skeleton)
* Keep interactions simple and fast

7. Dark Mode Ready:

* Use semantic Tailwind classes (bg-background, text-foreground, etc.)
* Avoid hardcoded colors so dark mode works automatically

8. Consistency:

* All pages must look like part of the same system
* Same spacing, colors, borders, and typography everywhere

Now generate the UI for: [INSERT PAGE / COMPONENT HERE]

Do NOT explain anything. Only output clean code.
