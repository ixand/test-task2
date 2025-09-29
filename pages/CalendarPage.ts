import { Page, Locator } from '@playwright/test';


export interface EventData {
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
}

export class CalendarPage {
  readonly page: Page;
  readonly createEventButton: Locator;
  readonly createButton: Locator;
  readonly eventMoreDetails: Locator;
  readonly eventTitleInput: Locator;
  readonly eventDescriptionInput: Locator;
  readonly saveEventButton: Locator;
  readonly deleteEventButton: Locator;
  readonly editEventButton: Locator;
  readonly eventPopup: Locator;
  readonly confirmDeleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Основні елементи календаря 
    this.eventMoreDetails = this.page.getByRole('button', {name: /Інші параметри/});
    this.createEventButton = this.page.getByRole('button', { name: /Створити|Create/i });
    this.createButton = this.page.getByRole('menuitem', { name: /Подія|Event/i });
    // Елементи форми створення/редагування події
    this.eventTitleInput = page.getByRole('textbox', {name: /Заголовок|Title/});
    this.eventDescriptionInput = page.getByRole('textbox', {name: /Опис/});
    
    
    // Кнопки дій
    this.saveEventButton = page.getByRole('button', {name: /Зберегти/});
    this.deleteEventButton = page.getByRole('button', {name: /Видалити|Видалити подію/});
    this.editEventButton = page.getByRole('button', {name: /Змінити подію|Змінити/});
    this.confirmDeleteButton = page.locator('button:has-text("Delete"), span:has-text("Delete")');
    
    // Попап події
    this.eventPopup = page.locator('[role="dialog"], .UfeRlc');
  }

  /**
   * Очікує завантаження календаря
   */
  async waitForCalendarLoad(): Promise<void> {
    await this.page.waitForTimeout(2000);
    // переходимо в Calendar:
        await this.page.goto('https://calendar.google.com', { waitUntil: 'domcontentloaded' });
  }
  async CreateButtonMenu(): Promise<void>
  { await this.page.waitForTimeout(1000); 
    await this.createEventButton.click({ force: true });
    await this.createButton.click({ force: true });
  }
  /**
   * Створює нову подію в календарі
   * @param eventData - Дані про подію
   */
  async createEvent(eventData: EventData): Promise<void> {
    
    await this.CreateButtonMenu();
    // Крок 2: Заповнення форми події
    await this.eventMoreDetails.click({force: true});
    await this.fillEventForm(eventData);
    
    // Крок 3: Збереження події
    await this.saveEvent();
  }

  /**
   * Заповнює форму події
   * @param eventData - Дані для заповнення
   */
  async fillEventForm(eventData: EventData): Promise<void> {
    // Заповнення назви події
    
    await this.page.waitForTimeout(1000); 
    await this.eventTitleInput.waitFor({ state: 'visible'});
    await this.eventTitleInput.fill(eventData.title);

    // Заповнення опису 
    await this.eventDescriptionInput.fill(eventData.description);
    
  }

  /**
   * Зберігає подію
   */
  async saveEvent(): Promise<void> {
    await this.saveEventButton.click({force: true});
    await this.page.waitForTimeout(2000); // Очікування збереження
  }

  /**
   * Знаходить подію за назвою
   * @param eventTitle - Назва події для пошуку
   * @returns Locator знайденої події
   */
  getEventByTitle(title: string) {
  // подія в сітці календаря має role="button" з повним ім'ям
  return this.page.getByRole('button', { name: new RegExp(title, 'i') }).first();
}

  /**
   * Читає деталі події
   * @param eventTitle - Назва події
   * @returns Дані події
   */
  async readEventDetails(eventTitle: string): Promise<void> {
    // Крок 1: Клік по події для відкриття деталей
    const eventElement = this.getEventByTitle(eventTitle);
    await eventElement.click({force: true});
    
    
    // Крок 2: Зчитування деталей події
    const title = await this.eventTitleInput;
    const description = await this.eventDescriptionInput;
   
  }

  /**
   * Оновлює існуючу подію
   * @param currentTitle - Поточна назва події
   * @param newEventData - Нові дані події
   */
  async updateEvent(currentTitle: string, newEventData: EventData): Promise<void> {
    // Крок 1: Відкриття події для редагування
    const eventElement = this.getEventByTitle(currentTitle);
    await eventElement.click();
    
    // Крок 2: Натискання кнопки редагування
    await this.editEventButton.click();
    
    // Крок 3: Очищення та заповнення нових даних
    await this.eventTitleInput.clear();
    await this.fillEventForm(newEventData);
    
    // Крок 4: Збереження змін
    await this.saveEvent();
  }

  /**
   * Видаляє подію
   * @param eventTitle - Назва події для видалення
   */
  async deleteEvent(eventTitle: string): Promise<void> {
    // Крок 1: Відкриття події
    const eventElement = this.getEventByTitle(eventTitle);
    await eventElement.click();
    
    // Крок 2: Натискання кнопки видалення
    await this.deleteEventButton.click();
    
    // Крок 3: Очікування завершення видалення
    await this.page.waitForTimeout(2000);
  }

  /**
   * Перевіряє чи існує подія з вказаною назвою
   * @param eventTitle - Назва події
   * @returns true якщо подія існує
   */
  
}