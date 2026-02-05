┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLUJO DE VARIABLES: FIXTURE → POM → TEST                 │
└─────────────────────────────────────────────────────────────────────────────┘

1. PLAYWRIGHT CORE (Proporciona)
   ┌─────────────────────┐
   │  Playwright Test    │
   │  (test framework)   │
   └──────────┬──────────┘
              │
              │ Crea automáticamente
              ▼
   ┌─────────────────────┐
   │   Browser Context   │
   │   + Page Object     │
   └──────────┬──────────┘
              │


2. FIXTURE (Recibe Page, crea instancias)
   ┌──────────────────────────────────────────────┐
   │         fixtures/fixtures.js                 │
   │                                              │
   │  export const test = base.extend({           │
   │                                              │
   │    loginPage: async ({ page }, use) => {     │ ◄── page del navegador
   │      ┌──────────────────────────────┐        │
   │      │ new LoginPage(page)          │        │
   │      │ ├─ userID_textbox           │        │
   │      │ ├─ password_textbox         │        │
   │      │ ├─ signIn_button            │        │
   │      │ └─ methods()                │        │
   │      └──────────────┬───────────────┘        │
   │                     │                        │
   │      await use(loginPage) ► Pasa fixture    │
   │    }                                         │
   │  })                                          │
   └──────────────────────┬───────────────────────┘
                          │
                          │ Inyecta el fixture
                          ▼


3. TEST (Recibe fixture, lo usa)
   ┌────────────────────────────────────────────────────┐
   │           tests/login.spec.js                      │
   │                                                    │
   │  test('login', async ({ loginPage }) => {         │
   │       ▲                   ▲                        │
   │       │                   │                        │
   │    Fixture              Variables del fixture    │
   │    inyectado            disponibles aquí:        │
   │                         - loginPage.page         │
   │                         - loginPage.userID_..    │
   │                         - loginPage.login()      │
   │                                                    │
   │    await loginPage.login('user', 'pass')         │
   │           │                                       │
   │           └─► Accede a métodos del POM          │
   │                                                    │
   │  })                                                │
   └────────────────────────────────────────────────────┘
                          ▲
                          │
                          │


4. PAGE OBJECT MODEL (POM) - pages/InternalPortal.js
   ┌──────────────────────────────────────────────┐
   │       class LoginPage                        │
   │                                              │
   │  constructor(page) {  ◄── page del Playwright
   │    this.page = page;  ───────┐              │
   │    this.userID = page.locator(...)          │
   │    this.password = page.locator(...)        │
   │    this.signIn = page.getByRole(...)        │
   │  }                                           │
   │                                              │
   │  async gotoLoginPage() {                    │
   │    await this.page.goto(url) ────────────┐  │
   │  }                        │               │  │
   │                      Ejecuta acciones en  │  │
   │  async login(user, pwd) {       el browser │
   │    await this.userID.fill(user)          │  │
   │    await this.password.fill(pwd) ────────┤  │
   │    await this.signIn.click() ────────────┘  │
   │  }                                           │
   │                                              │
   └──────────────────────────────────────────────┘
              ▲
              │
              │ Controla
              ▼
   ┌──────────────────────────────────┐
   │    Browser (Chromium, Firefox)   │
   │    - Ejecuta clicks              │
   │    - Rellena inputs              │
   │    - Navega URLs                 │
   └──────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                           FLUJO DE DATOS EN VIVO                             │
└─────────────────────────────────────────────────────────────────────────────┘

Paso 1: Playwright Test inicia
  ┌─────────────────────────┐
  │ Crear Browser + Page    │
  │ (instancia del navegador)│
  └────────────┬────────────┘
               │ page = { goto, click, fill, ... }
               ▼

Paso 2: Fixture se ejecuta
  ┌─────────────────────────────────────────┐
  │ export const test = base.extend({       │
  │   loginPage: async ({ page }, use) => { │
  │     const loginPage = new LoginPage(page)
  │     ↓                                    │
  │     loginPage.page = page                │
  │     loginPage.userID_textbox = page...   │
  │                                          │
  │     await use(loginPage) ─┐              │
  └────────────────────────────┼──────────────┘
                               │
                         Disponible en test
                               ▼

Paso 3: Test recibe fixture
  ┌──────────────────────────────────┐
  │ test('login', async ({           │
  │   loginPage  ◄── Fixture          │
  │ }) => {                           │
  │   await loginPage.login('u','p')  │
  │          ▲                        │
  │          │ Llama método del POM   │
  │          └──────────┬─────────────┼──┐
  └──────────────────────┼────────────────┘
                         │
                         ▼
  ┌──────────────────────────────────┐
  │  LoginPage.login() {             │
  │    await this.userID_textbox.    │
  │           .fill('usuario')       │
  │                                  │
  │    await this.signIn_button.     │
  │           .click()               │
  └────────────────┬─────────────────┘
                   │ Acciona el navegador
                   ▼
        ┌──────────────────────┐
        │ Browser ejecuta:     │
        │ - Rellenar input     │
        │ - Clic en botón      │
        │ - Navegar resultado  │
        └──────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                    EJEMPLO COMPLETO: FLUJO DE DATOS                          │
└─────────────────────────────────────────────────────────────────────────────┘

FIXTURE:
┌─ loginPage fixture
│  ├─ Recibe: { page } del navegador
│  ├─ Crea: new LoginPage(page)
│  ├─ Expone:
│  │  ├─ loginPage.page (el page object de Playwright)
│  │  ├─ loginPage.userID_textbox (locator)
│  │  ├─ loginPage.password_textbox (locator)
│  │  ├─ loginPage.gotoLoginPage() (método)
│  │  └─ loginPage.login(username, password) (método)
│  └─ Pasa todo esto al test via use()
│

TEST:
┌─ test('login', async ({ loginPage }) => {
│  │
│  ├─ loginPage.gotoLoginPage()
│  │  └─ Internamente: await this.page.goto(url)
│  │     └─ El page object navega al navegador
│  │
│  ├─ loginPage.login('013309', 'secrete')
│  │  ├─ await this.userID_textbox.fill('013309')
│  │  │  └─ Rellena el input en el navegador
│  │  ├─ await this.password_textbox.fill('secrete')
│  │  │  └─ Rellena el password en el navegador
│  │  └─ await this.signIn_button.click()
│  │     └─ Hace clic en el navegador
│  │
│  └─ El test termina
│     └─ Fixture teardown (limpieza)
│

RESUMEN:
  Fixture ═══════► POM ═══════► Browser
  (setup)    (métodos)    (acciones reales)
   │             │            │
   └─ loginPage ─┴─ Encapsula la lógica
   └─ Inyecta en el test
   └─ Limpia después (teardown)