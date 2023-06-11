"use client";
import {
  Button,
  HStack,
  SimpleGrid,
  Stack,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import React, { useEffect } from "react";
import { useAppSelector } from "@/store";
import { Field } from "@/components/ui/Field";
import moment from "moment";
import { useParams } from "next/navigation";
import { AiOutlineFileDone } from "react-icons/ai";
import axios from "axios";

const initialValues = {
  usn: "", //✅
  category: "", //✅
  misc_category: "", //✅
  acadYear: "", //✅
  tuitionFee: 0, //✅
  collegeFee: 0, //✅
  labFee: 0, //✅
  vtuFee: 0, //✅
  bank: "", //✅
  paymentMode: "", //✅
  date: moment(new Date(Date.now())).format("yyyy-MM-DD"), //✅
  transactionId: "",
  chequeNo: "", //✅
  busFee: 0, //✅
  excessFee: 0, //✅
  securityDeposit: 0, //✅
  hostelFee: 0, //✅
  total: 0, //✅
};

const FormikContextProvider = () => {
  const { values, setFieldValue } = useFormikContext<typeof initialValues>();

  useEffect(() => {
    setFieldValue(
      "total",
      +(
        +values.collegeFee +
        +values.tuitionFee +
        +values.vtuFee +
        +values.labFee
      )
    );
  }, [values.collegeFee, values.tuitionFee, values.vtuFee, values.labFee]);

  return <React.Fragment></React.Fragment>;
};

export default function WithoutUSNDynamicPage() {
  const branchList = useAppSelector((state) => state.fees.branch_list.data) as {
    branch: string;
  }[];

  const toast = useToast({
    position: "bottom-left",
  });

  const params = useParams();
  const paymentType = params.paymentType;

  const feeTemplate = [
    {
      name: "usn",
      label: "USN",
      type: "text",
      validateField: Yup.string()
        .required("Field required !")
        .matches(
          /^[Aa-zZ0-9]+$/i,
          "Only alphanumaric values are allowed for this field"
        ),
    },
    {
      name: "acadYear",
      label: "Academic Year",
      type: "select",
      placeholder: "Select Academic Year",
      validateField: Yup.string().required("Fill the field !"),
      options: [
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
      name: "tuitionFee",
      label: "Tuition Fee",
      type: "text",
      validateField: Yup.number()
        .typeError("invalid number")
        .required("Field required !")
        .min(0, "minimum amount should be 0"),
    },
    {
      name: "vtuFee",
      label: "VTU/DTE/DDPI/GP.INS/ IRC Fee",
      type: "text",
      validateField: Yup.number()
        .typeError("invalid number")
        .required("Field required !")
        .min(0, "minimum amount should be 0"),
    },
    {
      name: "collegeFee",
      label: "College Fee",
      type: "text",
      validateField: Yup.number()
        .typeError("invalid number")
        .required("Field required !")
        .min(0, "minimum amount should be 0"),
    },
    {
      name: "labFee",
      label: "Lab Fee",
      type: "text",
      validateField: Yup.number()
        .typeError("invalid number")
        .required("Field required !")
        .min(0, "minimum amount should be 0"),
    },
    {
      name: "total",
      label: "Total Fee",
      type: "text",
      isReadonly: true,
      validateField: Yup.number()
        .typeError("invalid number")
        .required("Field required !")
        .moreThan(0, "Total amount should be more than 0"),
    },
    {
      name: "bank",
      label: "Bank",
      type: "select",
      placeholder: "Select Bank",
      options: [
        {
          option: "Union",
          value: "UNION",
        },
        {
          option: "Axis",
          value: "AXIS",
        },
      ],
      validateField: Yup.string().required("Fill the field !"),
    },
    {
      name: "paymentMode",
      label: "Payment Mode",
      type: "select",
      placeholder: "Select Payment Mode",
      options: [
        {
          option: "Online",
          value: "ONLINE",
        },
        {
          option: "Cash",
          value: "CASH",
        },
        {
          option: "Cheque",
          value: "CHEQUE",
        },
      ],
      validateField: Yup.string().required("Fill the field !"),
    },
  ];

  const miscellaneousTemplate = [
    {
      name: "usn",
      label: "USN",
      type: "text",
      validateField: Yup.string()
        .required("Fill the field!")
        .matches(
          /^[Aa-zZ0-9]+$/i,
          "Only alphanumaric values are allowed for this field"
        ),
    },
    {
      name: "misc_category",
      label: "Category",
      type: "select",
      placeholder: "Select Category",
      validateField: Yup.string().required("Fill the field !"),
      options: [
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
      name: "total",
      label: "Total Amount",
      type: "number",
      validateField: Yup.number()
        .typeError("Invalid amount")
        .moreThan(0, "Amount should be more than 0")
        .required(),
    },
    {
      name: "paymentMode",
      label: "Payment Mode",
      type: "select",
      placeholder: "Select Payment Mode",
      options: [
        {
          option: "Online",
          value: "ONLINE",
        },
        {
          option: "Cash",
          value: "CASH",
        },
        {
          option: "Cheque",
          value: "CHEQUE",
        },
      ],
      validateField: Yup.string().required("Fill the field !"),
    },
  ];

  const busFeeTemplate = [
    {
      name: "usn",
      label: "USN",
      type: "text",
      validateField: Yup.string()
        .required("Field required !")
        .matches(
          /^[Aa-zZ0-9]+$/i,
          "Only alphanumaric values are allowed for this field"
        ),
    },
    {
      name: "acadYear",
      label: "Academic Year",
      type: "select",
      placeholder: "Select Academic Year",
      validateField: Yup.string().required("Fill the field !"),
      options: [
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
      name: "bank",
      label: "Bank",
      type: "select",
      placeholder: "Select Bank",
      options: [
        {
          option: "Union",
          value: "UNION",
        },
        {
          option: "Axis",
          value: "AXIS",
        },
      ],
      validateField: Yup.string().required("Fill the field !"),
    },
    {
      name: "busFee",
      label: "Total Bus Fee Amount",
      type: "number",
      validateField: Yup.number()
        .typeError("Invalid amount")
        .moreThan(0, "Amount should be more than 0")
        .required(),
    },
    {
      name: "paymentMode",
      label: "Payment Mode",
      type: "select",
      placeholder: "Select Payment Mode",
      options: [
        {
          option: "Online",
          value: "ONLINE",
        },
        {
          option: "Cash",
          value: "CASH",
        },
        {
          option: "Cheque",
          value: "CHEQUE",
        },
      ],
      validateField: Yup.string().required("Fill the field !"),
    },
  ];

  const excessFeeTemplate = [
    {
      name: "usn",
      label: "USN",
      type: "text",
      validateField: Yup.string()
        .required("Field required !")
        .matches(
          /^[Aa-zZ0-9]+$/i,
          "Only alphanumaric values are allowed for this field"
        ),
    },
    {
      name: "acadYear",
      label: "Academic Year",
      type: "select",
      placeholder: "Select Academic Year",
      validateField: Yup.string().required("Fill the field !"),
      options: [
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
      name: "excessFee",
      label: "Total Excess Fee Amount",
      type: "number",
      validateField: Yup.number()
        .typeError("Invalid amount")
        .moreThan(0, "Amount should be more than 0")
        .required(),
    },
    {
      name: "bank",
      label: "Bank",
      type: "select",
      placeholder: "Select Bank",
      options: [
        {
          option: "Union",
          value: "UNION",
        },
        {
          option: "Axis",
          value: "AXIS",
        },
      ],
      validateField: Yup.string().required("Fill the field !"),
    },
    {
      name: "paymentMode",
      label: "Payment Mode",
      type: "select",
      placeholder: "Select Payment Mode",
      options: [
        {
          option: "Online",
          value: "ONLINE",
        },
        {
          option: "Cash",
          value: "CASH",
        },
        {
          option: "Cheque",
          value: "CHEQUE",
        },
      ],
      validateField: Yup.string().required("Fill the field !"),
    },
  ];

  const securityFeeTemplate = [
    {
      name: "usn",
      label: "USN",
      type: "text",
      validateField: Yup.string()
        .required("Field required !")
        .matches(
          /^[Aa-zZ0-9]+$/i,
          "Only alphanumaric values are allowed for this field"
        ),
    },
    {
      name: "acadYear",
      label: "Academic Year",
      type: "select",
      placeholder: "Select Academic Year",
      validateField: Yup.string().required("Fill the field !"),
      options: [
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
      name: "securityDeposit",
      label: "Total Security Deposit Amount",
      type: "number",
      validateField: Yup.number()
        .typeError("Invalid amount")
        .moreThan(0, "Amount should be more than 0")
        .required(),
    },
    {
      name: "bank",
      label: "Bank",
      type: "select",
      placeholder: "Select Bank",
      options: [
        {
          option: "Union",
          value: "UNION",
        },
        {
          option: "Axis",
          value: "AXIS",
        },
      ],
      validateField: Yup.string().required("Fill the field !"),
    },
    {
      name: "paymentMode",
      label: "Payment Mode",
      type: "select",
      placeholder: "Select Payment Mode",
      options: [
        {
          option: "Online",
          value: "ONLINE",
        },
        {
          option: "Cash",
          value: "CASH",
        },
        {
          option: "Cheque",
          value: "CHEQUE",
        },
      ],
      validateField: Yup.string().required("Fill the field !"),
    },
  ];

  const hostelFeeTemplate = [
    {
      name: "usn",
      label: "USN",
      type: "text",
      validateField: Yup.string()
        .required("Field required !")
        .matches(
          /^[Aa-zZ0-9]+$/i,
          "Only alphanumaric values are allowed for this field"
        ),
    },
    {
      name: "acadYear",
      label: "Academic Year",
      type: "select",
      placeholder: "Select Academic Year",
      validateField: Yup.string().required("Fill the field !"),
      options: [
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
      name: "hostelFee",
      label: "Total Security Deposit Amount",
      type: "number",
      validateField: Yup.number()
        .typeError("Invalid amount")
        .moreThan(0, "Amount should be more than 0")
        .required(),
    },
    {
      name: "bank",
      label: "Bank",
      type: "select",
      placeholder: "Select Bank",
      options: [
        {
          option: "Union",
          value: "UNION",
        },
        {
          option: "Axis",
          value: "AXIS",
        },
      ],
      validateField: Yup.string().required("Fill the field !"),
    },
    {
      name: "paymentMode",
      label: "Payment Mode",
      type: "select",
      placeholder: "Select Payment Mode",
      options: [
        {
          option: "Online",
          value: "ONLINE",
        },
        {
          option: "Cash",
          value: "CASH",
        },
        {
          option: "Cheque",
          value: "CHEQUE",
        },
      ],
      validateField: Yup.string().required("Fill the field !"),
    },
  ];

  const chequeTemplate = [
    {
      name: "chequeNo",
      label: "Cheque No.",
      type: "text",
      validateField: Yup.string()
        .required("Fill the field!")
        .matches(
          /^[a-z0-9]+$/i,
          "Only alphanumaric values are allowed for this field"
        ),
    },
    {
      name: "date",
      label: "Payment Date",
      type: "date",
      validateField: Yup.date()
        .required("Fill the field!")
        .typeError("Not valid date"),
    },
  ];

  const cashTemplate = [
    {
      name: "date",
      label: "Payment Date",
      type: "date",
      validateField: Yup.date()
        .required("Fill the field!")
        .typeError("Not valid date"),
    },
  ];

  const onlineTemplate = [
    {
      name: "chequeNo",
      label: "Transaction ID",
      type: "text",
      validateField: Yup.string()
        .required("Fill the field!")
        .matches(
          /^[a-z0-9]+$/i,
          "Only alphanumaric values are allowed for this field"
        ),
    },
    {
      name: "date",
      label: "Payment Date",
      type: "date",
      validateField: Yup.date()
        .required("Fill the field!")
        .typeError("Not valid date"),
    },
  ];

  return (
    <VStack spacing={"0"} w={"full"} h={"fit-content"} position={"relative"}>
      <Formik
        {...{ initialValues }}
        onSubmit={async (state) => {
          try {
            const filename = "feerecieptwithusn.php";
            await axios.get(
              process.env.NEXT_PUBLIC_ADMIN_URL +
                `${filename}?${Object.keys(state)
                  .map(
                    (key, index) =>
                      `${key}=${
                        key == "date"
                          ? moment(state[key]).format("yyyy-MM-DD")
                          : Object.values(state)[index]
                      }`
                  )
                  .join("&")}&paymentType=${paymentType}`
            );
            const link = document.createElement("a");
            link.href =
              process.env.NEXT_PUBLIC_ADMIN_URL +
              `${filename}?${Object.keys(state)
                .map(
                  (key, index) =>
                    `${key}=${
                      key == "date"
                        ? moment(state[key]).format("yyyy-MM-DD")
                        : Object.values(state)[index]
                    }`
                )
                .join("&")}&paymentType=${paymentType}`;
            link.setAttribute("download", "Fee Reciept Offline.pdf");
            link.setAttribute("target", "_blank");
            document.body.appendChild(link);
            link.click();
          } catch (e: any) {
            toast({
              title: e.response?.data?.msg,
              status: "error",
            });
          }
        }}
      >
        {({
          values: { paymentMode },
          errors,
          handleSubmit,
          isSubmitting,
          isValidating,
        }) => {
          const checkOnPamentModeTemplate =
            paymentMode == "CHEQUE"
              ? chequeTemplate
              : paymentMode == "CASH"
              ? cashTemplate
              : paymentMode == "ONLINE"
              ? onlineTemplate
              : undefined;

          const checkOnPaymentType =
            paymentType == "FEE"
              ? feeTemplate
              : paymentType == "MISCELLANEOUS"
              ? miscellaneousTemplate
              : paymentType == "BUS_FEE"
              ? busFeeTemplate
              : paymentType == "EXCESS_FEE"
              ? excessFeeTemplate
              : paymentType == "SECURITY_DEPOSIT"
              ? securityFeeTemplate
              : paymentType == "HOSTEL_FEE"
              ? hostelFeeTemplate
              : undefined;

          return (
            <React.Fragment>
              <FormikContextProvider />
              <SimpleGrid
                columns={3}
                gap={"5"}
                w={"full"}
                h={"fit-content"}
                py={"7"}
              >
                {checkOnPaymentType?.map((field) => {
                  return (
                    <Field
                      key={field.name}
                      validate={(value) => {
                        let error;
                        if (field.validateField) {
                          try {
                            field.validateField.validateSync(value)?.toString();
                          } catch (e: any) {
                            error = e.message;
                          }
                        }
                        return error;
                      }}
                      {...field}
                    />
                  );
                })}
                {paymentType &&
                  checkOnPamentModeTemplate?.map((cashFields) => (
                    <Field
                      key={cashFields.name}
                      validate={(value) => {
                        let error;
                        if (cashFields.validateField) {
                          try {
                            cashFields.validateField
                              .validateSync(value)
                              ?.toString();
                          } catch (e: any) {
                            error = e.message;
                          }
                        }
                        return error;
                      }}
                      {...cashFields}
                    />
                  ))}
              </SimpleGrid>
              <HStack
                position={"sticky"}
                bottom={"0"}
                justifyContent={"end"}
                w={"full"}
                p={"4"}
                className="border-t border-gray-300 backdrop-blur-sm"
              >
                <Button
                  size={"lg"}
                  isLoading={isSubmitting || isValidating}
                  onClick={() => handleSubmit()}
                  isDisabled={
                    Object.keys(errors).length > 0 ||
                    isSubmitting ||
                    isValidating
                  }
                  colorScheme="purple"
                  leftIcon={<AiOutlineFileDone className="text-xl" />}
                >
                  Generate Reciept
                </Button>
              </HStack>
            </React.Fragment>
          );
        }}
      </Formik>
    </VStack>
  );
}
