import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  Input,
  Select,
  SimpleGrid,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import IModal from "../ui/utils/IModal";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import moment from "moment";

interface props {
  children: ({ onOpen }: { onOpen: () => void }) => JSX.Element;
}

interface StateProps {
  [key: string]: string | number | Date | null;
}

interface FormItemProps {
  name: string;
  type: string;
  label: string;
  value?: string | Date | null | number;
  onChange?: (e: any) => void;
  isReadonly?: boolean;
  option?: { value: string | number; option: string | number }[];
}

export default function GenerateRecieptWithoutUSNModal({ children }: props) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const intialAssign = {
    hostel_fee: "0",
    excess_fee: "0",
    college_fee: "0",
    tuition_fee: "0",
    total_fee: "0",
    security_deposit: "0",
    bus_fee: "0",
    lab_fee: "0",
    vtu_fee: "0",
    total_msci: "0",
  };

  const [state, setState] = useState<StateProps>({
    hostel_fee: "0",
    excess_fee: "0",
    college_fee: "0",
    tuition_fee: "0",
    total_fee: "0",
    security_deposit: "0",
    bus_fee: "0",
    lab_fee: "0",
    vtu_fee: "0",
    total_msci: "0",
    chequedate: new Date(),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  const branchList = useAppSelector(
    (state) => state.fees.branch_list.data
  ) as [];

  const formData: FormItemProps[] = [
    {
      name: "name",
      label: "Name",
      type: "text",
    },
    {
      name: "branch",
      label: "Branch",
      type: "select",
      option: branchList.map((value: any) => ({
        value: value.branch,
        option: value.branch,
      })),
    },
    {
      name: "sem",
      label: "Sem",
      type: "select",
      option: new Array(8)
        .fill(0)
        .map((_, index) => ({ value: index + 1, option: index + 1 })),
    },
    {
      name: "category",
      type: "select",
      label: "Category",
      option: [
        {
          value: "SNQ",
          option: "SNQ",
        },
        {
          value: "MGT",
          option: "MGT",
        },
        {
          value: "COMEDK",
          option: "COMEDK",
        },
        {
          value: "GM",
          option: "GM",
        },
        {
          value: "SC",
          option: "SC",
        },
        {
          value: "ST",
          option: "ST",
        },
        {
          value: "CAT-I",
          option: "CAT-I",
        },
        {
          value: "DIP-LE",
          option: "DIP-LE",
        },
      ],
    },
    {
      name: "fee_year",
      type: "select",
      label: "Academic Year",
      option: [
        {
          value: "2023-24",
          option: "2023-24",
        },
        {
          value: "2022-23",
          option: "2022-23",
        },
      ],
    },
    {
      name: "tuition_fee",
      type: "number",
      label: "Tuition Fee",
    },
    {
      name: "vtu_fee",
      type: "number",
      label: "VTU/DTE/DDPI/GP.INS/ IRC Fee",
    },
    {
      name: "college_fee",
      type: "number",
      label: "College Fee",
    },
    {
      name: "lab_fee",
      type: "number",
      label: "Lab Fee",
    },
    {
      name: "bank",
      type: "select",
      label: "Bank",
      option: [
        {
          value: "UNION",
          option: "UNION",
        },
        {
          value: "AXIS",
          option: "AXIS",
        },
      ],
    },
    {
      name: "bus_fee",
      type: "number",
      label: "Bus Fee",
    },
    {
      name: "excess_fee",
      type: "number",
      label: "Excess Fee",
    },
    {
      name: "security_deposit",
      type: "number",
      label: "Security Deposit",
    },
    {
      name: "hostel_fee",
      type: "number",
      label: "Hostel Fee",
    },
    {
      name: "total",
      type: "number",
      label: "Total Fee",
      isReadonly: true,
    },
    {
      name: "cheque_no",
      type: "text",
      label: "CHEQUE/DDR/UTR No",
    },
    {
      name: "chequedate",
      type: "date",
      label: "Payment Date",
      value: new Date(),
    },
  ];

  const formDataOnline: FormItemProps[] = [
    {
      name: "name",
      label: "Name",
      type: "text",
    },
    {
      name: "branch",
      label: "Branch",
      type: "select",
      option: branchList.map((value: any) => ({
        value: value.branch,
        option: value.branch,
      })),
    },
    {
      name: "sem",
      label: "Sem",
      type: "select",
      option: new Array(8)
        .fill(0)
        .map((_, index) => ({ value: index + 1, option: index + 1 })),
    },
    {
      name: "category",
      type: "select",
      label: "Category",
      option: [
        {
          value: "SNQ",
          option: "SNQ",
        },
        {
          value: "MGT",
          option: "MGT",
        },
        {
          value: "COMEDK",
          option: "COMEDK",
        },
        {
          value: "GM",
          option: "GM",
        },
        {
          value: "SC",
          option: "SC",
        },
        {
          value: "ST",
          option: "ST",
        },
        {
          value: "CAT-I",
          option: "CAT-I",
        },
        {
          value: "DIP-LE",
          option: "DIP-LE",
        },
      ],
    },
    {
      name: "fee_year",
      type: "select",
      label: "Academic Year",
      option: [
        {
          value: "2023-24",
          option: "2023-24",
        },
        {
          value: "2022-23",
          option: "2022-23",
        },
      ],
    },
    {
      name: "tuition_fee",
      type: "number",
      label: "Tuition Fee",
    },
    {
      name: "vtu_fee",
      type: "number",
      label: "VTU/DTE/DDPI/GP.INS/ IRC Fee",
    },
    {
      name: "college_fee",
      type: "number",
      label: "College Fee",
    },
    {
      name: "lab_fee",
      type: "number",
      label: "Lab Fee",
    },
    {
      name: "bank",
      type: "select",
      label: "Bank",
      option: [
        {
          value: "UNION",
          option: "UNION",
        },
        {
          value: "AXIS",
          option: "AXIS",
        },
      ],
    },
    {
      name: "bus_fee",
      type: "number",
      label: "Bus Fee",
    },
    {
      name: "excess_fee",
      type: "number",
      label: "Excess Fee",
    },
    {
      name: "security_deposit",
      type: "number",
      label: "Security Deposit",
    },
    {
      name: "hostel_fee",
      type: "number",
      label: "Hostel Fee",
    },
    {
      name: "total",
      type: "number",
      label: "Total Fee",
      isReadonly: true,
    },
    {
      name: "cheque_no",
      type: "text",
      label: "Transcation ID",
    },
    {
      name: "chequedate",
      type: "date",
      label: "Payment Date",
      value: new Date(),
    },
  ];

  const formMSCI = [
    {
      name: "name",
      label: "Name",
      type: "text",
    },
    {
      name: "branch",
      label: "Branch",
      type: "select",
      option: branchList.map((value: any) => ({
        value: value.branch,
        option: value.branch,
      })),
    },
    {
      name: "sem",
      label: "sem",
      type: "select",
      option: new Array(8)
        .fill(0)
        .map((_, index) => ({ value: index + 1, option: index + 1 })),
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      option: [
        {
          value: "Library Fine",
          option: "Library Fine",
        },
        {
          value: "Certificates",
          option: "Certificates",
        },
        {
          value: "Attestation",
          option: "Attestation",
        },
        {
          value: "Lab Breakage",
          option: "Lab Breakage",
        },
        {
          value: "Application",
          option: "Application",
        },
        {
          value: "Miscellaneous",
          option: "Miscellaneous",
        },
        {
          value: "ID Card",
          option: "ID Card",
        },
        {
          value: "Uniform",
          option: "Uniform",
        },
        {
          value: "Books",
          option: "Books",
        },
        {
          value: "Duplicate Halltickets",
          option: "Duplicate Halltickets",
        },
      ],
    },
    {
      name: "total_msci",
      label: "Total",
      type: "number",
      min: "0",
    },
  ];

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      total: (
        (parseInt(state["hostel_fee"] as string) || 0) +
        (parseInt(state["excess_fee"] as string) || 0) +
        (parseInt(state["vtu_fee"] as string) || 0) +
        (parseInt(state["lab_fee"] as string) || 0) +
        (parseInt(state["bus_fee"] as string) || 0) +
        (parseInt(state["security_deposit"] as string) || 0) +
        (parseInt(state["tuition_fee"] as string) || 0) +
        (parseInt(state["college_fee"] as string) || 0)
      ).toString(),
    }));
  }, [
    state["hostel_fee"],
    state["excess_fee"],
    state["vtu_fee"],
    state["lab_fee"],
    state["bus_fee"],
    state["security_deposit"],
    state["tuition_fee"],
    state["college_fee"],
  ]);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const filename =
        paymentMode == "CASH"
          ? "feegenraterecieptwithoutusn.php"
          : paymentMode == "ONLINE"
          ? "feegenerateonlinewithoutusn.php"
          : "feegeneratemiscellaneouswithoutusn.php";
      await axios.get(
        process.env.NEXT_PUBLIC_ADMIN_URL +
          `${filename}?${Object.keys(state)
            .map((key) => `${key}=${
              key == "chequedate"
                ? moment(state[key]).format("yyyy-MM-DD")
                : state[key]
            }`)
            .join("&")}`
      );
      const link = document.createElement("a");
      link.href =
        process.env.NEXT_PUBLIC_ADMIN_URL +
        `${filename}?${Object.keys(state)
          .map(
            (key) =>
              `${key}=${
                key == "chequedate"
                  ? moment(state[key]).format("yyyy-MM-DD")
                  : state[key]
              }`
          )
          .join("&")}`;
      link.setAttribute("download", "Fee Reciept Offline.pdf");
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
    } catch (e: any) {
      toast.error(e.response?.data?.msg);
    }
    setIsLoading(false);
  };

  return (
    <VStack>
      <IModal
        isDisabled={paymentMode == ""}
        size={"full"}
        buttonTitle="Generate Reciept"
        heading="Generate Reciept Without USN"
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isLoading}
        onSubmit={() => onSubmit()}
      >
        <VStack w={"full"} h={"full"}>
          <HStack>
            <Select
              onChange={(e) => {
                setPaymentMode(e.target.value);
              }}
              bg={"white"}
            >
              <option value={""} selected disabled>
                Select Payment Mode
              </option>
              <option value={"ONLINE"}>ONLINE</option>
              <option value={"CASH"}>CASH</option>
              <option value={"MISCELLANEOUS"}>Miscellaneous</option>
            </Select>
            {paymentMode && (
              <Button
                colorScheme={"blue"}
                onClick={() => {
                  Object.keys(state).forEach((key) => {
                    setState((prev) => ({
                      ...prev,
                      [key]: null,
                    }));
                  });
                }}
                variant={"ghost"}
              >
                Reset
              </Button>
            )}
          </HStack>

          {paymentMode && (
            <SimpleGrid
              columns={3}
              spacingX={"5"}
              spacingY={"4"}
              w={"900px"}
              h={"full"}
            >
              {(paymentMode == "CASH"
                ? formData
                : paymentMode == "MISCELLANEOUS"
                ? formMSCI
                : formDataOnline
              ).map((field: FormItemProps, index) => {
                return (
                  <FormControl
                    key={index}
                    display={"flex"}
                    flexDir={"column"}
                    w={"full"}
                  >
                    <FormLabel>{field.label}</FormLabel>
                    {field.type == "select" ? (
                      <Select
                        boxShadow={"md"}
                        bg={"white"}
                        w={"64"}
                        value={state[field.name] as string}
                        onChange={(e) =>
                          setState((prev) => ({
                            ...prev,
                            [field.name]: e.target.value,
                          }))
                        }
                      >
                        <option value={""} disabled selected>
                          Select {field.label}
                        </option>
                        {field.option &&
                          field.option.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.option}
                            </option>
                          ))}
                      </Select>
                    ) : field.type == "date" ? (
                      <ReactDatePicker
                        className="px-3 flex shadow-md justify-self-end w-[100%] ml-auto py-2 border rounded-md outline-brand"
                        todayButton="Today"
                        selected={
                          new Date(state[field.name] as string)
                        }
                        dateFormat={"dd/MM/yyyy"}
                        adjustDateOnChange={true}
                        onChange={(date) => {
                          setState((prev) => ({
                            ...prev,
                            [field.name]: date,
                          }));
                        }}
                      />
                    ) : (
                      <Input
                        isReadOnly={field.isReadonly}
                        type={field.type}
                        boxShadow={"md"}
                        bg={"white"}
                        //@ts-ignore
                        min={field?.min}
                        w={"64"}
                        value={
                          state[field.name] == "" && field.type == "number"
                            ? 0
                            : (state[field.name] as string)
                        }
                        onChange={(e) => {
                          if (field.type == "number") {
                            const value = Math.max(
                              0,
                              Math.min(1500000, Number(e.target.value))
                            );
                            setState((prev) => ({
                              ...prev,
                              [field.name]: value.toString(),
                            }));
                          } else if (
                            field.type == "text" &&
                            field.name == "cheque_no"
                          ) {
                            const result = e.target.value.replace(
                              /[^a-z0-9A-Z]/gi,
                              ""
                            );
                            setState((prev) => ({
                              ...prev,
                              [field.name]: result,
                            }));
                          } else {
                            setState((prev) => ({
                              ...prev,
                              [field.name]: e.target.value,
                            }));
                          }
                        }}
                      />
                    )}
                  </FormControl>
                );
              })}
            </SimpleGrid>
          )}
        </VStack>
      </IModal>
      {children({ onOpen })}
    </VStack>
  );
}
