import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

// ARRANGE, ACT, ASSERT

test("renders without errors", () => {
  render(<ContactForm />);
});

test("renders the contact form header", () => {
  render(<ContactForm />);
  const header = screen.queryByText(/contact form/i);
  expect(header).toBeInTheDocument();
  expect(header).toBeTruthy();
  expect(header).toHaveTextContent(/contact form/i);
});

test("renders ONE error message if user enters less then 5 characters into firstname.", async () => {
  // THIS METHOD IS OUTDATED, CHECK GUIDED PROJECT FOR LATEST PRACTICE
  render(<ContactForm />);
  const firstNameField = screen.getByLabelText(/first name*/i);
  userEvent.type(firstNameField, "123");
  const errorMessages = await screen.findAllByTestId("error");
  expect(errorMessages).toHaveLength(1);
});

test("renders THREE error messages if user enters no values into any fields.", async () => {
  render(<ContactForm />);
  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);
  await waitFor(() => {
    const errorMessages = screen.queryAllByTestId("error");
    expect(errorMessages).toHaveLength(3);
  });
});

test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
  render(<ContactForm />);
  const fNameField = screen.getByLabelText(/first name*/i);
  const lNameField = screen.getByLabelText(/last name*/i);
  const button = screen.getByRole("button");

  userEvent.type(fNameField, "edison");
  userEvent.type(lNameField, "jeon");
  userEvent.click(button);

  const errorMessages = await screen.getAllByTestId("error");
  expect(errorMessages).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />);
  const emailField = screen.getByLabelText(/email*/i);
  userEvent.type(emailField, "not good format");
  const errorMessage = await screen.findByText(
    /email must be a valid email address/i
  );

  expect(errorMessage).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />);

  const button = screen.getByRole("button");
  userEvent.click(button);

  const errorMessage = await screen.findByText(/lastName is a required field/i);
  expect(errorMessage).toBeInTheDocument();
});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
  render(<ContactForm />);

  const fNameField = screen.getByLabelText(/first name*/i);
  const lNameField = screen.getByLabelText(/last name*/i);
  const emailField = screen.getByLabelText(/email*/i);

  userEvent.type(fNameField, "edison");
  userEvent.type(lNameField, "jeon");
  userEvent.type(emailField, "example@gmail.com");

  const button = screen.getByRole("button");
  userEvent.click(button);

  await waitFor(() => {
    const fNameDisplay = screen.queryByText("edison");
    const lNameDisplay = screen.queryByText("jeon");
    const emailDisplay = screen.queryByText("example@gmail.com");
    const messageDisplay = screen.queryByTestId("messageDisplay");

    expect(fNameDisplay).toBeInTheDocument();
    expect(lNameDisplay).toBeInTheDocument();
    expect(emailDisplay).toBeInTheDocument();
    expect(messageDisplay).not.toBeInTheDocument();
  });
});

test("renders all fields text when all fields are submitted.", async () => {
  render(<ContactForm />);

  const fNameField = screen.getByLabelText(/first name*/i);
  const lNameField = screen.getByLabelText(/last name*/i);
  const emailField = screen.getByLabelText(/email*/i);
  const messageField = screen.getByLabelText(/message/i);

  userEvent.type(fNameField, "johnny");
  userEvent.type(lNameField, "doe");
  userEvent.type(emailField, "example@gmail.com");
  userEvent.type(messageField, "message");

  const button = screen.getByRole("button");
  userEvent.click(button);

  await waitFor(() => {
    const fNameDisplay = screen.queryByText(/john/i);
    const lNameDisplay = screen.queryByText(/doe/i);
    const emailDisplay = screen.queryByText("example@gmail.com");
    const messageDisplay = screen.queryByTestId(/message/i);

    expect(fNameDisplay).toBeInTheDocument();
    expect(lNameDisplay).toBeInTheDocument();
    expect(emailDisplay).toBeInTheDocument();
    expect(messageDisplay).toBeInTheDocument();
  });
});
