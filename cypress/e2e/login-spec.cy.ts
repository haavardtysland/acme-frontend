describe('template spec', () => {
  const email = 'manager3@gmail.com';
  const password = '12345678';
  it('Go to login page', () => {
    cy.visit('http://localhost:4200/login');
    cy.get('#emailInput').type(email);
    cy.get('#passwordInput').type(password);
    cy.get('body > app-root > div > app-login > form > button').click();
    cy.wait(2000);
    /*   cy.get('#navbarSupportedContent > ul > li:nth-child(3) > a').click();
    cy.wait(2000); */
    cy.visit('http://localhost:4200/trips/64529f7b1c7d4754bc084f96');
    cy.get(
      'body > app-root > div > app-trip > div.container > div > div > div:nth-child(2) > h5'
    ).should('include.text', 'Fungerende trip funker ennå');
    cy.visit(
      'http://localhost:4200/trips/manage/edit/64529f7b1c7d4754bc084f96'
    );
    cy.get('#title').clear().type('Changed name');
    cy.get(
      'body > app-root > div > app-manage-trip > div > form > fieldset > button.btn.btn-warning.my-3'
    ).click();
    cy.wait(1000);
    cy.visit('http://localhost:4200/trips/64529f7b1c7d4754bc084f96');
    cy.get(
      'body > app-root > div > app-trip > div.container > div > div > div:nth-child(2) > h5'
    ).should('include.text', 'Changed name');
  });
});
