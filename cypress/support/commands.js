Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(nome, sobrenome, email, comoAjudar) {  
    cy.get('#firstName').type(nome)
    cy.get('#lastName').type(sobrenome)
    cy.get('#email').type(email)
    cy.get('#open-text-area').invoke('val', comoAjudar)
    //cy.get('#open-text-area').type(longText, { delay: 0 }) tb funciona assim
    cy.contains('button', 'Enviar').click()
})

Cypress.Commands.add('selectProductByText', function(product) {  
    cy.get('#product').select(product)
})

Cypress.Commands.add('checkAttendanceType', function(type) {  
    cy.get('input[type="radio"]').check(type)
})