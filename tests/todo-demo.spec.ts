import { clear } from 'console';
import { test, expect, type Page } from '../fixtures/Test'

// test.beforeEach(async ({ page }) => {
//    await page.goto('/todomvc');
// })

test.describe('Verify page elements', () => {
   const todos = [
      'Write first test',
      'Write second test',
      'Write third test'
   ];

   test.beforeEach(async ({ page }) => {
      await page.goto('/todomvc');
   })
   
   test('Create todos', async ({ page }) => {
      await expect(page.getByText('todos', { exact: false })).toBeVisible();
      const todoInput = page.getByPlaceholder('What needs to be done?');

      for (const t of todos) {
         const cnt = todos.indexOf(t) + 1;
         // Add a todo
         await todoInput.fill(t);
         await todoInput.press('Enter');

         // Confirm number of todos and content | last element is always current iteration (t)
         const todoList = page.getByTestId('todo-item');
         await expect(todoList).toHaveCount(cnt);
         await expect(todoList.first()).not.toHaveClass('completed')
         await expect(page.getByTestId('todo-title').last()).toHaveText(t);

         // Verify count
         await expect(page.getByTestId('todo-count')).toHaveText(`${cnt} item${cnt === 1 ? '' : 's'} left`)
      }
   })

   test('Verify check/uncheck functionality', async ({ todo, page }) => {
      // Create todos
      await createTodos(page, todos)

      const firstTodo = page.getByTestId('todo-item').first();
      const clearCompleted = todo.getByAttribute('class', 'clear-completed');
      const todoCount = page.getByTestId('todo-count');

      // confirm unchecked state
      await expect(firstTodo).not.toHaveClass('completed');
      await expect(firstTodo.getByTestId('todo-title')).toHaveText(todos[0]);
      await expect(todoCount).toHaveText(`${todos.length} items left`);
      await expect(clearCompleted).toHaveCount(0);

      // Verify checked state
      await firstTodo.getByRole('checkbox').check();
      await expect(firstTodo.getByTestId('todo-title')).toHaveText(todos[0]);
      await expect(todoCount).toHaveText(`${todos.length - 1} items left`);
      await expect(firstTodo).toHaveClass('completed');
      await expect(clearCompleted).toHaveCount(1);

      // Verify unchecked state
      await firstTodo.getByRole('checkbox').uncheck();
      await expect(firstTodo).not.toHaveClass('completed');
      await expect(firstTodo.getByTestId('todo-title')).toHaveText(todos[0]);
      await expect(todoCount).toHaveText(`${todos.length} items left`);
      await expect(clearCompleted).toHaveCount(0);
   })
})

async function createTodos(page: Page, todos: string[]) {
   const input = page.getByPlaceholder('What needs to be done?');
   for (const t of todos) {
      await input.fill(t);
      await input.press('Enter');
   }
}