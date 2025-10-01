describe('Создание заказа', () => {
  beforeEach(function () {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');

    cy.visit('http://localhost:4000/');
    cy.window().then((win: Window) => {
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
    });
    cy.setCookie('accessToken', 'test-access-token');
    cy.wait('@getIngredients');

  })

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  })

  it('Создание заказа', () => {
    cy.contains('Булочка с кунжутом')
      .closest('[data-testid=ingredient-card]')
      .find('button')
      .click();

    cy.get('[data-testid=constructor-bun-top]')
      .should('contain', 'Булочка с кунжутом');
    cy.get('[data-testid=constructor-bun-bottom]')
      .should('contain', 'Булочка с кунжутом');

    cy.contains('Котлета куриная')
      .closest('[data-testid=ingredient-card]')
      .find('button')
      .click();

    cy.get('[data-testid=constructor-fillings]')
      .should('contain', 'Котлета куриная');

    cy.get('[data-testid=order-button]').click();
    cy.wait('@createOrder');
    cy.get('[data-testid=modal]').should('be.visible');

    cy.get('[data-testid=modal]').should('contain', '123');

    cy.get('[data-testid=close-button]').click();
    cy.get('[data-testid=modal]').should('not.exist');

    cy.get('[data-testid=constructor-bun-top]').should('not.exist');
    cy.get('[data-testid=constructor-bun-bottom]').should('not.exist');

    cy.get('[data-testid=constructor-fillings]')
      .find('[ddata-testid=constructor-filling]')
      .should('have.length', 0);
  });
})