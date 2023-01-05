/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    const THREE_MLSECONDS = 3000
    beforeEach(function() {
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', function() {
        const longText = Cypress._.repeat('Test ABCaaaaaaaaaaTest', 10)
        cy.clock()

        cy.fillMandatoryFieldsAndSubmit("firstName", "lastName", "email@email.com", longText)
        cy.get('.success').should('be.visible')

        cy.tick(THREE_MLSECONDS)

        cy.get('.error').should('not.be.visible')
    })

    Cypress._.times(3, function() {
        it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
            cy.get('#firstName').type("firstName")
            cy.get('#lastName').type("lastName")
            cy.get('#email').type("emailemail.com")
            cy.get('#open-text-area').type("longText")
            cy.clock()
            cy.get('button[type="submit"]').click()
            
            cy.get('.error').should('be.visible')
            cy.tick(THREE_MLSECONDS) //adianta o relogio
            cy.get('.error').should('not.be.visible')
        })
    })

    it('verificar campo telefone só aceita valor numéricos', function() {
        cy.get('#phone')
          .type("aaaaaa")
          .should('have.value','')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
        cy.get('#firstName').type("firstName")
        cy.get('#lastName').type("lastName")
        cy.get('#email').type("email@email.com")
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type("longText")
        cy.get('button[type="submit"]').click()
        
        cy.get('.error').should('be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function() {
        cy.get('#firstName')
            .type("firstName")
            .should('have.value', 'firstName')
            .clear()
            .should('have.value', '')
        cy.get('#lastName').type("lastName").should('have.value', 'lastName')
            .clear()
            .should('have.value', '')
        cy.get('#email')
            .type("email@email.com")
            .should('have.value', 'email@email.com')
            .clear()
            .should('have.value', '')
        cy.get('#phone').type("1111111111").should('have.value', '1111111111')
        .clear()
        .should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function() {
        cy.get('button[type="submit"]').click()
        cy.get('.error').should('be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', function() {
        const longText = Cypress._.repeat('Test ABCaaaaaaaaaaTest', 10)
        cy.fillMandatoryFieldsAndSubmit("first", "last", "email@email.com", longText)
        cy.get('.success').should('be.visible')
        
    })

    it('seleciona um produto (YouTube) por seu texto', function() {
        cy.selectProductByText("YouTube").should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function() {
        cy.selectProductByText("mentoria").should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function() {
        cy.selectProductByText(1).should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', function() {
        cy.checkAttendanceType('elogio').should('have.value', 'elogio')
    })

    it('marca cada tipo de atendimento', function() {
        cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(function(radio) { //LIKE FOREACH. ESSE EACH É REFERENTE AOS ELEMENTOS RETORNADOS NA LINHA 98, OS ELEMENTOS DO TIPO RADIO BUTTON
                cy.wrap(radio).check()
                cy.wrap(radio).should('be.checked')
            })
    })

    it('marca ambos checkboxes, depois desmarca o último', function() {
        cy.get('#check input[type="checkbox"]')
            .check()
            .should('be.checked')
            .last()
            .uncheck()
            .should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', function() {
        cy.get('#file-upload')
            .selectFile('cypress/fixtures/example.json')
            //.selectFile('cypress/fixtures/example.json', { action : 'drag-drop' }) //simulando drag and drop
            .should(function(file){
                expect(file[0].files[0].name).to.be.equals('example.json')
            })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function() {
        cy.fixture('example2.json').as('exampleFeature')
        cy.get('#file-upload')
            .selectFile('@exampleFeature')
            //.selectFile('cypress/fixtures/example.json', { action : 'drag-drop' }) //simulando drag and drop
            .should(function(file){
                expect(file[0].files[0].name).to.be.equals('example2.json')
            })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function() {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade (deveria abrir em outra pagina) removendo o target e então clicando no link', function() {
        cy.get('#privacy > :nth-child(1)').invoke('removeAttr', 'target').click()
        cy.get('#white-background').should('be.visible')
    })

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke()', function() {
        cy.get('.success')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Mensagem enviada com sucesso.')
            .invoke('hide')
            .should('not.be.visible')
        cy.get('.error')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Valide os campos obrigatórios!')
            .invoke('hide')
            .should('not.be.visible')
    })

    it('faz uma requisição HTTP', function() {
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
            .should(function(response) {
                const {status, statusText, body} = response //desestruturando um objeto. Pegando de um objeto somente as informações desejadas
                expect(status).to.equal(200)
                expect(statusText).to.equal('OK')
                expect(body).to.include('CAC TAT')
            })
          
    })
    
    it.only('Achando o gato', function() {
        cy.get('#cat')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
    })
})
