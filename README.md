# Interface Project
Project link - https://demo1.interface-challenge-zzc.xyz/

## Tech stacks used
Frontend: react/tailwind
Backend: Next.js/node.js
Deployment: AWS EC2
Database: Prisma/Postgresql/Render
Development Environment: Ubuntu 22.04 / neovim / tmux

## Design choices
- when the machine is charging, the motor will be automatically turned off, along with the speed setting set to OFF.
- When the motor is running, the user can start charging as well, the motor will automatically turned off.
- When charging, you can also turn on the motor, this will result in charging stopped.
- When the battery reaches 0%, the setting will be set to OFF, and the system will remind you to charge the machine. You cannot turn on the motor before you charge.
- When the battery is full, charging will automatically stop, and you won't be able to turn on charging again if the battery is still full.

## Getting Started

1. clone this github repo
2. install dependencies (npm install)
3. install and run postgresql server
4. create a environment variable file (.env)
5. in the .env file, specify your database address (usually in this format: DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public")
6. after setting up .env, run npx prisma db push to push the schema in the database
7. run development server (npm run dev)
8. (optional) build the app by running: npx next build

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

