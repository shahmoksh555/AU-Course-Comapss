# AU Course Compass

AU Course Compass is a course discovery and recommendation tool for Ahmedabad University students. It helps students explore Winter 2027 course offerings, find courses that fit their academic context and interests, and save courses to a personal shortlist.

## Features

- **Adaptive course matcher:** Answer a short survey about your goals, academic background, and course preferences to receive ranked recommendations.
- **Curated collections:** Browse course lists organized around broad learning and career themes.
- **Course search and filters:** Search by course code, course title, or school, and filter by school and credit load.
- **Course details:** Open a course to review its available information.
- **Personal shortlist:** Save and remove courses from a shortlist. The shortlist is persisted in the current browser using local storage.
- **Curriculum-aware eligibility:** Uses curriculum data and Winter 2027 offerings to filter courses based on the student's context.

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React icons
- Google GenAI SDK (included as a project dependency)

## Getting started

### Requirements

- Node.js and npm
- A terminal

### 1. Clone the repository

```bash
git clone https://github.com/shahmoksh555/AU-Course-Comapss.git
cd AU-Course-Comapss
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables (if needed)

The repository includes an `.env.example` file with placeholders for `GEMINI_API_KEY` and `APP_URL`. If you run features that require these values locally, create a `.env` file and provide your own values. Do not commit real API keys or other secrets.

### 4. Start the development server

```bash
npm run dev
```

Vite prints the local URL in the terminal when the server starts.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server on port 3000. |
| `npm run build` | Builds the production app. |
| `npm run preview` | Serves the production build locally for preview. |
| `npm run lint` | Runs TypeScript checks with `tsc --noEmit`. |

## Project structure

```text
.
├── src/
│   ├── components/       # App views and reusable UI components
│   ├── data/             # Course, curriculum, and curated collection data
│   ├── types/            # TypeScript types
│   ├── utils/            # Course eligibility and recommendation logic
│   ├── App.tsx           # Main app and navigation state
│   ├── index.css         # Global styles
│   └── main.tsx          # App entry point
├── .env.example          # Example environment variable names
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## How recommendations work

The course engine uses the student's academic context, selected course category, and survey responses to determine eligible courses and rank recommendations. Course and curriculum information is maintained in the project's data files. The Explore view separately supports browsing and filtering the Winter 2027 catalog.

## Shortlist storage

Saved courses are stored in the browser's local storage under the key `course_compass_shortlist_v2`. This means the shortlist is local to that browser and is not automatically shared across devices or users.

## Notes

- Course availability and curriculum rules are based on the data currently included in this repository. Verify details with official Ahmedabad University sources before making registration decisions.
- Never add credentials, API keys, or other secrets to source control.

## Contributing

1. Create a branch for your change.
2. Make a focused change and run the relevant checks.
3. Open a pull request describing the change and how it was checked.

## License

No license is specified in this repository at the time of writing. Contact the repository owner before reusing or redistributing the code.
