import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authAxios } from "../api/AuthAxios";

export default function LoginForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));

    // live clear of specific error
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  };

  const validate = () => {
    const err = {};
    if (!form.email) err.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = "Enter a valid email address.";

    if (!form.password) err.password = "Password is required.";

    return err;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);

    if (Object.keys(err).length) return;

    setSubmitting(true);
    try {
      const response = await authAxios.post("/login", form, {
        withCredentials: true, // If your API uses cookies/sessions
      });
      console.log("Registration successful:", response.data);
      navigate("/home");

      // Handle successful registration (e.g., redirect user)
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Registration failed: Bad Request", error.response.data);
        // Display specific error message to the user,
        // e.g., 'error.response.data.message' or 'error.response.data.errors'
        // if your server provides detailed error messages in the response body.
        alert(
          `Registration failed: ${
            error.response.data.message || "Please check your input."
          }`
        );
      } else {
        console.error("An unexpected error occurred:", error);
        alert("An unexpected error occurred during registration.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-inter">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="w-full max-w-md bg-white border border-slate-200 shadow-sm rounded-2xl p-6"
      >
        <header className="mb-4">
          <h1 className="text-2xl font-semibold">Login to your account</h1>
          <p className="mt-1 text-sm text-slate-500">
            Welcome — join and get started with a free account.
          </p>
        </header>

        <form onSubmit={onSubmit} noValidate>
          <label className="flex flex-col mt-3" htmlFor="email">
            <span className="text-xs text-slate-600">Email</span>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              className={`mt-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-slate-300 ${
                errors.email ? "border-rose-400" : "border-slate-200"
              }`}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && (
              <span className="text-rose-600 text-xs mt-1">{errors.email}</span>
            )}
          </label>

          <div className="mt-3">
            <label className="text-xs text-slate-600">Password</label>
            <div className="relative mt-1">
              <input
                name="password"
                value={form.password}
                onChange={onChange}
                type={showPassword ? "text" : "password"}
                className={`w-full px-3 py-2 rounded-lg border pr-10 focus:outline-none focus:ring-2 focus:ring-slate-300 ${
                  errors.password ? "border-rose-400" : "border-slate-200"
                }`}
                placeholder="Create a password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-rose-600 text-xs mt-1 block">
                {errors.password}
              </span>
            )}
          </div>

          <div className="mt-3">
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded focus:outline-none"
            ></button>
          </div>

          {errors.form && (
            <div className="text-rose-600 text-sm mt-3">{errors.form}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 bg-slate-900 text-white text-sm font-medium hover:opacity-95 disabled:opacity-60"
          >
            {submitting ? "Logging in to account..." : "Login to account"}
          </button>

          <div className="mt-4 text-center text-sm text-slate-500">
            By continuing, you agree to the{" "}
            <a href="#" className="underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            .
          </div>
        </form>

        <footer className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/" className="font-medium underline">
            Register Now
          </Link>
        </footer>
      </motion.div>
    </div>
  );
}
