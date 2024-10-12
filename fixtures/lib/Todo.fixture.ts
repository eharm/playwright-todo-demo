import { Page as BasePage, Locator } from "@playwright/test";

export class TodoFixture {
   public readonly todoCount: Locator;
   public readonly clearCompleted: Locator;

   constructor(private readonly page: BasePage) {
      this.todoCount = this.page.getByTestId('todo-count');
      this.clearCompleted = this.getByAttribute('class', 'clear-completed');
   }

   /**
    * Will add either a single or multiple items
    * @param todo item(s) to add to the list
    */
   async createTodo(...todo: string[]) {
      const input = this.page.getByPlaceholder('What needs to be done?');
      for (const t of todo) {
         await input.fill(t);
         await input.press('Enter');
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
}