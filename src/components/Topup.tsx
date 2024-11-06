import { Check, CreditCard, X } from "lucide-react";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { fetchBalance, topUpBalance } from "@/features/balanceSlice";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/lib/srote";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { getTransactionHistory } from "@/features/transactionSlice";

const Topup = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const nominals = [10000, 20000, 50000, 100000, 250000, 500000];
  const [selectedNominal, setSelectedNominal] = React.useState(0);
  const [dialog, setDialog] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const handleTopUp = async () => {
    if (selectedNominal <= 0) {
      toast.error("Amount harus lebih besar dari 0");
      return;
    }

    const resultTopup = await dispatch(topUpBalance(selectedNominal));
    if (resultTopup.payload.status === 0) {
      dispatch(fetchBalance());
      dispatch(getTransactionHistory({ offset: 0, limit: 10 }));
      setDialog(true);
      setStatusMessage("Berhasil");
    } else if (topUpBalance.rejected.match(resultTopup)) {
      setDialog(false);
      setStatusMessage("Gagal");
    }
  };
  const handleCloseDialog = () => {
    setDialog(false);
    dispatch(fetchBalance());
    navigate("/");
  };
  return (
    <>
      <div className="mx-auto">
        <span className="text-sm">Silahkan masukkan</span>
        <h1 className="font-semibold text-xl">Nominal Top up</h1>
        <div className="grid  grid-cols-1 md:grid-cols-2 mt-2 gap-3">
          <div>
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
                }).format(selectedNominal)}
              />
            </div>
            <Button
              disabled={selectedNominal === 0}
              variant="destructive"
              className="w-full mt-2"
              onClick={handleTopUp}
            >
              Topup
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {nominals.map((item, index) => (
              <Button
                onClick={() => setSelectedNominal(item)}
                key={index}
                variant="outline"
                className={`w-full h-full ${
                  selectedNominal === item ? "border-red-600 text-red-600" : ""
                }`}
              >
                {Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(item)}
              </Button>
            ))}
          </div>
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
              <span className="text-md">Top Up Sebesar</span>
              <span className="font-semibold">
                {Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(selectedNominal)}
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
    </>
  );
};

export default Topup;
