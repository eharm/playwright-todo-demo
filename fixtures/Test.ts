import { test as base } from '@playwright/test';
import { TodoFixture } from './lib/Todo.fixture';

type Fixture = {
   todo: TodoFixture
}

export const test = base.extend<Fixture>({
   todo: async ({ page }, use) => {
      await use(new TodoFixture(page));
   }
})

export { expect, type Page } from '@playwright/test'