import { Page as BasePage, expect, Locator } from "@playwright/test";

export class TodoFixture {
   //#region properties
   get todoInput(): Locator { return this.page.getByPlaceholder('What needs to be done?'); }
   get todoCount(): Locator { return this.page.getByTestId('todo-count'); }
   get clearCompleted(): Locator { return this.getByAttribute('class', 'clear-completed'); }
   get allTab(): Locator { return this.page.locator('css=ul.filters a').filter({ hasText: 'All' }); }
   get activeTab(): Locator { return this.page.locator('css=ul.filters a').filter({ hasText: 'Active' }); }
   get completedTab(): Locator { return this.page.locator('css=ul.filters a').filter({ hasText: 'Completed' }); }
   //#endregion properties

   private readonly page: BasePage;

   constructor(page: BasePage) {
      this.page = page;
   }

   //#region public methods
   /**
    * Will add either a single or multiple items to the todo list
    * @param todo item(s) to add to the list
    */
   async createTodo(...todo: string[]) {
      for (const t of todo) {
         await this.todoInput.fill(t);
         await this.todoInput.press('Enter');
      }
   }

   /**
    * This will toggle a checkbox for one or multiple todo items. There is an assertion
    * on each check to confirm the expected state before check/uncheck
    * @param state The desired state of the checkbox
    * @param todoText The text of the todo to be check/unchecked
    */
   async toggleTodo(state: 'check' | 'uncheck', ...todoText: string[]) {
      for (const t of todoText) {
         const checkbox = this.page.getByTestId('todo-item')
            .filter({ hasText: t })
            .getByRole('checkbox');
         if (state === 'check') {
            await expect(checkbox).not.toBeChecked();
            await checkbox.check();
         } else {
            await expect(checkbox).toBeChecked();
            await checkbox.uncheck();
         }
      }
   }

   /**
    * Finds an element in the DOM using the name of the element's attribute. You can optionally search
    * using the attribute's value
    * @param attribute The name of the element attribute
    * @param value The value of the element attribute
    * @param options Type of search on the value. With no options this only find and exact match of the value
    * @returns Locator for the found element(s)
    */
   getByAttribute(
      attribute: string,
      value?: string,
      options?: Partial<{ has: Locator, hasNot: Locator, hasNotText: string | RegExp, hasText: string | RegExp, search: 'contains' | 'startsWith' | 'endsWith' }>
   ): Locator {
      const s = options?.search
         ? { contains: '*', startsWith: '^', endsWith: '$' }[options?.search]
         : ''
      delete options?.search;
      if (value) {
         return this.page.locator(`css=[${attribute}${s}="${value}"]`, options)
      }
      return this.page.locator(`css=[${attribute}]`, options);
   }
   //#endregion public methods
}