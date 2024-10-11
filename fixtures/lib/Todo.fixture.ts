import { Page as BasePage, Locator } from "@playwright/test";

export class Todo {
   constructor(private readonly page: BasePage) {
      
   }

   /**
    * Finds an element in the DOM using the name of the element's attribute. You can optionally search
    * using the attribute's value
    * @param attribute The name of the element attribute
    * @param value The value of the element attribute
    * @param options Type of search on the value. With no options this only find and exact match of the value
    * @returns Locator for the found element(s)
    */
   async getByAttribute(
      attribute: string,
      value?: string,
      options?: { search: 'contains' | 'startsWith' | 'endsWith' }
   ): Promise<Locator> {
      const search = options?.search
         ? { contains: '*', startsWith: '^', endsWith: '$' }[options?.search]
         : ''
      if (value) {
         return this.page.locator(`css=[${attribute}=${search}"${value}"]`)
      }
      return this.page.locator(`css=[${attribute}]`);
   }
}