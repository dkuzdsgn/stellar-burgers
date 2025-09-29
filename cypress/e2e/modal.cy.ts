describe('Проверяем работу модальных окон', () => {
  beforeEach(function () {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('http://localhost:4000/');
    cy.wait('@getIngredients');
  })

  it('Открытие модального окна ингредиента', () => {
    cy.contains('Булочка с кунжутом').click();
    cy.get('[data-testid=modal]').should('be.visible');
    cy.get('[data-testid=modal]').should('contain', 'Булочка с кунжутом');
  });

  it('Закрытие по клику на крестик', () => {
    cy.contains('Булочка с кунжутом').click();
    cy.get('[data-testid=close-button]').click();
    cy.get('[data-testid=modal]').should('not.exist')
  });
})
