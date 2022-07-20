import React, { useState } from "react";
import "./Conversor.css";
import ListarMoedas from "./Listar-Moedas.js";
import { Button, Form, Col, Row, Spinner, Alert, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Conversor = () => {
  const [valor, setValor] = useState("1");
  const [moedaDe, setMoedaDe] = useState("BRL");
  const [moedaPara, setMoedaPara] = useState("USD");
  const [exibirSpinner, setExibirSppiner] = useState(false);
  const [formValidado, setFormValidado] = useState(false);
  const [exibirModal, setExibirModal] = useState(false);
  const [resultadoConversao, setResultadoConversao] = useState("");
  const [exibirMensagem, setExibirMensagem] = useState(false);

  const FIXER_URL =
    "http://data.fixer.io/api/latest?access_key=3cb92c07fc096154460fe613ad541d17&format=1";

  function handleInput(event) {
    setValor(event.target.value.replace(/\D/g, ""));
  }

  function handleMoedaDe(event) {
    setMoedaDe(event.target.value);
  }

  function handleMoedaPara(event) {
    setMoedaPara(event.target.value);
  }

  function handlefecharModal(event) {
    setValor("1");
    setMoedaDe("BRL");
    setMoedaPara("USD");
    setFormValidado(false);
    setExibirModal(false);
  }

  function converter(event) {
    event.preventDefault();
    setFormValidado(true);

    if (event.currentTarget.checkValidity() === true) {
      setExibirSppiner(true);
      axios
        .get(FIXER_URL)
        .then((res) => {
          const cotacao = obterCotacao(res.data);
          if (cotacao) {
            setResultadoConversao(
              `${valor} ${moedaDe} = ${cotacao} ${moedaPara}`
            );
            setExibirModal(true);
            setExibirSppiner(false);
            setExibirMensagem(false)
          }else{
              exibirErro()
          }
        })
        .catch((err) => exibirErro());
    }
  }

  function obterCotacao(dadosCotacao) {
    if (!dadosCotacao || dadosCotacao.success !== true) {
      return false;
    }
    const cotacaoDe = dadosCotacao.rates[moedaDe];
    const cotacaoPara = dadosCotacao.rates[moedaPara];
    const cotacao = (1 / cotacaoDe) * cotacaoPara * valor;
    return cotacao.toFixed(2);
  }

  function exibirErro() {
    setExibirMensagem(true);
    setExibirSppiner(false);
  }
  return (
    <>
      <h1>Conversor de Moedas</h1>
      <Alert variant="danger" show={exibirMensagem}>
        Erro obtendo dados de conversao, tente novamente
      </Alert>
      <div
        style={{
          backgroundColor: "#33333338",
          minHeight: "200px",
          padding: "20px",
        }}
      >
        <Form
          style={{ marginTop: "50px" }}
          onSubmit={converter}
          noValidate
          validated={formValidado}
        >
          <Row>
            <Col sm="3">
              <Form.Control
                type="text"
                placeholder="0"
                value={valor}
                required
                onChange={handleInput}
              />
            </Col>

            <Col sm="3">
              <Form.Control
                as="select"
                value={moedaDe}
                onChange={handleMoedaDe}
              >
                <ListarMoedas />
              </Form.Control>
            </Col>

            <Col sm="1" className="text-center" style={{ paddingTop: "5px" }}>
              <FontAwesomeIcon icon={faAngleDoubleRight}></FontAwesomeIcon>
            </Col>

            <Col sm="3">
              <Form.Control
                as="select"
                value={moedaPara}
                onChange={handleMoedaPara}
              >
                <ListarMoedas />
              </Form.Control>
            </Col>

            <Col sm="2">
              <Button variant="success" type="submit" data-testid="btn-converter">
                <span className={exibirSpinner ? null : "hidden"}>
                  <Spinner animation="border" size="sm" />
                </span>
                <span className={exibirSpinner ? "hidden" : null}>
                  Converter
                </span>
              </Button>
            </Col>
          </Row>
        </Form>

        <Modal show={exibirModal} onHide={handlefecharModal} data-testid="modal">
          <Modal.Header closeButton>
            <Modal.Title>Conversao</Modal.Title>
          </Modal.Header>

          <Modal.Body>{resultadoConversao}</Modal.Body>

          <Modal.Footer>
            <Button variant="success" onClick={handlefecharModal}>
              Nova conversão
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Conversor;
