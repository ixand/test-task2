import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CalendarPage, EventData } from '../pages/CalendarPage';

// Тестові дані
const TEST_USER = {
  email: process.env.GOOGLE_EMAIL ,
  password: process.env.GOOGLE_PASSWORD 
};

const TEST_EVENT: EventData = {
  title: 'Playwright Test Event',
  description: 'Test event created by Playwright automation',
  location: 'Test Location'
};

const UPDATED_EVENT: EventData = {
  title: 'Updated Playwright Test Event',
  description: 'Updated test event description',
  location: 'Updated Test Location'
};

test.describe('Google Calendar CRUD Operations', () => {
  let loginPage: LoginPage;
  let calendarPage: CalendarPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    calendarPage = new CalendarPage(page);

    // Перехід на сторінку входу Google
    await page.goto('https://accounts.google.com/signin');
  });



  test('CREATE: Створення нової події в календарі', async ({ page }) => {
    
    await loginPage.login(TEST_USER.email, TEST_USER.password);
    
    await calendarPage.waitForCalendarLoad();
    // Act: Створення нової події
    await calendarPage.createEvent(TEST_EVENT);

    
  });

  test('READ: Читання деталей існуючої події', async ({ page }) => {
    
    await loginPage.login(TEST_USER.email, TEST_USER.password);
     await calendarPage.waitForCalendarLoad();
    await calendarPage.readEventDetails(TEST_EVENT.title);
    

   
  });

   test('UPDATE: Оновлення існуючої події', async ({ page }) => {
    
    await loginPage.login(TEST_USER.email, TEST_USER.password);
    
     await calendarPage.waitForCalendarLoad();

    // Act: Оновлення події
    await calendarPage.updateEvent(TEST_EVENT.title, UPDATED_EVENT);

    
  });

  test('DELETE: Видалення існуючої події', async ({ page }) => {
    
    await loginPage.login(TEST_USER.email, TEST_USER.password);
     await calendarPage.waitForCalendarLoad();
    // Act: Видалення події
    await calendarPage.deleteEvent(TEST_EVENT.title);

    
   
  });

  
});