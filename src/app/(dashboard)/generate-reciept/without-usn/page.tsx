"use client";
import { SimpleGrid, Stack } from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import React from "react";
import { useAppSelector } from "@/store";
import { Field } from "@/components/ui/Field";
import moment from "moment";

const initialValues = {
  paymentType: "",
  name: "",
  branch: "",
  sem: "",
  category: "",
  acadYear: "",
  tuitionFee: 0,
  vtuFee: 0,
  bank: "",
  paymentMode: "",
  date:moment(new Date()).format("yyyy-MM-DD"),
  transactionId:"",
  ddNo:""
};

export default function WithoutUSNPage() {
  const branchList = useAppSelector((state) => state.fees.branch_list.data) as {
    branch: string;
  }[];

  const template = {
    fields: [
      {
        name: "paymentType",
        label: "Payment Type",
        type: "select",
        validate: Yup.string().required("Fill the field !"),
        placeholder: "Select Payment Type",
        options: [
          {
            value: "FEE",
            option: "Fee",
          },
          {
            value: "MISCELLANEOUS",
            option: "Miscellaneous",
          },
          {
            value: "BUS_FEE",
            option: "Bus Fee",
          },
          {
            value: "EXCESS_FEE",
            option: "Excess Fee",
          },
          {
            value: "SECURITY_DEPOSIT",
            option: "Security Deposit",
          },
          {
            value: "HOSTEL_FEE",
            option: "Hostel Fee",
          },
        ],
      },
      {
        name: "name",
        label: "Name",
        type: "text",
        validate: Yup.string()
          .required("Field required !")
          .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field"),
      },
      {
        name: "branch",
        label: "Branch",
        type: "select",
        placeholder: "Select Branch",
        validate: Yup.string().required("Fill the field !"),
        options: branchList.map((value) => ({
          value: value.branch,
          option: value.branch,
        })),
      },
      {
        name: "sem",
        label: "Sem",
        type: "select",
        placeholder: "Select Sem",
        validate: Yup.string().required("Fill the field !"),
        options: [
          { option: "New Admission", value: "NEW_ADMISSION" },
          ...new Array(8).fill(0).map((_value, index) => ({
            value: (index + 1).toString(),
            option: (index + 1).toString(),
          })),
        ],
      },
      {
        name: "acadYear",
        label: "Academic Year",
        type: "select",
        placeholder: "Select Academic Year",
        validate: Yup.string().required("Fill the field !"),
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
        validate: Yup.number()
          .typeError("invalid number")
          .required("Field required !")
          .min(0, "minimum amount should be 0"),
      },
      {
        name: "vtuFee",
        label: "VTU/DTE/DDPI/GP.INS/ IRC Fee",
        type: "text",
        validate: Yup.number()
          .typeError("invalid number")
          .required("Field required !")
          .min(0, "minimum amount should be 0"),
      },
      {
        name: "collegeFee",
        label: "College Fee",
        type: "text",
        validate: Yup.number()
          .typeError("invalid number")
          .required("Field required !")
          .min(0, "minimum amount should be 0"),
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
        validate: Yup.string().required("Fill the field !"),
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
        validate: Yup.string().required("Fill the field !"),
      },
    ],
  };

  const chequeTemplate = [
    {
      name: "chequeNo",
      label: "Cheque No.",
      type: "text",
      validate: Yup.string().required("Fill the field!"),
    },
    {
      name:"date",
      label:"Payment Date",
      type:"date",
      validate:Yup.date().required("Fill the field!").typeError("Not valid date")
    }
  ];

  return (
    <Stack h={"full"} px={"36"} py={"5"} w={"full"} justifyContent={"start"}>
      <SimpleGrid columns={3} gap={"5"}>
        <Formik
          // validationSchema={ValidationSchema}
          {...{ initialValues }}
          onSubmit={() => {}}
        >
          {({ values }) => {
            const checkOnPamentModeTemplate = values.paymentMode=="CHEQUE"?chequeTemplate:undefined;

            return (
              <>
                {template.fields.map((field) => {
                  return (
                    <Field
                      validate={(value) => {
                        let error;
                        if (field.validate) {
                          try {
                            field.validate.validateSync(value)?.toString();
                          } catch (e: any) {
                            error = e.message;
                          }
                        }
                        return error;
                      }}
                      aria-label={field.label}
                      name={field.name}
                      type={field.type}
                      placeholder={field?.placeholder}
                      options={field?.options}
                    />
                  );
                })}
                {
                  checkOnPamentModeTemplate?.map((cashFields) => (
                    <Field
                      validate={(value) => {
                        let error;
                        if (cashFields.validate) {
                          try {
                            cashFields.validate.validateSync(value)?.toString();
                          } catch (e: any) {
                            error = e.message;
                          }
                        }
                        return error;
                      }}
                      aria-label={cashFields.label}
                      name={cashFields.name}
                      type={cashFields.type}
                    />
                  ))
                }
                <pre>{JSON.stringify(values.date)}</pre>
              </>
            );
          }}
        </Formik>
      </SimpleGrid>
    </Stack>
  );
}
