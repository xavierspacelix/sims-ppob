import {
  clearHistoryRecords,
  getTransactionHistory,
  increaseOffset,
} from "@/features/transactionSlice";
import { RootState, useAppDispatch } from "@/lib/srote";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { formatToWIB } from "@/lib/utils";

const History = () => {
  const dispatch = useAppDispatch();
  const { records, loading, offset, limit } = useSelector(
    (state: RootState) => state.transaction
  );

  useEffect(() => {
    dispatch(clearHistoryRecords());
    dispatch(getTransactionHistory({ offset: 0, limit }));
  }, [dispatch]);

  const handleShowMore = () => {
    dispatch(increaseOffset());

    dispatch(getTransactionHistory({ offset: offset + limit, limit }));
  };

  return (
    <div>
      <h1>Semua Transaksi</h1>
      {records.map((item, index) => {
        return (
          <>
            <div
              className=" flex items-center space-x-4 rounded-md border p-4 mt-2"
              key={index}
            >
              {item?.transaction_type === "PAYMENT" ? (
                <Minus className="h-6 w-6 text-red-600" />
              ) : (
                <Plus className="h-6 w-6 text-green-600" />
              )}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm font-medium leading-none ${
                      item?.transaction_type === "PAYMENT"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {item?.total_amount}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item?.description}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatToWIB(item?.created_on)}
                </p>
              </div>
            </div>
          </>
        );
      })}
      {!loading && (
        <div className="flex items-center justify-center">
          <Button
            variant="link"
            className="text-red-600"
            onClick={handleShowMore}
          >
            Show More
          </Button>
        </div>
      )}
    </div>
  );
};

export default History;
