import { findAllByRole, render, screen } from "@testing-library/react";
import App from "./App";

describe("render", () => {
  test("render App", () => {
    render(<App />);
  });
});
