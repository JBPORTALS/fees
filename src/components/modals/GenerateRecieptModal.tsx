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
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import IModal from "../ui/utils/IModal";

interface props {
  children: ({ onOpen }: { onOpen: () => void }) => JSX.Element;
}

const formData = [
  {
    name: "regno",
    type: "text",
    label: "USN No.",
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
  },
];

const formDataOnline = [
  {
    name: "regno",
    type: "text",
    label: "USN No.",
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
  },
];

const formMSCI = [
  {
    name: "regno",
    label: "USN No.",
    type: "text",
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

interface StateProps {
  [key: string]: string;
}

export default function GenerateRecieptModal({ children }: props) {
  const { isOpen, onClose, onOpen } = useDisclosure();
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
  });
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      total: (
        (parseInt(state["hostel_fee"]) || 0) +
        (parseInt(state["excess_fee"]) || 0) +
        (parseInt(state["vtu_fee"]) || 0) +
        (parseInt(state["lab_fee"]) || 0) +
        (parseInt(state["bus_fee"]) || 0) +
        (parseInt(state["security_deposit"]) || 0) +
        (parseInt(state["tuition_fee"]) || 0) +
        (parseInt(state["college_fee"]) || 0)
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
          ? "feegenratereciept.php"
          : paymentMode == "ONLINE"
          ? "feegenerateonline.php"
          : "feegeneratemiscellaneous.php";
      await axios.get(
        process.env.NEXT_PUBLIC_ADMIN_URL +
          `${filename}?${Object.keys(state)
            .map((key) => `${key}=${state[key]}`)
            .join("&")}`
      );
      const link = document.createElement("a");
      link.href =
        process.env.NEXT_PUBLIC_ADMIN_URL +
        `${filename}?${Object.keys(state)
          .map((key) => `${key}=${state[key]}`)
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
        heading="Generate Reciept"
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
                      [key]: "",
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
              ).map(
                (
                  field: {
                    name: string;
                    type: string;
                    label: string;
                    isReadonly?: boolean;
                    option?: { value: string; option: string }[];
                  },
                  index
                ) => {
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
                          value={state[field.name]}
                          onChange={(e) =>
                            setState((prev) => ({
                              ...prev,
                              [field.name]: e.target.value,
                            }))
                          }
                        >
                          <option selected disabled value={""}>
                            Select {field.label}
                          </option>
                          {field.option &&
                            field.option.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.option}
                              </option>
                            ))}
                        </Select>
                      ) : (
                        <Input
                          isReadOnly={field?.isReadonly}
                          type={field.type}
                          boxShadow={"md"}
                          bg={"white"}
                          //@ts-ignore
                          min={field?.min}
                          w={"64"}
                          value={
                            state[field.name] == "" && field.type == "number"
                              ? 0
                              : state[field.name]
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
                }
              )}
            </SimpleGrid>
          )}
        </VStack>
      </IModal>
      {children({ onOpen })}
    </VStack>
  );
}
