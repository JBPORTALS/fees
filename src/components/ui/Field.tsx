import {
  Select,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormErrorIcon,
} from "@chakra-ui/react";
import { FieldHookConfig, useField } from "formik";
import moment from "moment";
import ReactDatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.module.css";

type HookProps = FieldHookConfig<string>;

type OtherProps = {
  options?: { value: string; option: string }[];
};

export const Field = (props: HookProps & OtherProps) => {
  const [fieldProps, metaProps, helperProps] = useField(props);

  function renderConditionalInputField() {
    switch (props.type) {
      case "text":
        return (
          <Input
            _invalid={{
              background(theme) {
                return theme.colors.red["50"];
              },
              borderColor(theme) {
                return theme.colors.red["500"];
              },
              borderWidth: "2px",
            }}
            variant={"filled"}
            {...fieldProps}
            placeholder={props.placeholder}
            type={props.type}
          />
        );
      case "date":
        return (
          <Input
            as={ReactDatePicker}
            _invalid={{
              background(theme) {
                return theme.colors.red["50"];
              },
              borderColor(theme) {
                return theme.colors.red["500"];
              },
              borderWidth: "2px",
            }}
            variant={"filled"}
            selected={
              fieldProps.value == "" ? new Date(fieldProps.value) : new Date()
            }
            dateFormat={"dd/MM/yyyy"}
            onBlur={fieldProps.onBlur}
            name={fieldProps.name}
            //  @ts-ignore
            onChange={(value: Date) =>
              helperProps.setValue(moment(value).format("yyyy-MM-DD"))
            }
          />
        );
      case "select":
        return (
          <Select
            _invalid={{
              background(theme) {
                return theme.colors.red["50"];
              },
              borderColor(theme) {
                return theme.colors.red["500"];
              },
              borderWidth: "2px",
            }}
            variant={"filled"}
            {...fieldProps}
          >
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
