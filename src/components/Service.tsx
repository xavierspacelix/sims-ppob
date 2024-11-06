import { Link } from "react-router-dom";

const Service = ({ services }: any) => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="w-full overflow-auto ">
        <div className="flex gap-4 p-4 min-w-max">
          {services.map((item: any, index: any) => (
            <div key={index} className="flex flex-col items-center gap-2 w-20">
              <Link to={`/services/${item.service_code.toLowerCase()}`}>
                <img
                  src={item.service_icon}
                  alt={item.service_name}
                  width={40}
                  height={40}
                />
                {/* </div> */}
              </Link>
              <p className="text-xs font-medium text-gray-600 text-center break-words">
                {item.service_name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;
