import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AtSign, Eye, EyeOff, Loader, Lock, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { registerUser, resetMessages } from "@/features/auth/authSlice";
import { registerValidationSchema } from "@/features/auth/validationSchemas";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/lib/srote";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { status, error, successMessage } = useSelector(
    (state: RootState) => state.auth
  );

  const formik = useFormik({
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: registerValidationSchema,
    onSubmit: (values) => {
      const { confirm_password, ...newUser } = values;
      dispatch(registerUser(newUser));
    },
    onReset: () => {
      formik.resetForm();
    },
  });
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetMessages());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(resetMessages());
    }
  }, [error, successMessage, dispatch]);
  return (
    <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
      <div className="space-y-4">
        <div className="flex flex-col">
          <div className="relative">
            <AtSign
              className={cn(
                formik.touched.confirm_password &&
                  formik.errors.confirm_password
                  ? "text-red-500"
                  : "text-gray-500",
                "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
              )}
            />
            <Input
              type="email"
              placeholder="masukan email anda"
              className={cn(
                formik.touched.confirm_password &&
                  formik.errors.confirm_password
                  ? "border-red-500"
                  : "",
                "w-full pl-10 pr-4 py-2"
              )}
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <p className="text-xs text-red-600 text-end mt-1">
              {formik.errors.email}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <div className="relative">
            <User
              className={cn(
                formik.touched.confirm_password &&
                  formik.errors.confirm_password
                  ? "text-red-500"
                  : "text-gray-500",
                "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
              )}
            />
            <Input
              type="text"
              placeholder="masukan nama depan"
              className={cn(
                formik.touched.confirm_password &&
                  formik.errors.confirm_password
                  ? "border-red-500"
                  : "",
                "w-full pl-10 pr-4 py-2"
              )}
              name="first_name"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.first_name && formik.errors.first_name && (
            <p className="text-xs text-red-600 text-end mt-1">
              {formik.errors.first_name}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <div className="relative">
            <User
              className={cn(
                formik.touched.confirm_password &&
                  formik.errors.confirm_password
                  ? "text-red-500"
                  : "text-gray-500",
                "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
              )}
            />
            <Input
              type="text"
              placeholder="masukan nama belakang"
              className={cn(
                formik.touched.confirm_password &&
                  formik.errors.confirm_password
                  ? "border-red-500"
                  : "",
                "w-full pl-10 pr-4 py-2"
              )}
              name="last_name"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.last_name && formik.errors.last_name && (
            <p className="text-xs text-red-600 text-end mt-1">
              {formik.errors.last_name}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <div className="relative">
            <Lock
              className={cn(
                formik.touched.confirm_password &&
                  formik.errors.confirm_password
                  ? "text-red-500"
                  : "text-gray-500",
                "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
              )}
            />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="masukan password anda"
              className={cn(
                formik.touched.confirm_password &&
                  formik.errors.confirm_password
                  ? "border-red-500"
                  : "",
                "w-full pl-10 pr-10 py-2"
              )}
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="text-xs text-red-600 text-end mt-1">
              {formik.errors.password}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <div className="relative">
            <Lock
              className={cn(
                formik.touched.confirm_password &&
                  formik.errors.confirm_password
                  ? "text-red-500"
                  : "text-gray-500",
                "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
              )}
            />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="konfirmasi password"
              className={cn(
                formik.touched.confirm_password &&
                  formik.errors.confirm_password
                  ? "border-red-500"
                  : "",
                "w-full pl-10 pr-10 py-2"
              )}
              name="confirm_password"
              value={formik.values.confirm_password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {formik.touched.confirm_password &&
            formik.errors.confirm_password && (
              <p className="text-xs text-red-600 text-end mt-1">
                {formik.errors.confirm_password}
              </p>
            )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={status === "loading"}
        className={cn(
          status === "loading"
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700 text-white py-2 rounded-md",
          "w-full"
        )}
      >
        {status === "loading" && <Loader className="h-4 w-4 animate-spin" />}{" "}
        Masuk
      </Button>

      <p className="text-center text-sm text-gray-600">
        sudah punya akun?{" "}
        <Link to="/login" className="text-red-600 hover:text-red-500">
          login di sini
        </Link>
      </p>
    </form>
  );
}
