import {
  Button,
  PasswordInput,
  SegmentedControl,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconMedicalCross } from "@tabler/icons-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../Services/UserService";
import {
  errorNotification,
  successNotification,
} from "../Utility/Notifications";

const RegisterPage = () => {
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  interface RegisterFormValues {
    role: string;
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
  }

  const form = useForm<RegisterFormValues>({
    initialValues: {
      role: "PATIENT",
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
    validate: {
      name: (value) => (!value ? "Name is required" : null),
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email format",
      password: (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*()\-+])[A-Za-z\d!@#$%&*()\-+]{8,}$/.test(
          value
        )
          ? null
          : "Password must be 8+ characters with upper, lower, number & symbol.",
      passwordConfirmation: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    setloading(true);
    registerUser(values)
      .then(() => {
        successNotification("Registration successful!");
        navigate("/login");
      })
      .catch((error) => {
        errorNotification(
          error?.response?.data?.errorMessage || "Registration failed"
        );
      })
      .finally(() => {
        setloading(false);
      });
  };

  return (
    <div className="relative flex items-center justify-center h-screen w-screen overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="flex gap-2.5 items-center mb-8">
          <div className="p-2.5 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl shadow-lg shadow-primary-500/30">
            <IconMedicalCross size={24} stroke={2.5} className="text-white" />
          </div>
          <span className="font-heading font-bold text-2xl bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
            HealthFlex
          </span>
        </div>

        <div className="w-[450px] rounded-2xl bg-neutral-900/60 backdrop-blur-xl border border-primary-500/20 shadow-2xl shadow-primary-500/10 p-10">
          <form
            onSubmit={form.onSubmit(handleSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col items-center gap-2 mb-2">
              <h1 className="font-heading font-semibold text-2xl text-white">
                Create Account
              </h1>
              <p className="text-neutral-400 text-sm">Join HealthFlex today</p>
            </div>

            <SegmentedControl
              {...form.getInputProps("role")}
              fullWidth
              size="md"
              radius="md"
              data={[
                { label: "Patient", value: "PATIENT" },
                { label: "Doctor", value: "DOCTOR" },
                { label: "Admin", value: "ADMIN" },
              ]}
              styles={{
                root: {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(244, 63, 94, 0.2)",
                },
                label: {
                  color: "white",
                  fontWeight: 300,
                },
                indicator: {
                  background: "linear-gradient(to right, #fb7185, #e11d48)",
                },
              }}
            />

            <TextInput
              size="md"
              radius="md"
              placeholder="Enter full name"
              {...form.getInputProps("name")}
              styles={{
                input: {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderColor: "rgba(244, 63, 94, 0.2)",
                  color: "white",
                  "&:focus": {
                    borderColor: "#f43f5e",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                  "&::placeholder": {
                    color: "rgba(255, 255, 255, 0.4)",
                  },
                },
              }}
            />

            <TextInput
              size="md"
              radius="md"
              placeholder="Enter your email"
              {...form.getInputProps("email")}
              styles={{
                input: {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderColor: "rgba(244, 63, 94, 0.2)",
                  color: "white",
                  "&:focus": {
                    borderColor: "#f43f5e",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                  "&::placeholder": {
                    color: "rgba(255, 255, 255, 0.4)",
                  },
                },
              }}
            />

            <PasswordInput
              size="md"
              radius="md"
              placeholder="Enter your password"
              {...form.getInputProps("password")}
              styles={{
                input: {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderColor: "rgba(244, 63, 94, 0.2)",
                  color: "white",
                  "&:focus": {
                    borderColor: "#f43f5e",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                  "&::placeholder": {
                    color: "rgba(255, 255, 255, 0.4)",
                  },
                },
                visibilityToggle: {
                  color: "#fb7185",
                  "&:hover": {
                    backgroundColor: "rgba(244, 63, 94, 0.1)",
                  },
                },
              }}
            />

            <PasswordInput
              size="md"
              radius="md"
              placeholder="Confirm password"
              {...form.getInputProps("passwordConfirmation")}
              styles={{
                input: {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderColor: "rgba(244, 63, 94, 0.2)",
                  color: "white",
                  "&:focus": {
                    borderColor: "#f43f5e",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                  "&::placeholder": {
                    color: "rgba(255, 255, 255, 0.4)",
                  },
                },
                visibilityToggle: {
                  color: "#fb7185",
                  "&:hover": {
                    backgroundColor: "rgba(244, 63, 94, 0.1)",
                  },
                },
              }}
            />

            <Button
              loading={loading}
              type="submit"
              size="md"
              radius="md"
              fullWidth
              className="bg-gradient-to-r from-primary-400 to-primary-600 hover:from-primary-500 hover:to-primary-700 text-white font-semibold"
            >
              Create Account
            </Button>

            <div className="text-sm self-center text-neutral-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary-400 hover:text-primary-300 font-medium underline transition-colors"
              >
                Sign In
              </Link>
            </div>
          </form>
        </div>

        <div className="mt-6 text-neutral-500 text-xs">
          ©2026 HealthFlex. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
