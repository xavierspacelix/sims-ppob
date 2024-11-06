const Banner = ({ banners }: any) => {
  return (
    <div className="mx-auto space-y-6">
      <h1 className="font-semibold text-lg">Temukan promo menarik</h1>
      <div className="w-full overflow-auto ">
        <div className="flex gap-6">
          {banners.map((item: any, index: any) => {
            return <img key={index} src={item.banner_image} alt="" />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Banner;
