import Banner from "@/components/Banner";
import Service from "@/components/Service";
import { logout } from "@/features/auth/authSlice";
import store, { RootState } from "@/lib/srote";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();

  const { services, error } = useSelector((state: RootState) => state.services);
  const { banners } = useSelector((state: RootState) => state.banner);
  if (error) {
    dispatch(logout());
  }
  console.log(store.getState());
  return (
    <>
      <Service services={services} />
      <Banner banners={banners} />
    </>
  );
}
