"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { User, Mail, Lock, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Wrapper from "../pageWrapper/wrapper";
import CardinalRotating from "../cardinal/CardinalRotating";

interface CustomFormProps {
  onSubmit: (formData: Record<string, string>) => void;
  placeholders: string[];
  error?: string;
  redirectUrl: string;
  title: string;
  inputTypes: string[];
  fieldNames: string[];
  redirectText: string;
  buttonText: string;
  linkText: string;
  children?: React.ReactNode;
  formType: "signup" | "login";
}

const CustomForm: React.FC<CustomFormProps> = ({
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
  formType,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, string>>(
    Object.fromEntries(fieldNames.map((fieldName) => [fieldName, ""]))
  );
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const iconsSignup = [User, Mail, Lock, Lock];
  const iconsLogin = [User, KeyRound];

  const icons = formType === "signup" ? iconsSignup : iconsLogin;

  useEffect(() => {
    setPasswordMismatch(false);
    setFormData(
      Object.fromEntries(fieldNames.map((fieldName) => [fieldName, ""]))
    );
  }, [formType, fieldNames]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (formType === "signup") {
      if (formData[fieldNames[2]] !== formData[fieldNames[3]]) {
        setPasswordMismatch(true);
        return;
      } else {
        setPasswordMismatch(false);
      }
    }

    onSubmit(formData);
  };

  return (
    <Wrapper className="h-screen flex flex-col justify-center items-center">
      <div className="noise bg-[url('/images/other/noise.webp')] bg-repeat h-screen w-screen fixed top-0 left-0"></div>
      <h1 className="text-center font-bold">{title}</h1>

      <div className="flex justify-center items-center p-6 bg-dynamic rounded-2xl w-72 mt-6 shadow-md">
        <div className="flex flex-col gap-4 w-full">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {fieldNames.map((fieldName, index) => {
              if (formType === "login" && fieldName === fieldNames[3])
                return null;

              return (
                <div className="relative w-full" key={fieldName + index}>
                  {React.createElement(icons[index] || User, {
                    className:
                      "absolute h-5 left-2 top-1/2 transform -translate-y-1/2 opacity-60 z-10",
                  })}
                  <Input
                    type={inputTypes[index]}
                    name={fieldName}
                    placeholder={placeholders[index]}
                    value={formData[fieldName]}
                    onChange={handleChange}
                    required
                    className="pl-10 rounded-xl border"
                  />
                </div>
              );
            })}
            {passwordMismatch && formType === "signup" && (
              <p className="text-red-500 text-sm">Passwords do not match</p>
            )}
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
      <CardinalRotating
        invert={false}
        position={"translate-y-[40rem] scale-[6] absolute z-[-1] "}
      />
    </Wrapper>
  );
};

export default CustomForm;
