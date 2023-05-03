describe('template spec', () => {
  const email = 'manager3@gmail.com';
  const password = '12345678';

  beforeEach(() => {
    //visit login
    cy.visit('http://localhost:4200/login');
    cy.get('#emailInput').type(email);
    cy.get('#passwordInput').type(password);
    //find input and click it
    cy.get('body > app-root > div > app-login > form > button').click();
    cy.wait(2000);
  });
  it('Edit tilte in trip', () => {
    //visit a trip
    cy.visit('http://localhost:4200/trips/64529f7b1c7d4754bc084f96');
    //check the title of the trip
    cy.get(
      'body > app-root > div > app-trip > div.container > div > div > div:nth-child(2) > h5'
    ).should('include.text', 'Fungerende trip funker ennå');
    //visit edit trip page
    cy.visit(
      'http://localhost:4200/trips/manage/edit/64529f7b1c7d4754bc084f96'
    );
    //find title input and change it
    cy.get('#title').clear().type('Changed name');
    //find save button and click it
    cy.get(
      'body > app-root > div > app-manage-trip > div > form > fieldset > button.btn.btn-warning.my-3'
    ).click();
    cy.wait(1000);
    //visit trip again
    cy.visit('http://localhost:4200/trips/64529f7b1c7d4754bc084f96');
    //check the new title
    cy.get(
      'body > app-root > div > app-trip > div.container > div > div > div:nth-child(2) > h5'
    ).should('include.text', 'Changed name');

    //set it back to normal

    //visit edit trip page
    cy.visit(
      'http://localhost:4200/trips/manage/edit/64529f7b1c7d4754bc084f96'
    );
    //find title input and change it
    cy.get('#title').clear().type('Fungerende trip funker ennå');
    //find save button and click it
    cy.get(
      'body > app-root > div > app-manage-trip > div > form > fieldset > button.btn.btn-warning.my-3'
    ).click();
    cy.visit('http://localhost:4200/trips/64529f7b1c7d4754bc084f96');
    //check if the title is set back
    cy.get(
      'body > app-root > div > app-trip > div.container > div > div > div:nth-child(2) > h5'
    ).should('include.text', 'Fungerende trip funker ennå');
  });
  //did not get time for this:
  /*  it('add stage', () => {
    cy.visit(
      'http://localhost:4200/trips/manage/edit/64529f7b1c7d4754bc084f96'
    );
    cy.get(
      'body > app-root > div > app-manage-trip > div > form > fieldset > div:nth-child(10) > button'
    ).click();
    cy.get('#title').type('testStage');
    cy.get('#description').type('testStage');
    cy.get(
      '/html/body/app-root/div/app-manage-trip/div/form/fieldset/div[6]/form/div[3]/input'
    ).type('testStage');
  }); */
});
