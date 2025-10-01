describe('Проверяем работу конструктора', () => {
  beforeEach(function () {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('http://localhost:4000/');
    cy.wait('@getIngredients');
  })

  it('Добавление булки', () => {
    cy.contains('Булочка с кунжутом')
      .closest('[data-testid=ingredient-card]')
      .find('button')
      .click();

    cy.get('[data-testid=constructor-bun-top]')
      .should('contain', 'Булочка с кунжутом');
    cy.get('[data-testid=constructor-bun-bottom]')
      .should('contain', 'Булочка с кунжутом');
  });

  it('Добавление начинки', () => {
    cy.contains('Котлета куриная')
      .closest('[data-testid=ingredient-card]')
      .find('button')
      .click();

    cy.get('[data-testid=constructor-fillings]')
      .should('contain', 'Котлета куриная');
  });
})
