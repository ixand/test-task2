import { EventData } from '../pages/CalendarPage';

export const TEST_USER = {
  email: process.env.GOOGLE_EMAIL!,
  password: process.env.GOOGLE_PASSWORD!
};

export const TEST_EVENT: EventData = {
  title: 'Playwright Test Event'
};

export const UPDATED_EVENT: EventData = {
  title: 'Updated Playwright Test Event'
};