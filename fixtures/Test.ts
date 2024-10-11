import { test as base } from '@playwright/test';
import { Todo } from './lib/Todo.fixture';

type Fixture = {
   todo: Todo
}

export const test = base.extend<Fixture>({
   todo: async ({ page }, use) => {
      await use(new Todo(page));
   }
})

export { expect, type Page } from '@playwright/test'