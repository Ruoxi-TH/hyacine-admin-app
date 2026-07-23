# Hyacine Admin App

Admin mobile application for Hyacine Music server management.

## Features

- Dashboard with server statistics
- User management (list, ban, unban, delete, promote)
- Secure authentication with JWT

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm start
   ```

3. Run on device:
   ```bash
   pnpm android
   # or
   pnpm ios
   ```

## Configuration

On first launch, you will be prompted to enter your backend server URL (e.g., `https://your-server.com`).

## Requirements

- Node.js 20+
- pnpm 10+
- Expo CLI

## License

MIT