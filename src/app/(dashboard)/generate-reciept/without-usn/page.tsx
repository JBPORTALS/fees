"use client";
import {
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { Formik, useField, FieldHookConfig } from "formik";
import * as Yup from "yup";
import React from "react";
import { useAppSelector } from "@/store";

const ValidationSchema = Yup.object().shape({
  paymentType: Yup.string().required("Fill the field !"),
  name: Yup.string()
    .required("Fill the field !")
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
});

const initialValues = {
  paymentType: "",
  name: "",
  branch: "",
  sem: "",
  category: "",
  acadYear: "",
};

type HookProps = FieldHookConfig<string>;

type OtherProps = {
  options?: { value: string; option: string }[];
};

const Field = (props: HookProps & OtherProps) => {
  const [fieldProps, metaProps] = useField(props);

  function renderConditionalInputField() {
    switch (props.type) {
      case "text":
        return (
          <Input
            variant={"filled"}
            {...fieldProps}
            placeholder={props.placeholder}
            type={props.type}
          />
        );
      case "select":
        return (
          <Select variant={"filled"} {...fieldProps}>
            <option value={""}>{props.placeholder}</option>
            {props.options?.map((op) => (
              <option value={op.value}>{op.option}</option>
            ))}
          </Select>
        );
      default:
        return null;
    }
  }

  return (
    <FormControl isInvalid={!!metaProps.touched && !!metaProps.error}>
      <FormLabel>{props["aria-label"]}</FormLabel>
      {renderConditionalInputField()}
      {metaProps.touched && metaProps.error && (
        <FormErrorMessage>
          <FormErrorIcon />
          {metaProps.error}
        </FormErrorMessage>
      )}
    </FormControl>
  );
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
        placeholder: "Select Payment Type",
        options: [
          {
            value: "FEE",
            option: "Fee",
          },
        ],
      },
      {
        name: "name",
        label: "Name",
        type: "text",
      },
      {
        name: "branch",
        label: "Branch",
        type: "select",
        placeholder: "Select Branch",
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
        options: [
          {
            value: "1",
            option: "1",
          },
        ],
      },
      {
        name: "acadYear",
        label: "Academic Year",
        type: "select",
        placeholder: "Select Academic Year",
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
    ],
  };

  return (
    <Stack h={"full"} px={"36"} py={"5"} w={"full"} justifyContent={"start"}>
      <SimpleGrid columns={3} gap={"5"}>
        <Formik
          validationSchema={ValidationSchema}
          {...{ initialValues }}
          onSubmit={() => {}}
        >
          {(formik) => {
            return (
              <>
                {template.fields.map((field) => {
                  return (
                    <Field
                      aria-label={field.label}
                      name={field.name}
                      type={field.type}
                      placeholder={field?.placeholder}
                      options={field?.options}
                    />
                  );
                })}
                {/* <pre className="flex flex-wrap whitespace-nowrap">
                  {JSON.stringify(formik)}
                </pre> */}
              </>
            );
          }}
        </Formik>
      </SimpleGrid>
    </Stack>
  );
}
