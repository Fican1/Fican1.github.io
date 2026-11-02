# Jintao Li - Academic Homepage

Personal academic website for Jintao Li (李锦韬), a Ph.D. student at the Shenzhen Institute for Advanced Study, University of Electronic Science and Technology of China.

## Content

- Research focus: intelligent optimization, with applications in analog EDA and LLM post-training
- Independent analog-layout work: animated landing feature, NMCNR/TCFC view explorer, and an on-demand workflow video
- Selected and complete publication lists
- Analog-IC EDA software stack and self-evolving circuit-design agent projects
- Honors, education, research experience, public contact information, and downloadable CV

## Publishing

The included GitHub Actions workflow builds the Jekyll site and deploys it to GitHub Pages on every push to `main`. For a personal site, name the GitHub repository `<username>.github.io`; the published address will be `https://<username>.github.io`.

The public Google Scholar profile is [Jintao Li](https://scholar.google.com/citations?user=UB4DY3EAAAAJ). Citation crawling remains manual. To enable it, add a `GOOGLE_SCHOLAR_ID` repository secret and run the `Get Citation Data` workflow.

## Layout media

The bilingual landing feature and layout explorer use `_includes/layout-landing.html`, `_includes/layout-explorer.html`, `assets/css/layout-showcase.css`, and `assets/js/layout-showcase.js`. Media files live in `assets/media/layout/`: two amplifier circuits, eight looping WebM views per circuit, WebP poster frames, and the full NMCNR MP4 workflow. Only the visible animation loads initially; the full video loads when opened. Autoplay respects reduced-motion preferences, and videos pause when offscreen or when the browser tab is hidden.

The layout work is presented independently of the Analog-IC Copilot and circuit-design agent projects. Placement and routing are the primary demonstration. The layer-separation view illustrates the process layers of a planar layout; it does not represent stacked dies or 3D integration.

## Template and license

This site is based on [AcadHomepage](https://github.com/RayeRen/acad-homepage.github.io), which is derived from Academic Pages / Minimal Mistakes. The upstream MIT license is retained in `LICENSE`.
