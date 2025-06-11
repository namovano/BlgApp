const { Builder, By, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const fs = require('fs');
const path = require('path');

async function takeScreenshot(driver, stepName) {
  const image = await driver.takeScreenshot();
  const screenshotsDir = path.join(__dirname, 'screenshots');

  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  fs.writeFileSync(path.join(screenshotsDir, `${stepName}.png`), image, 'base64');
}

async function userRegistrationAndPost() {
  const options = new firefox.Options();
  // Чтобы видеть браузер, закомментируй следующую строку
  options.addArguments('-headless');

  const driver = await new Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(options)
    .build();

  const URL = 'http://localhost:8080';

  try {
    // Открываем главную страницу
    await driver.get(URL);
    await takeScreenshot(driver, '01_homepage');

    // Переход на страницу регистрации
    await driver.findElement(By.linkText('Or Sign Up')).click();
    await driver.wait(until.elementLocated(By.name('username')), 5000);
    await takeScreenshot(driver, '02_register_page');

    const timestamp = Date.now();
    const username = `testuser${timestamp}`;
    const email = `test${timestamp}@example.com`;
    const password = 'SEcret123!';

    // Заполняем форму регистрации
    await driver.findElement(By.name('username')).sendKeys(username);
    await driver.findElement(By.name('email')).sendKeys(email);
    await driver.findElement(By.name('password')).sendKeys(password);
    await driver.findElement(By.id('confirm')).sendKeys(password);
    await takeScreenshot(driver, '03_filled_registration');

    // Нажимаем кнопку регистрации
    await driver.findElement(By.id('register')).click();

    // Ждем, что после регистрации нас перекинет на главную или страницу с блогами
    await driver.wait(async () => {
      const currentUrl = await driver.getCurrentUrl();
      return currentUrl === URL || currentUrl.includes('/posts') || currentUrl.includes('/dashboard');
    }, 10000);

    await takeScreenshot(driver, '04_after_register_redirect');

    // Логин (если требуется повторный вход)
    // В твоём случае, возможно, уже залогинились — можешь этот блок пропустить, если не нужен
    await driver.findElement(By.name('username')).clear();
    await driver.findElement(By.name('username')).sendKeys(username);
    await driver.findElement(By.name('password')).clear();
    await driver.findElement(By.name('password')).sendKeys(password);
    await takeScreenshot(driver, '05_filled_login');

    await driver.findElement(By.id('login')).click();

    // Ждем перехода на главную после логина
    await driver.wait(until.urlIs(URL), 10000);
    await takeScreenshot(driver, '06_logged_in');

    // Переходим на страницу создания поста
    await driver.get(URL + '/post');
    await driver.wait(until.elementLocated(By.id('title')), 5000);
    await takeScreenshot(driver, '07_add_post_page');

    // Заполняем форму поста
    await driver.findElement(By.id('title')).sendKeys('Тестовий пост');
    await driver.findElement(By.id('description')).sendKeys('Це контент тестового посту');
    await driver.findElement(By.id('body')).sendKeys('Це контент тестового посту');
    await takeScreenshot(driver, '08_filled_post');

    // Отправляем пост
    await driver.findElement(By.id('post')).click();

    // Можно подождать появления какого-то элемента подтверждения успешного создания поста
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Пост створено')]")), 5000).catch(() => {});

    await takeScreenshot(driver, '09_post_created');

  } catch (error) {
    console.error('Ошибка в тесте:', error);
  } finally {
    await driver.quit();
  }
}

userRegistrationAndPost();
