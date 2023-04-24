import { AiOutlineSelect } from "react-icons/ai";

export const InfoCard = ({ message }: { message: string }) => {
    return (
      <div className="flex  w-full h-full items-center justify-center pb-24">
        <div className="flex flex-col space-y-2 bg-secondary p-10 rounded-md border border-lightgray justify-center items-center">
          <AiOutlineSelect className="text-4xl text-brand" />
          <h1 className="text-xl font-medium text-dark ">{message}</h1>
          <span className="text-gray-500">
            Select an option on the top section
          </span>
        </div>
      </div>
    );
  };