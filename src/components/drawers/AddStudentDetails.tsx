import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import IDrawer from "../ui/utils/IDrawer";
import { Field, Formik, useFormik } from "formik";
import * as Yup from "yup";
import { useAppSelector } from "@/store";
import { useCallback, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface props {
  children: ({ onOpen }: { onOpen: () => void }) => JSX.Element;
}

const initialState = {
  usn: "",
  name: "",
  sem: "",
  branch: "",
  total: "",
  category: "",
};

const Schema = Yup.object().shape({
  usn: Yup.string().required(),
  name: Yup.string().required().min(2),
  sem: Yup.string().required("Sem is required"),
  category: Yup.string().required("Year is required"),
  branch: Yup.string().required("Branch is required"),
  total: Yup.number().required().min(0).typeError("invalid number"),
});

const Categories = [
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
];

export default function AddStudentsDetails({ children }: props) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const branch_list = useAppSelector(
    (state) => state.fees.branch_list.data
  ) as [];

  const addStudent = useCallback(async (values: typeof initialState) => {
    try {
      const formData = new FormData();
      formData.append("usn", values.usn);
      formData.append("name", values.name);
      formData.append("category", values.category);
      formData.append("sem", values.sem);
      formData.append("branch", values.branch);
      formData.append("total_fee", values.total);
      const response = await axios(
        process.env.NEXT_PUBLIC_ADMIN_URL + "studentadd.php",
        {
          method: "POST",
          data: formData,
        }
      );
      if (!response || response.status !== 201)
        throw Error("Something went wrong !");
      toast.success("Student Added successfully", { position: "top-right" });
      onClose();
    } catch (e: any) {
      toast.error(e.response?.data?.msg);
    }
  }, []);

  const {
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    isSubmitting,
    ...props
  } = useFormik({
    initialValues: initialState,
    onSubmit: async (values) => await addStudent(values),
    validationSchema: Schema,
  });

  return (
    <>
      <IDrawer
        isLoading={isSubmitting}
        isDisabled={!!Object.keys(errors).length}
        onSubmit={() => {
          handleSubmit();
        }}
        buttonTitle="Save"
        onClose={() => {
          onClose();
        }}
        isOpen={isOpen}
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
            <FormControl
              isInvalid={!!errors.usn?.length && touched.usn}
              px={"5"}
            >
              <FormLabel flex={1}>
                <Text>USN</Text>
              </FormLabel>
              <Input
                name="usn"
                bg={"white"}
                variant={"filled"}
                flex={"1.5"}
                value={values.usn}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FormErrorMessage>{errors.usn}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={!!errors.name?.length && touched.name}
              px={"5"}
            >
              <FormLabel flex={1}>
                <Text>Name</Text>
              </FormLabel>
              <Input
                name="name"
                bg={"white"}
                variant={"filled"}
                flex={"1.5"}
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={!!errors.sem?.length && touched.sem}
              px={"5"}
            >
              <FormLabel flex={1}>
                <Text>Sem</Text>
              </FormLabel>
              <Select
                name="sem"
                bg={"white"}
                variant={"filled"}
                flex={"1.5"}
                value={values.sem}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value={""}>Select Sem</option>
                <option value={"1"}>1</option>
                <option value={"2"}>2</option>
                <option value={"3"}>3</option>
                <option value={"4"}>4</option>
                <option value={"5"}>5</option>
                <option value={"6"}>6</option>
                <option value={"7"}>6</option>
                <option value={"8"}>6</option>
              </Select>
              <FormErrorMessage>{errors.sem}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={!!errors.branch?.length && touched.branch}
              px={"5"}
            >
              <FormLabel flex={1}>
                <Text>Branch</Text>
              </FormLabel>
              <Select
                name="branch"
                bg={"white"}
                variant={"filled"}
                flex={"1.5"}
                value={values.branch}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value={""}>Select Branch</option>
                {branch_list.map((branch: any) => (
                  <option key={branch} value={branch.branch}>
                    {branch.branch}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.branch}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={!!errors.category?.length && touched.category}
              px={"5"}
            >
              <FormLabel flex={1}>
                <Text>Category</Text>
              </FormLabel>
              <Select
                name="category"
                bg={"white"}
                variant={"filled"}
                flex={"1.5"}
                value={values.category}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value={""}>Select Branch</option>
                {Categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.option}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.category}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={!!errors.total?.length && touched.total}
              px={"5"}
              pb={"5"}
            >
              <FormLabel flex={1}>
                <Text>Total Amount</Text>
              </FormLabel>
              <Input
                name="total"
                bg={"white"}
                variant={"filled"}
                flex={"1.5"}
                value={values.total}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FormErrorMessage>{errors.total}</FormErrorMessage>
            </FormControl>
          </>
        </VStack>
      </IDrawer>
      {children({ onOpen })}
    </>
  );
}
