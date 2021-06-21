import { fireEvent, render, screen } from "@testing-library/react";
import Login from "../Pages/Home/Login";
import "@testing-library/jest-dom/extend-expect";

describe("Login Form Button", () => {
  it("should show Login Form", () => {
    render(<Login />);
  });

  it("signup button should run ", () => {
    render(<Login />);
    const signupButton = screen.getByRole("button", { name: "註冊" });
    fireEvent.click(signupButton);
  });

  it("login button should run ", () => {
    render(<Login />);
    const loginButton = screen.getByRole("button", { name: "登入" });
    fireEvent.click(loginButton);
  });

  it("google login button should run", () => {
    render(<Login />);
    const providerButton = screen.getByRole("button", { name: "Google 登入" });
    fireEvent.click(providerButton);
  });

  it("facebook login button should run", () => {
    render(<Login />);
    const providerButton = screen.getByRole("button", {
      name: "Facebook 登入",
    });
    fireEvent.click(providerButton);
  });
});

describe("Signup Form input valid", () => {
  it("signup name", () => {
    render(<Login />);
    const nameRegEx = /^[\u4e00-\u9fa5]+$|^[a-zA-Z\s]+$/;
    const test = "陳";
    const name = screen.getByTitle("signup-name");
    expect(name.value).toBe("");
    fireEvent.change(name, { target: { value: test } });
    expect(name.value).toMatch(nameRegEx);
  });

  it("signup email", () => {
    render(<Login />);
    const emailRegEx = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    const test = "example@test.com";
    const email = screen.getByTitle("signup-email");
    expect(email.value).toBe("");
    fireEvent.change(email, { target: { value: test } });
    expect(email.value).toMatch(emailRegEx);
  });

  it("signup password", () => {
    render(<Login />);
    const test = "123456789test/1";
    const password = screen.getByTitle("signup-password");
    expect(password.value).toBe("");
    fireEvent.change(password, { target: { value: test } });
    expect(password.value.length).toBeLessThan(16);
    expect(password.value.length).toBeGreaterThan(5);
  });
});
