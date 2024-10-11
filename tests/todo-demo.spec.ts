import { test, expect, type Page } from '../fixtures/Test'

test.beforeEach(async ({ page }) => {
   await page.goto('/');
})

test.describe('Verify page elements', () => {
   const todos = [
      'Write first test',
      'Write second test',
      'Write third test'
   ];
   
   test('Create todos', async ({ page }) => {
      await expect(page.getByText('todos', { exact: false })).toBeVisible();
      const todoInput = page.getByPlaceholder('What needs to be done?');

      todos.forEach(async (t, i) => {
         // Add a todo
         await todoInput.fill(t);
         await todoInput.press('Enter');

         // Confirm number of todos and content | first element is always current iteration (t)
         const todoList = page.getByTestId('todo-item');
         await expect(todoList).toHaveCount(i+1);
         await expect(todoList.first()).not.toHaveClass('completed')
         await expect(page.getByTestId('todo-title').first()).toHaveText(t);

         // Verify count
         await expect(page.getByTestId('todo-count')).toHaveText(`${i+1} item${i !== 0 ? 's' : ''} left`)
      })
   })

   test('Verify check/uncheck functionality', async ({ todo, page }) => {
      // Create todos
      await createTodos(page, todos)

      const firstTodo = page.getByTestId('todo-item');
      const clearCompleted = page.getByText('Clear completed');
      // const ttt = todo.getByAttribute()
      const todoCount = page.getByTestId('todo-count');

      // confirm unchecked state
      await expect(firstTodo).not.toHaveClass('completed');
      await expect(firstTodo.filter({ has: page.getByTestId('todo-title')}))
         .toHaveText(todos[todos.length-1]);
      await expect(todoCount).toHaveText(`${todos.length} items left`);
      await expect(clearCompleted).toHaveCount(0);

      firstTodo.filter({ has: page.getByRole('checkbox')}).click();
      // Verify checked state
      await expect(firstTodo.filter({ has: page.getByTestId('todo-title')}))
         .toHaveText(todos[todos.length-1]);
      await expect(todoCount).toHaveText(`${todos.length - 1} items left`);
      await expect(firstTodo).toHaveClass('completed');

      firstTodo.filter({ has: page.getByRole('checkbox')}).click();
      // Verify unchecked state
      await expect(firstTodo).not.toHaveClass('completed');
      await expect(firstTodo.filter({ has: page.getByTestId('todo-title')}))
         .toHaveText(todos[todos.length-1]);
      await expect(todoCount).toHaveText(`${todos.length} items left`);
      await expect(clearCompleted).toHaveCount(0);
   })
})

async function createTodos(page: Page, todos: string[]) {
   const input = page.getByPlaceholder('What needs to be done?');
   todos.forEach( async (t) => {
      await input.fill(t);
      await input.press('Enter');
   })
}