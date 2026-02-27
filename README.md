# LWC with SLDS and Lightning Base Components

This LWC starter project includes Salesforce Lightning Design System and Lightning Base Components for quickly building Salesforce interfaces.

## Designer - Cursor Quick Start
1. Click the green **"Use this template"** button at the top-right of this page.
2. Choose **“Create a new repository”**
3. Name your new repo, mark it as **private**, and then click **"Create repository"**.
4. You will be navigated to your new repo. Copy the URL.
5. Open Cursor, and select **“Clone repo”** and paste the URL.
6. Then, in the Cursor command line, run `npm install` (this can take a couple of minutes).
   * If this is your first time using the command line, you may not have node (npm) installed. If you get a “command not found” error when you try to run the above, install Homebrew and node first, and then try again:
   * Install Homebrew: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
   * Install node: `brew install node`
   * Try running `npm install` again.
8. Once that is complete, run `npm run dev` and open [http://localhost:3000](http://localhost:3000) in your browser to see a live preview while you work on your project!

That’s it. You’re ready to start prompting in Cursor.

## Running the Project in dev Mode

```bash
npm install
npm run dev # dev:compat for AMD format
```

Open the site at [http://localhost:3000](http://localhost:3000)

## Statically Generate and Preview the Site

```bash
npm run build # dev:prod-compat for AMD format
npm start
```

Open the site at [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel (or get a shareable link)

- **Vercel:** Connect this repo in the [Vercel dashboard](https://vercel.com); the project uses `package.json` `engines.node: "20.x"` and `vercel.json` (build → `site`). If the build fails, check the Vercel build logs and ensure Node 20 is selected (Project Settings → General → Node.js Version).
- **Shareable link from your machine:** Build and serve locally, then expose with a tunnel:
  ```bash
  npm run build && npx serve site --listen 3000
  ```
  In another terminal:
  ```bash
  npx localtunnel --port 3000
  ```
  Use the generated URL (e.g. `https://something.loca.lt`) as the shareable link. The tunnel stays up only while that process runs.
