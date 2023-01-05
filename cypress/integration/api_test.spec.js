describe('GET usuarios', function() {
    
    it('faz uma requisição HTTP', function() {
      cy.request({
        method: 'GET', 
        url: 'https://cac-tat.s3.eu-central-1.amazonaws.com/index.html'
      }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.statusText).to.equal('OK')
        expect(response.body).contain('CAC TAT')
      })  
    })

})    