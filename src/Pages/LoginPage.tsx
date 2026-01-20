import { Button, PasswordInput, TextInput } from "@mantine/core";
import { IconMedicalCross } from "@tabler/icons-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { loginUser } from "../Services/UserService";
import {
  errorNotification,
  successNotification,
} from "../Utility/Notifications";
import { useDispatch } from "react-redux";
import { setJwt } from "../Slices/JwtSlice";
import { jwtDecode } from "jwt-decode";
import { setUser } from "../Slices/UserSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const [loading, setloading] = React.useState(false);
  const navigate = useNavigate();
  interface LoginFormValues {
    email: string;
    password: string;
  }

  const form = useForm<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value: string) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email",
      password: (value: string) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*()\-+])[A-Za-z\d!@#$%&*()\-+]{8,}$/.test(
          value
        )
          ? null
          : "Password must be 8+ characters with upper, lower, number & symbol.",
    },
  });

  const handleSubmit = (values: LoginFormValues) => {
    setloading(true);
    loginUser(values)
      .then((data) => {
        successNotification("Login successful!");
        const user: any = jwtDecode(data);
        dispatch(setJwt(data));
        dispatch(setUser(user));
        navigate(`/${user?.role?.toLowerCase()}/dashboard`);
      })
      .catch((error) => {
        errorNotification(
          error?.response?.data?.errorMessage || "Login failed"
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
                Welcome Back
              </h1>
              <p className="text-neutral-400 text-sm">
                Sign in to continue to HealthFlex
              </p>
            </div>

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

            <Button
              type="submit"
              loading={loading}
              size="md"
              radius="md"
              fullWidth
              className="bg-gradient-to-r from-primary-400 to-primary-600 hover:from-primary-500 hover:to-primary-700 text-white font-semibold"
            >
              Sign In
            </Button>

            <div className="text-sm self-center text-neutral-400">
              Don't have an account ?{" "}
              <Link
                to="/register"
                className="text-primary-400 hover:text-primary-300 font-medium underline transition-colors"
              >
                Create Account
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

export default LoginPage;
