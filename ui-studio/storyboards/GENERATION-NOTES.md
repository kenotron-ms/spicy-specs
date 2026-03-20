# Storyboard Generation Notes

## V9 — The Successful Prompt

What worked: **separating reference images by role** in the prompt. Each reference image is labelled explicitly so the model knows what to take from each one — and what to ignore.

### Prompt

```
Reference image 1 (V7) = the LAYOUT TEMPLATE. Take everything structural from this:
the arrangement of screens on the canvas, the size and proportions of each screen frame,
the flow arrows connecting screens, the overall storyboard composition. This is your
compositional blueprint — reproduce it exactly.

Reference image 2 (V8) = the DESIGN SYSTEM only — ignore its screen sizes and layout
entirely. Take only the visual language: crimson red header, aged parchment backgrounds,
ornamental Victorian typography, vintage hot sauce label cards, pepper heat ratings,
gold filigree, sepia diagrams.

Reference image 3 = the extracted header component. Match this for the header design
inside each screen.

Reference image 4 = the extracted card component. Match this for the card design on
the library screen.

Produce V9: reproduce V7's storyboard layout and screen proportions exactly, but replace
every visual element with V8's design language. Same screens, same sizes, same flow
arrows as V7 — but dressed in V8's hot sauce aesthetic throughout.
```

### Reference images (in order)

| Position | File | Role |
|----------|------|------|
| 1 | `ui-studio/storyboards/spicy-specs-v7.png` | Layout blueprint — screen sizes, proportions, flow arrows |
| 2 | `ui-studio/storyboards/spicy-specs-v8.png` | Design system — colors, typography, components |
| 3 | `ui-studio/components/header.png` | Extracted header component anchor |
| 4 | `ui-studio/components/card.png` | Extracted card component anchor |

---

## Key Learnings

### What caused failures

- **Passing v8 as the only reference** → model reproduced the full v8 storyboard verbatim (wrong screen sizes)
- **Passing v8 without role labelling** → model treated it as a composition template, not just a design source
- **Saying "extract the header" with v8 as reference** → model copied the entire storyboard with header overlaid on top
- **Removing v8 as reference entirely** → lost design fidelity

### What made V9 work

1. **Role-labelled references** — each reference image has an explicit role in the prompt, including what to ignore
2. **Extracted component anchors** — passing isolated `header.png` and `card.png` gave the model clean design targets without the full storyboard composition interfering
3. **Two-concern framing** — layout (v7) and design (v8) are treated as separate concerns with separate references
4. **Explicit "ignore" instructions** — telling the model what NOT to take from v8 was as important as what to take

### Component extraction pattern

To extract a component from a storyboard:

1. Describe the source as a storyboard — "the reference image is a storyboard showing multiple screens"
2. Name the component and its location — "isolate the header bar that appears at the top of each screen"
3. Use the extracted output as its own re-generation reference to get a clean crop
4. Do NOT pass the full storyboard as reference when zooming/enhancing a single component — it will reproduce the full storyboard

### Nano-banana reference image behaviour

- Reference images are treated as strong **compositional** signals, not just style signals
- Complex multi-screen layouts in references tend to get reproduced as the output composition
- Isolated component references give more predictable, targeted results
- When references conflict, the prompt must explicitly resolve the conflict by assigning roles to each image
