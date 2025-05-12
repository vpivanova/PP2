import { test, expect, FrameLocator } from '@playwright/test';
import { BrowserContext, Page } from '@playwright/test';

let context: BrowserContext;
let page: Page;


test('Установление сессии под атттдмином', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/Create T3 App/);
  await page.getByRole('link', { name: 'Si' }).click();
  const newTodo = page.getByPlaceholder('');    
  await newTodo.fill('dan@example.com');
  await page.getByRole('button', { name: 'Si' }).click();

  await page.goto('http://localhost:1080');
  await page.getByRole('cell', { name: '<dan@example.com>' }).nth(0).click();
  const iframeLocator = page.frameLocator('iframe[src*="messages/"]');
  const signInLinkLocator = iframeLocator.locator('a:has-text("Sign in")');

  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    signInLinkLocator.click({ modifiers: [process.platform === 'darwin' ? 'Meta' : 'Control'] }),
  ]);

  await newPage.waitForLoadState();
  //console.log('URL новой страницы:', newPage.url());
  await page.close();
  await expect(newPage.getByRole('heading', { name: 'ADMIN' })).toBeVisible();

  const heading = page.getByRole('heading', { name: 'ADMIN' }); //странно
});


test.describe('Тесты с администратором', () => {
  test.beforeEach('Установление сессии под админом', async ({ browser }) => {
    if (context) {
        page = await context.newPage();  
        await page.goto('http://localhost:3000'); 
        return; 
    }

    context = await browser.newContext();
    page = await context.newPage();
    await context.clearCookies();

    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/Create T3 App/);
    await page.getByRole('link', { name: 'Si' }).click();
    const newTodo = page.getByPlaceholder('');
    await newTodo.fill('dan@example.com');
    await page.getByRole('button', { name: 'Si' }).click();
    
    await page.goto('http://localhost:1080');
    await page.getByRole('cell', { name: '<dan@example.com>' }).nth(0).click();
    const iframeLocator = page.frameLocator('iframe[src*="messages/"]');
    const signInLinkLocator = iframeLocator.locator('a:has-text("Sign in")');
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      signInLinkLocator.click({ modifiers: [process.platform === 'darwin' ? 'Meta' : 'Control'] }),
    ]);
    await newPage.waitForLoadState();
    await page.close();

    page = newPage;
    await expect(page.getByRole('heading', { name: 'ADMIN' })).toBeVisible();
    console.log("Тест установление сеанса выполнен");

  });

  test('Пользователи', async ({ }) => { 
    //await expect(page.getByRole('heading', { name: 'ADMIN' })).toBeVisible();
    await page.getByRole('link', { name: 'Пользователи' }).click();
    await expect(page.getByRole('heading', { name: 'User page' })).toBeVisible();
    await page.getByRole('group').locator('svg').click();
    await page.locator('input[name="email"]').fill('PP@PP.ru');
    await page.locator('input[name="firstname"]').fill('Pablo');
    await page.locator('input[name="surname"]').fill('Pauline');
    await page.getByRole('button', { name: 'Добавить' }).click();
    await page.waitForTimeout(2000);
    await page.getByText('3').click();
    await page.waitForTimeout(5000);
    await page.getByRole('row', { name: 'b bb b@b.ru' }).getByRole('link').click();
    await page.getByRole('button', { name: 'Удалить' }).click();
    await page.waitForTimeout(5000);
    await page.getByRole('row', { name: 'aa a aaa@aaa.com' }).getByRole('link').click();
    await page.waitForTimeout(2000);
    await page.locator('input[name="surname"]').click();
    await page.locator('input[name="surname"]').fill('FF');
    await page.waitForTimeout(5000);
    await page.getByRole('combobox').click();
    await page.getByRole('button', { name: 'Обновить' }).click();
    //await page.waitForTimeout(10000);
    await expect(page.getByRole('heading', { name: 'User page' })).toBeVisible();

    console.log("Тест пользователи выполнен");
  });

  test('Группы', async ({ }) => { 
    await expect(page.getByRole('heading', { name: 'ADMIN' })).toBeVisible();
    await page.getByRole('link', { name: 'Группы' }).click();
    await expect(page.getByRole('heading', { name: 'Group page' })).toBeVisible();

    await page.getByRole('group').locator('svg').click();
    await page.locator('input[name="name"]').fill('Группа 78');
    await page.getByRole('button', { name: 'Добавить' }).click();
    // await page.waitForTimeout(8000);
    // await page.getByText('2').click();
    // await page.waitForTimeout(8000);
    //await page.getByRole('cell', { name: 'Группа 216' }).getByPlaceholder('Имя группы').click()
    //await page.getByRole('cell', { name: 'Группа 216' }).getByPlaceholder('Имя группы').fill('Группа 90');
    await page.getByRole('row', { name: 'Группа 216' }).getByRole('link').click();
    await page.locator('input[name="name"]').fill('Группа 300');
    await page.getByRole('textbox', { name: 'Имя пользователя' }).fill('В');
    await page.getByRole('button', { name: 'Добавить в группу Владислав Артемьев' }).click();
    await page.getByRole('button', { name: 'Обновить' }).click();
    
    console.log("Тест группы выполнен");
  });
  
  test('Задачи', async ({ }) => { 
    await page.getByRole('link', { name: 'Задачи' }).click();
    await page.getByRole('group').locator('svg').click();
    await page.getByRole('textbox').fill('Лекция 14');
    await page.getByRole('button', { name: 'Добавить' }).click();
    await page.getByText('2').click();
    await page.waitForTimeout(5000);
    await page.getByRole('row', { name: 'вв' }).getByRole('link').click();
    await page.getByRole('button', { name: 'Удалить' }).click();
    await page.waitForTimeout(5000);
    //await page.getByRole('row', { name: 'Лекция' }).getByRole('link').click();

    console.log("Тест задачи выполнен");
  });

  test('Студент', async ({ }) => { 
    await page.getByRole('link', { name: 'Студент' }).click();
    await expect(page.getByRole('heading', { name: 'Даниил Дубов' })).toBeVisible();
      console.log("Тест студент выполнен");
  });
});

test.afterAll(async () => {
   if (context) {
       await context.close();
   }
});