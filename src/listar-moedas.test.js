import React from 'react';
import ReactDOM from 'react-dom';
import ListarMoedas from './Listar-Moedas.js'

describe("Teste de componente de listagem de moedas",()=>{
    it("Deve renderizar componente sem erros", ()=>{
        const div = document.createElement('div')
        ReactDOM.render(<ListarMoedas />, div)
        ReactDOM.unmountComponentAtNode(div)
    })
})