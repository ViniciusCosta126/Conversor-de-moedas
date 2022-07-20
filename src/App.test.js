import React from "react";
import ReactDOM from "react-dom";
import Conversor from "./conversor.jsx";
import { render, fireEvent } from "@testing-library/react";
import axiosMock from "axios";
import "@testing-library/jest-dom/extend-expect";

describe("Teste do componente de conversao de moedas", () => {
  it("Deve renderizar componente sem erros", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Conversor />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("Deve simular uma conversao de moedas", async () => {
    const { findByTestId, getByTestId } = render(<Conversor />);
    axiosMock.get.mockResolvedValueOnce({
      data: { success: true, rates: { BRL: 4.566, USD: 1.101 } },
    });
    fireEvent.click(getByTestId("btn-converter"));
    const modal = await findByTestId("modal");
    expect(axiosMock.get).toHaveBeenCalledTimes(1);
    expect(modal).toHaveTextContent("1 BRL = 0.24 USD");
  });
  
});
