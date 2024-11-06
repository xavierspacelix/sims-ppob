import * as Yup from "yup";

export const registerValidationSchema = Yup.object({
  email: Yup.string().email("Email tidak valid").required("Email wajib diisi"),
  first_name: Yup.string().required("Nama depan wajib diisi"),
  last_name: Yup.string().required("Nama belakang wajib diisi"),
  password: Yup.string()
    .min(8, "Password minimal 8 karakter")
    .required("Password wajib diisi")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password harus memiliki satu huruf besar, satu huruf kecil, satu angka, dan satu karakter spesial"
    ),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password")], "Konfirmasi password tidak sesuai")
    .required("Konfirmasi password wajib diisi"),
});

export const loginValidationSchema = Yup.object({
  email: Yup.string().email("Email tidak valid").required("Email wajib diisi"),
  password: Yup.string().required("Password wajib diisi"),
});

export const updateProfileSchema = Yup.object({
  first_name: Yup.string().required("Nama depan wajib diisi"),
  last_name: Yup.string().required("Nama belakang wajib diisi"),
});
