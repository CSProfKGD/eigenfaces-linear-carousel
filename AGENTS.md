# Eigenfaces Demo — Working Notes

## Product intent

This project is a premium, single-page educational visualization of eigenfaces and principal component analysis. It must make the linear-algebra idea tangible without presenting itself as face recognition, identification, classification, or biometric software.

Preserve the sparse Apple Keynote character established by the sibling `Dolly Zoom demo`: a continuous near-black presentation stage, near-white type, cool muted labels, cyan interaction states, warm-gold emphasis, hairline separators, generous negative space, and restrained motion. Every visual element must either explain the reconstruction or improve control clarity.

The eventual site is for non-commercial educational use. Follow the FFHQ attribution and share-alike requirements recorded in `context.md`.

## Non-negotiable composition

- Keep the primary working surface visible in the first desktop viewport.
- The upper-left hero reads `Eigenfaces` with the subtitle `Face It: It’s Just Linear Algebra`.
- Center one dominant reconstructed-face stage after the hero's full title-and-subtitle block; it must not overlap the hero vertically.
- Keep `Reconstruction` at the left of the figure topline and place the clearly visible reset action at its right as unboxed cyan text with a cyan reset symbol. Beneath the image, show only `Variance retained` and the interactive `Dimensions` value so the expanding dimensions control cannot collide with reset.
- Place one full-width looping linear carousel beneath the reconstruction. Its reading order is the mean face followed by eigenfaces 1–24 in decreasing explained-variance order.
- The centered slide is largest, adjacent slides progressively recede, and outer slides fade without creating a perspective gimmick.
- The average-face slide is informational and never presents a weight control.
- The carousel opens with the average face centered.
- The 24 eigenface slides are the exposed weight controls. A separate dimensions control selects a reconstruction prefix from 1–1000 components and defaults to 512; never reconstruct from only the visible components.
- On narrow screens, preserve the order hero, reconstruction, carousel and show three slides with edge peeks without horizontal page scrolling.

## Interaction model

- The centered eigenface reveals its signed weight control when a pointer enters the bottom half or when any of its controls receive keyboard focus. Hovering the upper half leaves the image unobscured.
- Tapping or clicking a non-centered slide centers it. Touch users reveal the centered slide's control with a tap, then drag its native range input.
- The carousel never auto-advances. It moves only in response to direct user input.
- Support pointer drag, touch swipe, click-to-center, and Left/Right arrow navigation without a visible carousel control row. Preserve velocity-sensitive momentum on faster swipes while settling exactly on a centered slide.
- Slider movement updates the reconstruction on the same interaction frame. Do not animate, debounce, or ease direct manipulation.
- Treat the revealed weight-control surface as a strict carousel no-drag zone so horizontal slider gestures never move the surrounding carousel.
- Show the current signed weight in a compact tabular-numeral readout.
- Provide one clearly discoverable reset action that restores all 24 exposed weights to their original projected values.
- Reset must restore the exact baseline reconstruction. It must not re-run PCA or modify hidden weights.
- The dimensions value reveals a minimal 1–1000 range control on hover, focus, or tap. It updates the reconstruction and actual cumulative explained variance immediately and defaults to 512.
- Disable nonessential scaling transitions under `prefers-reduced-motion`.

## Architecture boundaries

- Keep dataset acquisition, portrait preprocessing, PCA fitting, component selection, projection, and asset export in an offline pipeline.
- Keep the browser experience deterministic and static: load precomputed prefix reconstructions, retain the selected prefix and 24 adjustable weights in local React state, and render from the selected prefix plus applicable exposed-component deltas.
- Do not download FFHQ, fit PCA, detect landmarks, or process the source HEIC in the browser.
- Treat `context.md` as the source of truth for preprocessing, PCA math, selected-component rules, and generated asset contracts.
- Centralize reconstruction math in a framework-independent module. UI components must not independently implement PCA calculations.
- Store the source portrait outside the public web bundle. Only the deliberately processed grayscale visualization asset may be included in the future site.
- Never use the supplied portrait, its reconstruction, or a recognizable derivative in Open Graph or other social-preview imagery.

## Visual system

- Use a near-black background (`#000` or the Dolly Zoom demo's equivalent), near-white foreground type, and muted cool grays.
- Reserve cyan for focus, active sliders, and mathematical interaction. Use warm gold sparingly for the reconstruction result or a single high-value emphasis.
- Use the system Apple font stack; do not add web fonts. Set numeric values with tabular figures.
- Favor square image stages, hairline borders at low opacity, precise alignment, and minimal corner rounding.
- Keep component imagery grayscale. Eigenface thumbnails must use a shared, symmetric mid-gray normalization so their signs remain visually comparable.
- Keep every component label readable by sampling the thumbnail behind its left and right caption regions and choosing the higher-contrast light or dark text treatment. The mean card is labelled `Mean` without a redundant mathematical symbol.
- Avoid generic dashboard cards, gradients used only as decoration, oversized pills, ornamental illustrations, and unnecessary explanatory copy.
- Scale slides only with compositor transforms so neighboring slides never jump or reflow.

## Accessibility

- Use semantic headings, buttons, figures, and native range inputs.
- Give every slider an accessible name that includes its component number and describes that it changes the reconstruction.
- Make hover-only information equally available through keyboard focus and touch.
- Preserve visible, high-contrast focus indicators and a logical reading/tab order: hero context, reconstruction controls, mean, then components 1–24.
- Provide text alternatives for the average face, each eigenface, and the reconstructed output without claiming the output identifies the subject.
- Maintain usable targets and legible values at mobile sizes and at 200% zoom.

## Data, licensing, and privacy

- Use only the deterministic FFHQ subset and derived artifacts described in `context.md`.
- Retain dataset attribution, the FFHQ paper citation, modification disclosure, and the applicable non-commercial/share-alike terms in the project provenance artifact; do not add a visible page footer unless the product specification changes.
- Describe the feature as an educational PCA reconstruction. Do not add identity labels, similarity scores, recognition claims, or demographic inference.
- Do not commit the raw FFHQ corpus, the FFHQ metadata archive, or the original HEIC portrait.
- Do not log, upload, or transmit face pixels from the eventual client application.

## Verification

When implementation exists, run the repository's test, lint, and production-build scripts. Tests must cover the PCA and interaction invariants in `context.md`. Verify the interface at desktop, tablet, and mobile widths, with keyboard-only input, touch input, reduced motion, and 200% zoom.

Compare the finished page against the Dolly Zoom demo for hierarchy, type scale, spacing, palette, alignment, motion restraint, and first-viewport density. Match its visual quality, not its camera-specific layout or behavior.
