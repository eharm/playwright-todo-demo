import { test, expect } from '../fixtures/Test'

test.describe('Verify page elements', () => {
   const todoList = [
      'Write first test',
      'Write second test',
      'Write third test'
   ];

   test.beforeEach(async ({ page }) => {
      await page.goto('/todomvc');
   })
   
   test('Create todos', async ({ todo, page }) => {
      await expect(page.getByText('todos', { exact: false })).toBeVisible();
      const todoInput = page.getByPlaceholder('What needs to be done?');

      for (const t of todoList) {
         const cnt = todoList.indexOf(t) + 1;
         // Add a todo
         await todoInput.fill(t);
         await todoInput.press('Enter');

         // Confirm number of todos and content | last element is always current iteration (t)
         const todoItems = page.getByTestId('todo-item');
         await expect(todoItems).toHaveCount(cnt);
         await expect(todoItems.first()).not.toHaveClass('completed')
         await expect(page.getByTestId('todo-title').last()).toHaveText(t);

         // Verify count
         await expect(todo.todoCount).toHaveText(`${cnt} item${cnt === 1 ? '' : 's'} left`)
      }
   })

   test('Verify check/uncheck functionality', async ({ todo, page }) => {
      // Create todos
      await todo.createTodo(...todoList);

      const firstTodo = page.getByTestId('todo-item').first();

      // confirm unchecked state
      await expect(firstTodo).not.toHaveClass('completed');
      await expect(firstTodo.getByTestId('todo-title')).toHaveText(todoList[0]);
      await expect(todo.todoCount).toHaveText(`${todoList.length} items left`);
      await expect(todo.clearCompleted).toHaveCount(0);

      // Verify checked state
      await firstTodo.getByRole('checkbox').check();
      await expect(firstTodo.getByTestId('todo-title')).toHaveText(todoList[0]);
      await expect(todo.todoCount).toHaveText(`${todoList.length - 1} items left`);
      await expect(firstTodo).toHaveClass('completed');
      await expect(todo.clearCompleted).toHaveCount(1);

      // Verify unchecked state
      await firstTodo.getByRole('checkbox').uncheck();
      await expect(firstTodo).not.toHaveClass('completed');
      await expect(firstTodo.getByTestId('todo-title')).toHaveText(todoList[0]);
      await expect(todo.todoCount).toHaveText(`${todoList.length} items left`);
      await expect(todo.clearCompleted).toHaveCount(0);
   })

   test('Verify "Clear completed" button', async ({ todo, page }) => {
      await todo.createTodo(...todoList);

      const allTodos = page.getByTestId('todo-item');

      let cnt = todoList.length;
      // Check each list item
      for (const t of todoList) {
         const currentTodo = allTodos.filter({ hasText: t });

         await expect(allTodos).toHaveCount(cnt);
         await currentTodo
            .getByRole('checkbox')
            .check();
         await expect(currentTodo).toHaveClass('completed');
         await todo.clearCompleted.click();
         await expect(allTodos).toHaveCount(--cnt)
      }

      await expect(allTodos).toHaveCount(0);
   })
})