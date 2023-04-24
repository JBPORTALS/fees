import EditStaffDrawer from "@/components/drawers/EditStaffDrawer";
import EditStudentDrawer from "@/components/drawers/EditStudentDrawer";
import { useAppDispatch } from "@/hooks";
import { setSelectedStaff } from "@/store/staffs.slice";
import { setSelectedStudent } from "@/store/student.slice";
import { forwardRef } from "@chakra-ui/react";
import { useState, memo, useImperativeHandle } from "react";
import { BsArrowsAngleExpand } from "react-icons/bs";

export const CustomRender = memo(forwardRef(({ value }: { value: "A" | "P" }, ref) => {

  const [state, setState] = useState(value);

    useImperativeHandle(ref, () => {
      return {
        getValue() {
          return state;
        },
      };
    });
    
  if (value == null) {
    return (
      <div className={"flex justify-center items-center w-full h-full  "}>
        <div
          className={
            "p-2 h-8 w-8 flex justify-center font-semibold items-center rounded-full border text-md bg-gray-200 border-gray-400 "
          }
        >
          N/T
        </div>
      </div>
    );
  } else {
    return (
      <div className={"flex justify-center items-center w-full h-full  "}>
        <div
          className={
            "p-2 h-8 w-8 flex justify-center font-semibold items-center rounded-full border text-md " +
            (value == "P"
              ? "bg-green-300 border-green-600 "
              : "bg-red-300 border-red-600")
          }
        >
          {value}
        </div>
      </div>
    );
  }
  
})
);

export const CustomRenderForAddAttendance = memo(
  forwardRef(({ value }: { value: "A" | "P" }, ref) => {
    const [state, setState] = useState(value);

    useImperativeHandle(ref, () => {
      return {
        getValue() {
          return state;
        },
      };
    });

    return (
      <div className={"flex justify-center items-center w-full h-full  "}>
        <div
          onClick={() => setState(state == "P" ? "A" : "P")}
          className={
            "p-2 h-8 w-8 flex justify-center font-semibold items-center rounded-full border text-md " +
            (state == "P"
              ? "bg-green-300 border-green-600 "
              : "bg-red-300 border-red-600")
          }
        >
          {state}
        </div>
      </div>
    );
  })
);

export const CustomRenderForViewStaff = ({ value }:{value:any}) => {
    const dispatch = useAppDispatch();

    return (
      <div className={"flex justify-center items-center w-full h-full"}>
        <EditStaffDrawer>
          {
          ({onOpen})=>(
            <BsArrowsAngleExpand onClick={()=>{
              dispatch(setSelectedStaff(value));
              onOpen();
            }} className="text-brand text-lg hover:scale-125 active:scale-95 hover:cursor-pointer"/>
            )
          }
        </EditStaffDrawer>
      </div>
    );
  }

  export const CustomRenderForViewStudent = ({ value }:{value:any}) => {
    const dispatch = useAppDispatch();

    return (
      <div className={"flex justify-center items-center w-full h-full"}>
        <EditStudentDrawer>
          {
          ({onOpen})=>(
            <BsArrowsAngleExpand onClick={()=>{
              dispatch(setSelectedStudent(value));
              onOpen();
            }} className="text-brand text-lg hover:scale-125 active:scale-95 hover:cursor-pointer"/>
            )
          }
        </EditStudentDrawer>
      </div>
    );
  }
