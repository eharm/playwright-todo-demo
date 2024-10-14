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

      for (const t of todoList) {
         const cnt = todoList.indexOf(t) + 1;
         // Add a todo
         await todo.todoInput.fill(t);
         await todo.todoInput.press('Enter');

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
         await todo.toggleTodo('check', t);
         await expect(currentTodo).toHaveClass('completed');
         await todo.clearCompleted.click();
         await expect(allTodos).toHaveCount(--cnt)
      }

      await expect(allTodos).toHaveCount(0);
   })

   test('Verify tabbed filtering', async ({ todo, page }) => {
      const ts = ['active todo item', 'completed todo item']
      // create todos and check
      await todo.createTodo(...ts);
      await todo.toggleTodo('check', ts[1]);

      const allTodos = page.getByTestId('todo-item');

      // Default tab state
      await expect(todo.allTab).toHaveClass('selected');
      await expect(todo.activeTab).not.toHaveClass('selected');
      await expect(todo.completedTab).not.toHaveClass('selected');

      await todo.activeTab.click({ force: true });
      await expect(todo.activeTab).toHaveClass('selected');
      await expect(allTodos).toHaveCount(1);
      await expect(allTodos.getByTestId('todo-title')).toHaveText(ts[0]);

      await todo.completedTab.click({ force: true });
      await expect(todo.completedTab).toHaveClass('selected');
      await expect(allTodos).toHaveCount(1);
      await expect(allTodos.getByTestId('todo-title')).toHaveText(ts[1]);
      
      await todo.clearCompleted.click();
      await expect(allTodos).toHaveCount(0);
   })

   test('Verify Editing of Todos', async ({ todo, page }) => {
      await todo.createTodo(...todoList.slice(0, 2));
      await todo.toggleTodo('check', todoList[1]);

      const editText = ' Edited';
      const allTodos = page.getByTestId('todo-item');
      const firstTodo = allTodos.first();
      const secondTodo = allTodos.last();

      await expect(allTodos).toHaveCount(2);

      // Edit an active todo
      await expect(firstTodo).not.toHaveClass('editing');
      await firstTodo.getByTestId('todo-title').dblclick({ force: true });
      await expect(firstTodo).toHaveClass('editing')
      await firstTodo.getByLabel('Edit').fill(todoList[0] + editText);
      await firstTodo.getByLabel('Edit').press('Enter');
      await expect(firstTodo.getByTestId('todo-title')).toHaveText(todoList[0] + editText);
      
      // Edit a completed todo
      await expect(secondTodo).not.toHaveClass(/editing/);
      await secondTodo.getByTestId('todo-title').dblclick({ force: true });
      await expect(secondTodo).toHaveClass(/editing/)
      await secondTodo.getByLabel('Edit').fill(todoList[1] + editText);
      await secondTodo.getByLabel('Edit').press('Enter');
      await expect(secondTodo.getByTestId('todo-title')).toHaveText(todoList[1] + editText);
   })
})