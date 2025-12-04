import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authAxios } from "../api/AuthAxios";
import { Link } from "react-router-dom";
// import { authAxios } from "../api/AuthAxios";

// CreateAccountForm.jsx
// Tailwind-based React component styled to resemble ChatGPT's simple, clean auth UI.
// - Fields: email, username, first name, last name, password, confirm password
// - Password visibility toggle, strength meter, client-side validation
// - Accessible labels, keyboard-friendly, subtle animations with Framer Motion

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    username: "",
    firstname: "",
    lastname: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));

    // live clear of specific error
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const err = {};
    if (!form.email) err.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = "Enter a valid email.";

    if (!form.username) err.username = "Choose a username.";
    else if (!/^[a-zA-Z0-9._-]{3,30}$/.test(form.username))
      err.username =
        "Username: 3-30 chars; letters, numbers, dot, underscore, hyphen.";

    if (!form.firstname) err.firstname = "First name required.";
    if (!form.lastname) err.lastname = "Last name required.";

    if (!form.password) err.password = "Password is required.";
    else if (form.password.length < 8)
      err.password = "Password must be 8+ characters.";

    return err;
  };

  const passwordStrength = (pw) => {
    if (!pw) return { score: 0, label: "Empty" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const labels = ["Very weak", "Weak", "Okay", "Good", "Strong"];
    return { score, label: labels[score] };
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;

    setSubmitting(true);
    try {
      const response = await authAxios.post("/register", form, {
        withCredentials: true, // If your API uses cookies/sessions
      });
      console.log("Registration successful:", response.data);
      navigate("/login");

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

  const pwInfo = passwordStrength(form.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-inter">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="w-full max-w-md bg-white border border-slate-200 shadow-sm rounded-2xl p-6"
      >
        <header className="mb-4">
          <h1 className="text-2xl font-semibold">Create an account</h1>
          <p className="mt-1 text-sm text-slate-500">
            Welcome — join and get started with a free account.
          </p>
        </header>

        <form onSubmit={onSubmit} noValidate>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col" htmlFor="firstname">
              <span className="text-xs text-slate-600">First name</span>
              <input
                id="firstname"
                name="firstname"
                value={form.firstname}
                onChange={onChange}
                className={`mt-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-slate-300 ${
                  errors.firstname ? "border-rose-400" : "border-slate-200"
                }`}
                placeholder="John"
                autoComplete="given-name"
              />
              {errors.firstname && (
                <span className="text-rose-600 text-xs mt-1">
                  {errors.firstname}
                </span>
              )}
            </label>

            <label className="flex flex-col" htmlFor="lastname">
              <span className="text-xs text-slate-600">Last name</span>
              <input
                id="lastname"
                name="lastname"
                value={form.lastname}
                onChange={onChange}
                className={`mt-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-slate-300 ${
                  errors.lastname ? "border-rose-400" : "border-slate-200"
                }`}
                placeholder="Doe"
                autoComplete="family-name"
              />
              {errors.lastname && (
                <span className="text-rose-600 text-xs mt-1">
                  {errors.lastname}
                </span>
              )}
            </label>
          </div>

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

          <label className="flex flex-col mt-3" htmlFor="username">
            <span className="text-xs text-slate-600">Username</span>
            <input
              id="username"
              name="username"
              value={form.username}
              onChange={onChange}
              className={`mt-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-slate-300 ${
                errors.username ? "border-rose-400" : "border-slate-200"
              }`}
              placeholder="yourusername"
              autoComplete="username"
            />
            {errors.username && (
              <span className="text-rose-600 text-xs mt-1">
                {errors.username}
              </span>
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
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <div>
                Strength: <span className="font-medium">{pwInfo.label}</span>
              </div>
              <div className="w-24 h-2 bg-slate-100 rounded overflow-hidden">
                <div
                  className={`h-full rounded transition-all duration-200`}
                  style={{ width: `${(pwInfo.score / 4) * 100}%` }}
                />
              </div>
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
            {submitting ? "Creating account..." : "Create account"}
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
          <Link to="/login" className="font-medium underline">
            Login Here
          </Link>
        </footer>
      </motion.div>
    </div>
  );
}