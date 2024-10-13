import { Page as BasePage, expect, Locator } from "@playwright/test";

export class TodoFixture {
   //#region properties
   public readonly todoInput: Locator;
   public readonly todoCount: Locator;
   public readonly clearCompleted: Locator;
   public readonly allTab: Locator;
   public readonly activeTab: Locator;
   public readonly completedTab: Locator;
   //#endregion properties

   constructor(private readonly page: BasePage) {
      this.todoCount = this.page.getByTestId('todo-count');
      this.clearCompleted = this.getByAttribute('class', 'clear-completed');
      this.todoInput = this.page.getByPlaceholder('What needs to be done?');
      this.allTab = this.page.locator('css=ul.filters a').filter({ hasText: 'All' });
      this.activeTab = this.page.locator('css=ul.filters a').filter({ hasText: 'Active' });
      this.completedTab = this.page.locator('css=ul.filters a').filter({ hasText: 'Completed' });
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
      options?: { search: 'contains' | 'startsWith' | 'endsWith' }
   ): Locator {
      const search = options?.search
         ? { contains: '*', startsWith: '^', endsWith: '$' }[options?.search]
         : ''
      if (value) {
         return this.page.locator(`css=[${attribute}=${search}"${value}"]`)
      }
      return this.page.locator(`css=[${attribute}]`);
   }
   //#endregion public methods
}