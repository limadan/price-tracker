import dotenv from 'dotenv';
dotenv.config();

import { BaseNotifier } from './BaseNotifier';
import { EmailNotifier } from './strategies/EmailNotifier';

async function main() {
  const emailNotifier = new EmailNotifier();

  const baseNotifier = new BaseNotifier([emailNotifier]);

  await baseNotifier.processNotifications();
}

setInterval(() => {
  main().catch(console.error);
}, 5 * 60 * 1000);

main().catch(console.error);
