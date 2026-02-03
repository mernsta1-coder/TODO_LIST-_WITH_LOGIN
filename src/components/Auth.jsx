import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { useState } from "react";

function Auth({
  type,
  title,
  fields = [],
  buttonText,
  linkText,
  linkText2,
  onSubmit,
  textLabel,
  onClick,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const pathto = type === "register" ? "/" : "/register";

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    if (onSubmit) onSubmit(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-pink-200 to-blue-300">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-lg">
        <h1 className="text-white text-2xl sm:text-3xl font-bold text-center mb-6">
          {title}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((f) => (
            <div key={f.name} className="relative">
              <input
                type={
                  f.name === "password"
                    ? showPassword
                      ? "text"
                      : "password"
                    : f.name === "confirmpassword"
                    ? confirm
                      ? "text"
                      : "password"
                    : f.type
                }
                placeholder={f.placeholder}
                name={f.name}
                minLength={f.minLength}
                maxLength={f.maxLength}
                pattern={f.pattern}
                required={f.required}
                className="w-full px-4 py-3 rounded-xl text-center placeholder-white bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {(f.name === "password" || f.name === "confirmpassword") && (
                <span
                  onClick={() =>
                    f.name === "password"
                      ? setShowPassword(!showPassword)
                      : setConfirm(!confirm)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white"
                >
                  <FaEye />
                </span>
              )}
            </div>
          ))}

          <button
            type="submit"
            onClick={onClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
          >
            {buttonText}
          </button>
        </form>

        {linkText && (
          <p className="text-white text-center mt-4 text-sm">
            <span>{textLabel} </span>
            <Link to={pathto} className="text-blue-300 hover:underline">
              {linkText}
            </Link>
          </p>
        )}

        {linkText2 && (
          <p className="text-white text-center mt-2 text-sm">
            <Link to="/forgot" className="text-blue-300 hover:underline">
              {linkText2}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default Auth;
