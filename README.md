# The Transformer — IGCSE Physics Lab

An interactive, 3D IGCSE Physics presentation for syllabus point **4.5.6: The Transformer**.

## Run locally

The easiest option launches the local site and opens it in your browser:

```bash
python main.py
```

It prints the exact local URL, normally `http://127.0.0.1:5173/` (or the next available port).

Alternatively:

```bash
npm install
npm run dev
```

Create a production-ready static build with:

```bash
npm run build
```

Deploy the generated `dist/` folder to Netlify or any static host.

## Included interactions

- Procedural React Three Fiber transformer with orbit, zoom and pan controls
- Clickable primary coil, secondary coil, soft-iron core, terminals and magnetic field
- Exploded and X-ray views
- Step-up / step-down visual changeover
- Animated AC, magnetic-field and output-voltage representation
- Live calculators for turns ratio, ideal transformer power and transmission cable losses
- Eight syllabus sections, presentation mode and a final master simulation
