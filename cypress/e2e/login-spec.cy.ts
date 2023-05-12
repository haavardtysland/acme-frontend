import 'cypress-xpath';

const email = 'manager@mail.com';
const password = '12345678';
const tripId = '645e88beea4c72e815eaf165';
describe('template spec', () => {
  beforeEach(() => {
    //visit login
    cy.visit('http://localhost:4200/login');
    cy.get('#emailInput').type(email);
    cy.get('#passwordInput').type(password);
    //find input and click it
    cy.get('body > app-root > div > app-login > form > button').click();
    cy.wait(2000);
  });

  it('Change trip title to Venga', () => {
    changeTripName('Venga');
  });

  it('Check if trip has changed name', () => {
    cy.visit(`http://localhost:4200/trips/${tripId}`);
    cy.contains('Venga');
  });

  it('Change back', () => {
    changeTripName('Trip to Norway');
  });
});

const changeTripName = (name: string) => {
  cy.visit(`http://localhost:4200/trips/manage/edit/${tripId}`);
  cy.xpath(
    '/html/body/app-root/div/app-manage-trip/div/form/fieldset/div[1]/input'
  )
    .clear()
    .type(name);
  cy.xpath(
    '/html/body/app-root/div/app-manage-trip/div/form/fieldset/button[1]'
  ).click();
  cy.xpath(
    '/html/body/app-root/div/app-manage-trip/app-custom-dialog/div/div/div/button[1]'
  ).click();
};
