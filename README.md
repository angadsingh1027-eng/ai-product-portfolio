# AI Product Portfolio

Create a clean, white, minimal personal portfolio for an AI Product Manager using React, TypeScript and Tailwind. Pages: Home, Work (with a case-study detail page), Builds, Writing, Journey, Proof, Contact. Do not hardcode any copy: load all text from JSON and markdown files in a /content folder using Vite's import.meta.glob. Use one accent colour as a Tailwind token and a serif headline font. Case pages start with a 5-line Leader Brief and a Proof row of links, then the body. Include a locked 'Depth' block on case pages and on Journey role entries that shows a password field and, on submit, calls a URL read from the VITE_GATE_API_URL environment variable (use a placeholder; do not build the backend). Mobile-first.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7fab9314-27eb-43f5-8973-ba0810a2e9c5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
