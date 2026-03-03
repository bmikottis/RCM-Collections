# Deploy to Heroku

The app is configured for Heroku: `Procfile` runs `yarn start`, and `heroku-postbuild` runs `yarn build`. LWR uses the `PORT` env var automatically.

## One-time setup

1. **Install Heroku CLI** (if needed): https://devcenter.heroku.com/articles/heroku-cli  
2. **Log in:** `heroku login`  
3. **Create app and add remote:**
   ```bash
   heroku create
   ```
   Or, if you already have an app:
   ```bash
   heroku git:remote -a YOUR_APP_NAME
   ```

## Deploy

From the repo root:

```bash
git push heroku main
```

Heroku will install dependencies, run `yarn build`, then start the app with `yarn start`. Open the app URL (e.g. `https://YOUR_APP_NAME.herokuapp.com`) from the CLI output or the Heroku dashboard.
