describe('DreamCars Hitelesítési Folyamat E2E Teszt', () => {
 
  const newUsername = 'Teszt Elek E2E';
  const newEmail = `test.e2e.${Date.now()}@dreamcars.hu`; 
  const newPassword = 'securepassword123';
  
  
  const baseUrl = 'http://localhost/dreamcars-nye-main'; 

  it('Sikeres regisztráció, bejelentkezés és kijelentkezés végrehajtása', () => {
    
    cy.log('1. Regisztráció indítása');
    cy.visit(`${baseUrl}/html/register.html`); 
    cy.title().should('include', 'Regisztráció');
    
   
    cy.get('#fullname').type(newUsername);
    cy.get('#email').type(newEmail);
    cy.get('#password').type(newPassword);
    
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/html/login.html'); 
    
    cy.log('2. Bejelentkezés indítása');
    
    cy.get('#email').type(newEmail);
    cy.get('#password').type(newPassword);
    
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/html/index.html');
    
  
    cy.get('#nav-links').contains(`👤 ${newUsername}`).should('be.visible');
    
   
    cy.log('3. Kijelentkezés indítása');
    
    cy.get('#nav-links').contains('Kijelentkezés').click();
  
    cy.url().should('include', '/html/index.html');
    
   
    cy.get('#nav-links').contains('Bejelentkezés').should('be.visible');
    cy.get('#nav-links').contains('Regisztráció').should('be.visible');
  });

  it('Hibás bejelentkezés tesztelése', () => {
    cy.log('Hibás bejelentkezés tesztelése');
    cy.visit(`${baseUrl}/html/login.html`);
 
    cy.get('#email').type('admin@gmail.com');
    cy.get('#password').type('notvalidpassword');
 
    cy.on('window:alert', (text) => {
      expect(text).to.eq('Hibás jelszó!');
    });
    
    cy.get('button[type="submit"]').click();
    
    
    cy.url().should('include', '/html/login.html');
  });
});