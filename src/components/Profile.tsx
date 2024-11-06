import React, { useRef, useState } from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/srote";
import defaultProfilePict from "../assets/Profile Photo.png";
import { Pencil } from "lucide-react";
import {
  logout,
  updateProfile,
  uploadProfileImage,
} from "@/features/auth/authSlice";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import { updateProfileSchema } from "@/features/auth/validationSchemas";
const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [editProfile, setEditProfile] = useState(false);
  const [imageSrc, setImageSrc] = useState(defaultProfilePict);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messageImage, setMessageImage] = useState("");
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  const nullPicture = "https://minio.nutech-integrasi.com/take-home-test/null";
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > 100000) {
        setMessageImage("Ukuran tidak boleh lebih dari 100kb");
        return;
      }
      setMessageImage("");
      const formData = new FormData();
      formData.append("file", file);

      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);

      dispatch(uploadProfileImage(formData) as any).unwrap();
    }
  };

  const handleLogout = async () => {
    const logoutPromise = new Promise<void>((resolve) => {
      dispatch(logout());
      resolve();
    });

    toast.promise(logoutPromise, {
      loading: "Sedang Keluar...",
      success: "Berhasil Keluar!",
      error: "Gagal keluar",
    });
  };
  const formik = useFormik({
    initialValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
    },
    validationSchema: updateProfileSchema,
    onSubmit: async (values) => {
      const { first_name, last_name } = values;
      dispatch(updateProfile({ first_name, last_name }) as any);
      setEditProfile(false);
    },
  });

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-6">
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-24 h-24 mx-auto">
            <div
              className={
                editProfile
                  ? "cursor-pointer relative w-full h-full group"
                  : "relative w-full h-full group"
              }
              onClick={!editProfile ? undefined : handleImageClick}
              role="button"
              tabIndex={0}
              aria-label="Change profile picture"
            >
              <img
                src={
                  user?.profile_image !== nullPicture
                    ? user?.profile_image
                    : defaultProfilePict
                }
                alt="Profile picture"
                width={96}
                height={96}
                className="rounded-full object-cover w-full h-full"
              />
              <div className="absolute right-0 bottom-0 bg-white rounded-full p-1 shadow-sm border">
                <Pencil className="w-4 h-4 text-gray-600" />
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              aria-hidden="true"
            />
          </div>
          {messageImage && (
            <p className="text-red-500 text-sm mt-1">{messageImage}</p>
          )}
          <div>
            <h1 className="text-2xl font-bold">
              {user?.first_name + " " + user?.last_name}
            </h1>
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="walet@tokotech.com"
              readOnly
              type="email"
              disabled
              value={user?.email}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="first_name">Nama Depan</Label>
            <Input
              id="first_name"
              placeholder="Kristanto"
              readOnly={!editProfile}
              disabled={!editProfile}
              name="first_name"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.first_name && formik.errors.first_name && (
              <div className="text-sm text-red-600">
                {formik.errors.first_name}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Nama Belakang</Label>
            <Input
              id="last_name"
              placeholder="Wibowo"
              name="last_name"
              readOnly={!editProfile}
              disabled={!editProfile}
              value={formik.values.last_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.last_name && formik.errors.last_name && (
              <div className="text-sm text-red-600">
                {formik.errors.last_name}
              </div>
            )}
          </div>

          <Button
            variant="outline"
            className="w-full border-red-600 text-red-600"
            onClick={() => setEditProfile(!editProfile)}
            type="button"
          >
            {editProfile ? "Batal" : "Edit Profile"}
          </Button>

          {editProfile && (
            <Button variant="destructive" className="w-full" type="submit">
              Simpan Perubahan
            </Button>
          )}

          {!editProfile && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Profile;
