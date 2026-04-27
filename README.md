# Neural Voice Assistant (VoiceFlow)

VoiceFlow is a telephony-backed voice assistant that handles inbound calls, transcribes speech through Twilio, and drives dialogue with OpenAI. A Flask API coordinates webhooks, conversation storage, and authenticated admin APIs. A React (Vite) frontend provides a public site and an admin experience for content and call-related data.

PostgreSQL holds application and conversation data. JWT-based authentication protects admin routes.

## Features

- **Programmable voice** — Twilio Voice webhooks and TwiML for call flow and speech capture  
- **LLM responses** — OpenAI integration for natural language replies  
- **Persistence** — PostgreSQL for users, site content, and conversation records  
- **Admin and public UI** — React 19, Vite, Tailwind CSS; admin tools for site sections and operational views  
- **Health checks** — `/health` and lightweight status routes on the API  

## Tech stack

| Area | Technologies |
|------|----------------|
| API | Python 3, Flask, Flask-CORS, Gunicorn |
| Telephony & AI | Twilio Voice, OpenAI |
| Data | PostgreSQL (`psycopg2`), JWT (`PyJWT`) |
| Frontend | React, React Router, Vite, Tailwind CSS |
| Config | `python-dotenv`; see `backend/.env-example` and `frontend/.env-example` |

## Repository layout

```
neural-voice-assistant/
├── backend/           # Flask app (entry: main.py)
├── frontend/          # Vite + React SPA
├── conversations/     # Conversation artifacts (as generated at runtime)
├── docs/              # Deployment, env, nginx, SSL, dependency notes
├── requirements.txt   # Python dependencies
├── CODE_OF_CONDUCT.md
└── LICENSE
```

## Local development

1. **Python environment** — Create a virtual environment, activate it, then install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

2. **Environment variables** — Copy `backend/.env-example` to `backend/.env` and set Twilio, OpenAI, database, and JWT values as described in [docs/ENV.md](docs/ENV.md).

3. **Database** — Ensure PostgreSQL is reachable with the credentials in `.env`, and apply any SQL migrations or schema scripts your deployment expects (see `backend/database/`).

4. **Run the API** — From the `backend` directory:

   ```bash
   python main.py
   ```

   The default development server listens on port **5001**. For Twilio callbacks from the public internet, use a tunnel (for example ngrok) to that port.

5. **Run the frontend** — From the `frontend` directory:

   ```bash
   npm install
   npm run dev
   ```

   Point the frontend at your API base URL via `frontend/.env` as needed.

## Documentation

| Document | Purpose |
|----------|---------|
| [docs/BACKEND.md](docs/BACKEND.md) | Backend updates and process notes |
| [docs/FRONTEND.md](docs/FRONTEND.md) | Frontend build and deploy steps |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deployment overview |
| [docs/ENV.md](docs/ENV.md) | Environment variable workflow |
| [docs/DEPS.md](docs/DEPS.md), [docs/BACKEND-DEPS.md](docs/BACKEND-DEPS.md) | Dependency notes |
| [docs/NGINX.md](docs/NGINX.md), [docs/SSL.md](docs/SSL.md) | Reverse proxy and TLS |

## Call flow (high level)

1. Twilio receives an inbound call and posts to the Flask webhook under `/twilio`.  
2. Audio is handled per Twilio’s speech pipeline; transcripts are processed in application code.  
3. OpenAI (and related services) generate or shape the next response.  
4. Results and metadata are persisted in PostgreSQL where applicable.  

## Contributing

Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## License

See [LICENSE](LICENSE).
