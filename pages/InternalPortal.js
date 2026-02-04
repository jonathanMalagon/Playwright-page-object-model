exports.LoginPage = class InternalPortal {

   constructor(page){

        this.page = page;
        this.userID_textbox = page.locator('#userid')
        this.password_textbox = page.locator('#pwd');
        this.signIn_button = page.getByRole('button', { name: 'Sign In' });
   }

   async gotoLoginPage(){
        await this.page.goto('https://myapexinternal.apexsystemsinc.com/psp/INTERNAL/?cmd=login&languageCd=ENG&');
   }

   async login(username, password){
        await this.userID_textbox.fill(username);
        await this.password_textbox.fill(password);
        await this.signIn_button.click();
   }

} 