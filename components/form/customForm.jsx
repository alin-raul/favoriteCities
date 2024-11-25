"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Wrapper from "../pageWrapper/wrapper";

const CustomForm = ({
  onSubmit,
  placeholders,
  error,
  redirectUrl,
  title,
  inputTypes,
  fieldNames,
  redirectText,
  buttonText,
  linkText,
  children,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    [fieldNames[0]]: "",
    [fieldNames[1]]: "",
    [fieldNames[2]]: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass the form data back to the parent
  };

  return (
    <Wrapper className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-center font-bold">{title}</h1>

      <div className="flex justify-center items-center p-6 bg-dynamic rounded-2xl w-72 mt-6 shadow-md">
        <div className="flex flex-col gap-4 w-full">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {fieldNames.map((fieldName, index) => (
              <Input
                key={fieldName}
                type={inputTypes[index]}
                name={fieldName}
                placeholder={placeholders[index]}
                value={formData[fieldName]}
                onChange={handleChange}
                required
                className="p-2 rounded-xl border"
              />
            ))}
            <Button
              type="submit"
              className="bg-blue-500 text-white hover:bg-blue-700 py-2 rounded-2xl"
            >
              {buttonText}
            </Button>
          </form>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          {children && <>{children}</>}

          <p className="text-center text-sm mt-4">
            <span className="opacity-60">{redirectText} </span>
            <Button
              onClick={() => router.push(redirectUrl)}
              variant="link"
              className="text-blue-500 p-0"
            >
              {linkText}
            </Button>
          </p>
        </div>
      </div>
    </Wrapper>
  );
};

export default CustomForm;
