import { Eye, EyeOff, Loader } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import defaultProfilePict from "../assets/Profile Photo.png";
import { RootState } from "@/lib/srote";
import { useSelector } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface UserProps {
  children?: React.ReactNode;
}
const Main = ({ children }: UserProps) => {
  const [hideBalance, setHideBalance] = useState(true);

  const { balance, loading, error } = useSelector(
    (state: RootState) => state.balance
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const nullPicture = "https://minio.nutech-integrasi.com/take-home-test/null";
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col ">
            <img
              src={
                user?.profile_image !== nullPicture
                  ? user?.profile_image
                  : defaultProfilePict
              }
              alt="Profile picture"
              className="rounded-full object-cover w-24 h-24"
            />
            <div>
              <div className="text-gray-600">Selamat datang,</div>
              <h1 className="text-2xl font-bold">
                {user?.first_name + " " + user?.last_name}
              </h1>
            </div>
          </div>

          <Card className="w-full col-span-2 md:w-auto p-6 bg-gradient-to-r from-red-500 to-red-600 text-white">
            <div className="space-y-2">
              <div className="text-sm opacity-90">Saldo anda</div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {hideBalance ? (
                    "Rp •••••"
                  ) : loading ? (
                    <Button
                      className="text-white"
                      variant={"link"}
                      type="submit"
                      disabled={status === "loading"}
                    >
                      {loading && <Loader className="h-4 w-4 animate-spin" />}{" "}
                    </Button>
                  ) : error ? (
                    "Error"
                  ) : (
                    Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(balance as number)
                  )}
                </div>
              </div>
              <Button
                variant="link"
                size="sm"
                className="text-white hover:text-white/90 p-0"
                onClick={() => setHideBalance(!hideBalance)}
              >
                <span className="hidden sm:inline">Lihat Saldo</span>
                {hideBalance ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </Button>
            </div>
          </Card>
        </div>
        <Dialog open={loading}>
          <DialogContent className="[&>button]:hidden">
            <DialogHeader>
              <DialogTitle>Mohon Tunggu Sebentar</DialogTitle>
              <div className="flex flex-row gap-2 justify-center py-3">
                <div className="w-4 h-4 rounded-full bg-red-700 animate-bounce"></div>
                <div className="w-4 h-4 rounded-full bg-red-700 animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-4 h-4 rounded-full bg-red-700 animate-bounce [animation-delay:-.5s]"></div>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        {children}
      </div>
    </main>
  );
};

export default Main;
