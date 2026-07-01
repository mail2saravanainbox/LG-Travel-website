// LG Travels — pm2 process manager config.
// Start: pm2 start deploy/aws/ecosystem.config.js && pm2 save
// Backend reads its secrets from backend/.env (via @nestjs/config).
// Frontend reads NEXT_PUBLIC_* (inlined at build) + CLERK_SECRET_KEY from
// frontend/.env.production.local.
const HOME = process.env.HOME || "/home/ubuntu";
const APP = `${HOME}/LG-Travel-website`;

module.exports = {
  apps: [
    {
      name: "lg-backend",
      cwd: `${APP}/backend`,
      script: "dist/src/main.js",
      env: { NODE_ENV: "production", PORT: "4000" },
      max_memory_restart: "400M",
    },
    {
      name: "lg-frontend",
      cwd: `${APP}/frontend`,
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      env: { NODE_ENV: "production", PORT: "3000" },
      max_memory_restart: "600M",
    },
  ],
};
