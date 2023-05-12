import 'cypress-xpath';

describe('Trip Search', () => {
  const searchWord = 'trip';

  beforeEach(() => {
    cy.visit('http://localhost:4200');
  });

  it('The trip button exists', () => {
    cy.contains('Trip');
  });

  it('You can navigate to trip page with button', () => {
    changePage();
    cy.url().should('eq', 'http://localhost:4200/trips');
  });

  it('Search for Trip and Display info', () => {
    changePage();
    searchAndClick();

    cy.xpath('/html/body/app-root/div/app-trips/div')
      .find('div')
      .first()
      .click();

    cy.url().should(
      'eq',
      'http://localhost:4200/trips/645e6a10ea4c72e815eaede4'
    );

    cy.contains('Money');
    cy.contains('Phone');
    cy.contains('Good mood');
    cy.contains('Trip to malaga with bus');
    cy.contains('Price: € 25');
    cy.contains('Spend day at the beach');
  });
});

const changePage = () => {
  cy.xpath('/html/body/app-root/app-header/nav/div/div/ul/li[2]/a').click();
};

const searchAndClick = () => {
  cy.xpath('/html/body/app-root/div/app-trips/form/div/input').type(
    'Trip to malaga with bus'
  );
  cy.xpath('/html/body/app-root/div/app-trips/form/button[1]').click();
};
