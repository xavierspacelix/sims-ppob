import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AtSign, Eye, EyeOff, Loader, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchUserDetails,
  loginSuccess,
  loginUser,
  resetMessages,
} from "@/features/auth/authSlice";
import { loginValidationSchema } from "@/features/auth/validationSchemas";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/lib/srote";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { fetchBalance } from "@/features/balanceSlice";
import { fetchBanners } from "@/features/bannerSlice";
import { fetchServices } from "@/features/serviceSlice";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error, successMessage } = useSelector(
    (state: RootState) => state.auth
  );

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      const { ...credential } = values;
      const resultAction = await dispatch(loginUser(credential));

      if (loginUser.fulfilled.match(resultAction)) {
        const token = resultAction.payload;

        sessionStorage.setItem("token", token);
        await dispatch(fetchUserDetails(token)).then(async (response) => {
          dispatch(loginSuccess({ user: response.payload, token }));
          await dispatch(fetchBalance());
          await dispatch(fetchServices());
          await dispatch(fetchBanners());
        });

        navigate("/");
      } else {
        toast.error(`Login failed: ${resultAction.error.message}`);
        window.location.href = "/login";
      }
    },
    onReset: () => {
      formik.resetForm();
    },
  });

  useEffect(() => {
    dispatch(resetMessages());
  }, [error, successMessage, dispatch]);

  return (
    <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <div className="relative">
            <AtSign
              className={cn(
                formik.touched.email && formik.errors.email
                  ? "text-red-500"
                  : "text-gray-500",
                "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
              )}
            />
            <Input
              type="email"
              placeholder="masukan email anda"
              className={cn(
                formik.touched.email && formik.errors.email
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
            <p className="text-xs text-red-600 text-end">
              {formik.errors.email}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <div className="relative">
            <Lock
              className={cn(
                formik.touched.password && formik.errors.password
                  ? "text-red-500"
                  : "text-gray-500",
                "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
              )}
            />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="masukan password anda"
              className={cn(
                formik.touched.password && formik.errors.password
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
            <p className="text-xs text-red-600 text-end">
              {formik.errors.password}
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
        belum punya akun?{" "}
        <Link to="/register" className="text-red-600 hover:text-red-500">
          registrasi di sini
        </Link>
      </p>
    </form>
  );
}
