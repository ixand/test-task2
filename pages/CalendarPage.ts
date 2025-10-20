import { Page, Locator, expect } from '@playwright/test';

export interface EventData {
  title: string;
}

export class CalendarPage {
  readonly page: Page;
  readonly createEventButton: Locator;
  readonly createButton: Locator;
  readonly eventMoreDetails: Locator;
  readonly eventTitleInput: Locator;
  readonly saveEventButton: Locator;
  readonly deleteEventButton: Locator;
  readonly editEventButton: Locator;
  readonly confirmDeleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Основні елементи календаря 
    this.eventMoreDetails = this.page.getByRole('button', {name: /Інші параметри/});
    this.createEventButton = this.page.getByRole('button', { name: /Створити|Create/i });
    this.createButton = this.page.getByRole('menuitem', { name: /Подія|Event/i });
    // Елементи форми створення/редагування події
    this.eventTitleInput = page.getByRole('textbox', {name: /Заголовок|Title/});
    
    
    // Кнопки дій
    this.saveEventButton = page.getByRole('button', {name: /Зберегти|Save/});
    this.deleteEventButton = page.getByRole('button', {name: /Видалити|Delete/});
    this.editEventButton = page.getByRole('button', {name: /Змінити подію|Змінити/});
    this.confirmDeleteButton = page.locator('button:has-text("Delete"), span:has-text("Delete")');
    
  }

  /**
   * Очікує завантаження календаря
   */
  async waitForCalendarLoad(): Promise<void> {
    // переходимо в Calendar:
        await this.page.goto('https://calendar.google.com', { waitUntil: 'domcontentloaded' });
        
  }
  async createButtonMenu(): Promise<void>
  { await this.createEventButton.waitFor({state: 'visible'})
    await this.createEventButton.click()

    await this.createButton.waitFor({state: 'visible'})
    await this.createButton.click();
  }
  /**
   * Створює нову подію в календарі
   * @param eventData - Дані про подію
   */
  async createEvent(eventData: EventData): Promise<void> {
    await this.createButtonMenu();
    // Крок 2: Заповнення форми події
    await this.eventMoreDetails.waitFor({state: 'visible'})
    await this.eventMoreDetails.click();
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
    await this.eventTitleInput.waitFor({ state: 'visible'});
    await this.eventTitleInput.fill(eventData.title);
  }

  /**
   * Зберігає подію
   */
  async saveEvent(): Promise<void> {
    await this.page.waitForTimeout(2000)
    await this.saveEventButton.waitFor({ state: 'visible' })
    await this.saveEventButton.click();
  }

  /**
   * Знаходить подію за назвою
   * @param title - Назва події для пошуку
   * @returns Locator знайденої події
   */
  getEventByTitle(title: string) {
  // подія в сітці календаря має role="button" з повним ім'ям
  return this.page.getByRole('button', { name: new RegExp(title, 'i') }).first();
}

  /**
   * Читає деталі події
   * @param eventTitle - Назва події
   */
  async readEventDetails(eventTitle: string): Promise<void> {
    const eventElement = this.getEventByTitle(eventTitle);
    await eventElement.waitFor({state: 'visible'})
    await eventElement.click();
  }

  /**
   * Оновлює існуючу подію
   * @param currentTitle - Поточна назва події
   * @param newEventData - Нові дані події
   */
  async updateEvent(currentTitle: string, newEventData: EventData): Promise<void> {
    // Крок 1: Відкриття події для редагування
    const eventElement = this.getEventByTitle(currentTitle);
    await eventElement.waitFor({state: 'visible'})
    await eventElement.click();
    
    // Крок 2: Натискання кнопки редагування
    await this.editEventButton.waitFor({state: 'visible'})
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
    await eventElement.waitFor({state: 'visible'})
    await eventElement.click();
    
    // Крок 2: Натискання кнопки видалення
    await this.deleteEventButton.waitFor({state: 'visible'})
    await this.deleteEventButton.click();
    
    // Крок 3: Очікування завершення видалення
    await expect(this.page.getByRole('heading', { name: eventTitle })).toHaveCount(0);

  }
  /**
   * Перевіряє деталі події
   * @param title - Назва події
   */

  async expectEventTitleVisible(title: string) {
    const titleElement = this.page.getByRole('heading', { name: title });
    await expect(titleElement).toBeVisible();
  }
}