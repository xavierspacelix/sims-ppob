import { RootState, useAppDispatch } from "@/lib/srote";
import { Check, CreditCard, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { makeTransaction } from "@/features/transactionSlice";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { fetchBalance } from "@/features/balanceSlice";
import logo from "../assets/Logo.png";
const Payment = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { service_code } = useParams();
  const { services } = useSelector((state: RootState) => state.services);
  const service = services.find(
    (item) => item.service_code === service_code?.toUpperCase()
  );
  const [dialog, setDialog] = useState(false);
  const [dialogConfirmation, setDialogConfirmation] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleBayar = async () => {
    const result = await dispatch(
      makeTransaction(service_code?.toUpperCase() as string)
    );

    if (result.payload.status === 0) {
      dispatch(fetchBalance());
      setStatusMessage("Berhasil");
      setDialog(true);
    } else {
      setStatusMessage("Gagal");
      setDialog(true);
    }
  };
  const handleCloseDialog = () => {
    setDialog(false);
    dispatch(fetchBalance());
    navigate("/");
  };
  return (
    <>
      <div>
        <h1>Pembayaran</h1>
        <div className="flex items-center gap-2">
          <img
            src={service?.service_icon}
            alt={service?.service_name}
            width={40}
            height={40}
          />
          <p className="font-semibold">{service?.service_name}</p>
        </div>
        <div className="w-[50%] mt-3">
          <div className="relative">
            <CreditCard
              className={"absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"}
            />
            <Input
              type="text"
              placeholder="masukan nominal top up"
              className={"w-full pl-10 pr-4 py-2"}
              name="top_up_amount"
              value={Intl.NumberFormat("id-ID", {
                minimumFractionDigits: 0,
              }).format(service?.service_tariff || 0)}
            />
          </div>
          <Button
            variant="destructive"
            className="w-full mt-2"
            onClick={() => setDialogConfirmation(true)}
          >
            Bayar
          </Button>
        </div>
      </div>
      <AlertDialog open={dialog} onOpenChange={setDialog}>
        <AlertDialogContent className="max-w-xs">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 justify-center">
              {statusMessage === "Berhasil" ? (
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <X className="w-6 h-6 text-white" />
                </div>
              )}
            </AlertDialogTitle>
            <div className="text-center flex flex-col items-center justify-center">
              <span className="text-md">
                Pembayaran {service?.service_name} Sebesar
              </span>
              <span className="font-semibold">
                {Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(service?.service_tariff || 0)}
              </span>
              {statusMessage}
              <Button
                className="text-red-600 mt-10"
                variant="link"
                onClick={handleCloseDialog}
              >
                Kembali ke Beranda
              </Button>
            </div>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={dialogConfirmation}
        onOpenChange={setDialogConfirmation}
      >
        <AlertDialogContent className="max-w-xs">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 justify-center">
              <div className="flex items-center gap-2 text-xl font-bold text-red-600">
                <img src={logo} alt="Logo" className="w-12 h-12" />
              </div>
            </AlertDialogTitle>
            <div className="text-center flex flex-col items-center justify-center">
              <span className="text-md">
                Beli {service?.service_name} senilai
              </span>
              <span className="font-semibold">
                {Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(service?.service_tariff || 0)}{" "}
                ?
              </span>
              <div className="mt-2 flex flex-col">
                <Button
                  className="text-red-600"
                  variant="link"
                  onClick={handleBayar}
                >
                  Ya, lanjutkan Bayar
                </Button>
                <Button
                  className="text-muted-foreground"
                  variant="link"
                  onClick={() => {
                    setDialogConfirmation(false);
                  }}
                >
                  Batalkan
                </Button>
              </div>
            </div>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Payment;
