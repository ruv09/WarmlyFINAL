# Warmly backend (без ИИ)

Минимальный backend для изучения приложения и его возможностей.

## Запуск

```bash
cd backend
npm install
npm run dev
```

Сервер стартует на `http://localhost:4000`.

## Эндпоинты

- `GET /health`
- `GET /api/quote/today`
- `POST /api/mood` body: `{ "mood": "bad|normal|good" }`
- `GET /api/favorites`
- `POST /api/favorites` body: `{ "text": "..." }`
- `DELETE /api/favorites` body: `{ "text": "..." }`
- `GET /api/settings`
- `PUT /api/settings` body: `{ "notifications": true, "morning": "08:00" }`

## Важно

Это учебный mock-backend: хранит данные в памяти процесса.
При перезапуске сервера данные сбрасываются.
