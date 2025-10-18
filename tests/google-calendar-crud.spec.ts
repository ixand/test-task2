import { test, expect} from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CalendarPage} from '../pages/CalendarPage';
import { TEST_USER, TEST_EVENT, UPDATED_EVENT } from '../data/testData';


test.describe('Google Calendar CRUD Operations', () => {
  let loginPage: LoginPage;
  let calendarPage: CalendarPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    calendarPage = new CalendarPage(page);

    await loginPage.login(TEST_USER.email!, TEST_USER.password!);
    await calendarPage.waitForCalendarLoad();
  });

test('CREATE: Створення нової події в календарі', async ({}) => {
  
  await calendarPage.createEvent(TEST_EVENT)
  await calendarPage.readEventDetails(TEST_EVENT.title)
  await calendarPage.expectEventTitleVisible(TEST_EVENT.title)
});


test('READ: Читання деталей існуючої події', async ({ page }) => {
 
  await calendarPage.readEventDetails(TEST_EVENT.title)
  await calendarPage.expectEventTitleVisible(TEST_EVENT.title)

});

test('UPDATE: Оновлення існуючої події', async ({ page }) => {

    // Act: Оновлення події
    await calendarPage.updateEvent(TEST_EVENT.title, UPDATED_EVENT);
    await calendarPage.readEventDetails(UPDATED_EVENT.title);
    await calendarPage.expectEventTitleVisible(UPDATED_EVENT.title)
    
  });

  test('DELETE: Видалення існуючої події', async ({}) => {

    // Act: Видалення події
    await calendarPage.deleteEvent(TEST_EVENT.title);

    const eventExist = calendarPage.getEventByTitle(TEST_EVENT.title)

    await expect(eventExist).toHaveCount(0);
   
  });
});