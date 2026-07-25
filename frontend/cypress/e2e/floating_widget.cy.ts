describe('GyanAI Floating Chatbot Widget End-to-End Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display floating launcher button on bottom-right corner', () => {
    cy.contains('GyanAI Digital Assistant').should('be.visible');
  });

  it('should open chat window when floating launcher is clicked', () => {
    cy.contains('GyanAI Digital Assistant').click();
    cy.contains('GyanAI').should('be.visible');
    cy.contains('Digital Library Intelligence Platform').should('be.visible');
  });

  it('should allow department selection and execute quick prompt query', () => {
    cy.contains('GyanAI Digital Assistant').click();
    cy.get('select').select('B.Tech');
    cy.contains('Find IEEE').click();
    cy.contains('IEEE Xplore Digital Library Access', { timeout: 10000 }).should('be.visible');
  });
});
