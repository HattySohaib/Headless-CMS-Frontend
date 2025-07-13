import { useState } from "react";

const usePasswordValidation = () => {
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validatePassword = (password) => {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasCapital = /[A-Z]/;
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
      setErrorMessage("Password must be at least 8 characters long");
      setIsValid(false);
      return;
    }
    if (!hasNumber.test(password)) {
      setErrorMessage("Password must contain at least one number");
      setIsValid(false);
      return;
    }
    if (!hasCapital.test(password)) {
      setErrorMessage("Password must contain at least one capital letter");
      setIsValid(false);
      return;
    }
    if (!hasSymbol.test(password)) {
      setErrorMessage("Password must contain at least one symbol");
      setIsValid(false);
      return;
    }

    setErrorMessage("");
    setIsValid(true);
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  return {
    password,
    isValid,
    errorMessage,
    handlePasswordChange,
  };
};

export default usePasswordValidation;
