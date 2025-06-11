import {
  Field,
  Input,
  InputGroup,
  NativeSelect,
  NumberInput,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import IDrawer from "../ui/utils/IDrawer";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppSelector } from "@/store";
import { useCallback } from "react";
import axios from "axios";
import { useAppDispatch } from "@/hooks";
import { fetchFeeDetails } from "@/store/fees.slice";
import { SEMS } from "../mock-data/constants";
import { useUser } from "@/utils/auth";
import { toaster } from "../ui/toaster";

interface props {
  children: ({ onOpen }: { onOpen: () => void }) => JSX.Element;
}

const initialState = {
  usn: "",
  name: "",
  phone: "",
  sem: "",
  branch: "",
  total: "",
  category: "",
  student_college: "",
  college: "",
};

const Schema = Yup.object().shape({
  usn: Yup.string().required(),
  name: Yup.string().required().min(2),
  phone: Yup.string()
    .required()
    .min(10, "Phone number should be 10 digits")
    .max(10, "Phone number can't be exceed more than 10 digits"),
  sem: Yup.string().required("Sem is required"),
  category: Yup.string().required("Year is required"),
  college: Yup.string(),
  student_college: Yup.string().when("college", ([college], sch) => {
    return college == "HOSTEL"
      ? sch.required("College is required")
      : sch.optional();
  }),
  branch: Yup.string().required("Branch is required"),
  total: Yup.number().required().min(0).typeError("invalid number"),
});

const Categories = [
  {
    value: "SNQ",
    option: "SNQ",
  },
  {
    value: "MANAGEMENT",
    option: "MANAGEMENT",
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
];

export default function AddStudentsDetails({ children }: props) {
  const { open, onClose, onOpen } = useDisclosure();
  const branch_list = useAppSelector(
    (state) => state.fees.branch_list.data
  ) as [];
  const user = useUser();
  const dispatch = useAppDispatch();
  const acadYear = useAppSelector((state) => state.fees.acadYear);

  const {
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    isSubmitting,
    handleReset,
    setFieldValue,
    ...props
  } = useFormik({
    initialValues: initialState,
    onSubmit: async (values) => await addStudent(values),
    validationSchema: Schema,
  });

  const addStudent = useCallback(
    async (values: typeof initialState) => {
      try {
        const formData = new FormData();
        formData.append("usn", values.usn);
        formData.append("name", values.name);
        formData.append("phone", values.phone);
        formData.append("category", values.category);
        formData.append("sem", values.sem);
        formData.append("branch", values.branch);
        formData.append("total_fee", values.total);
        formData.append("college", user?.college!);
        formData.append("acadYear", acadYear);
        formData.append("student_college", acadYear);
        const response = await axios(
          process.env.NEXT_PUBLIC_ADMIN_URL + "studentadd.php",
          {
            method: "POST",
            data: formData,
          }
        );

        toaster.success({ title: "Student Added successfully" });
        handleReset(values);
        dispatch(
          fetchFeeDetails({
            branch: values.branch,
            year: values.sem,
            college: user?.college!,
          })
        );
        onClose();
      } catch (e: any) {
        console.log("error occurs while adding the student", e);
        toaster.error({ title: e.response.data.msg });
      }
    },
    [user?.college, toaster]
  );

  return (
    <>
      <IDrawer
        loading={isSubmitting}
        disabled={!!Object.keys(errors).length}
        onSubmit={() => {
          handleSubmit();
        }}
        buttonTitle="Save"
        size={"sm"}
        onClose={() => {
          onClose();
        }}
        open={open}
        heading="New Student"
      >
        <VStack
          alignItems={"flex-start"}
          py={"5"}
          w={"full"}
          h={"full"}
          gap={"2"}
          justifyContent={"start"}
          position={"relative"}
        >
          <>
            <Field.Root invalid={!!errors.usn?.length && touched.usn} px={"5"}>
              <Field.Label flex={1}>
                <Text>USN</Text>
              </Field.Label>
              <Input
                name="usn"
                value={values.usn}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Field.ErrorText>{errors.usn}</Field.ErrorText>
            </Field.Root>

            <Field.Root
              invalid={!!errors.name?.length && touched.name}
              px={"5"}
            >
              <Field.Label flex={1}>
                <Text>Name</Text>
              </Field.Label>
              <Input
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Field.ErrorText>{errors.name}</Field.ErrorText>
            </Field.Root>

            <Field.Root
              invalid={!!errors.phone?.length && touched.phone}
              px={"5"}
            >
              <Field.Label flex={1}>
                <Text>Phone Number</Text>
              </Field.Label>
              <InputGroup startAddon={"+91"}>
                <NumberInput.Root
                  name="phone"
                  w={"full"}
                  value={values.phone}
                  onChange={handleChange}
                >
                  <NumberInput.Input onBlur={handleBlur} />
                </NumberInput.Root>
              </InputGroup>
              <Field.ErrorText>{errors.phone}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.sem?.length && touched.sem} px={"5"}>
              <Field.Label flex={1}>
                <Text>Sem</Text>
              </Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Indicator />
                <NativeSelect.Field
                  name="sem"
                  value={values.sem}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value={""}>Select Sem</option>
                  {SEMS(user?.college).map((value, index) => (
                    <option key={value.value} value={value.value}>
                      {value.option}
                    </option>
                  ))}
                </NativeSelect.Field>
              </NativeSelect.Root>
              <Field.ErrorText>{errors.sem}</Field.ErrorText>
            </Field.Root>

            <Field.Root
              invalid={!!errors.branch?.length && touched.branch}
              px={"5"}
            >
              <Field.Label flex={1}>
                <Text>Branch</Text>
              </Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Indicator />
                <NativeSelect.Field
                  name="branch"
                  value={values.branch}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value={""}>Select Branch</option>
                  {branch_list.map((branch: any) => (
                    <option key={branch.branch} value={branch.branch}>
                      {branch.branch}
                    </option>
                  ))}
                </NativeSelect.Field>
              </NativeSelect.Root>
              <Field.ErrorText>{errors.branch}</Field.ErrorText>
            </Field.Root>

            <Field.Root
              invalid={!!errors.category?.length && touched.category}
              px={"5"}
            >
              <Field.Label flex={1}>
                <Text>Category</Text>
              </Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Indicator />
                <NativeSelect.Field
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value={""}>Select Category</option>
                  {Categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.option}
                    </option>
                  ))}
                </NativeSelect.Field>
              </NativeSelect.Root>
              <Field.ErrorText>{errors.category}</Field.ErrorText>
            </Field.Root>

            <Field.Root
              invalid={!!errors.total?.length && touched.total}
              px={"5"}
              pb={"5"}
            >
              <Field.Label flex={1}>
                <Text>Total Amount</Text>
              </Field.Label>
              <Input
                name="total"
                value={values.total}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Field.ErrorText>{errors.total}</Field.ErrorText>
            </Field.Root>
          </>
        </VStack>
      </IDrawer>
      {children({ onOpen })}
    </>
  );
}
