import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
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
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { AiOutlineUserDelete } from "react-icons/ai";
import {
  fetchFeeDetails,
  fetchSelectedFeeSearchDetails,
} from "@/store/fees.slice";
import { useAppDispatch } from "@/hooks";
import { useSupabase } from "@/app/supabase-provider";
import { CATS } from "../mock-data/constants";

const Schema = Yup.object().shape({
  name: Yup.string().required().min(2),
  sem: Yup.string().required("Sem is required"),
  category: Yup.string().required("Year is required"),
  branch: Yup.string().required("Branch is required"),
  total: Yup.number().required().min(0).typeError("invalid number"),
});

const Categories = CATS;

export default function ViewStudentsDetails({
  id,
  children,
  regno,
}: {
  id: string;
  regno: string;
  children: ({ onOpen }: { onOpen: () => void }) => JSX.Element;
}) {
  const branch_list = useAppSelector(
    (state) => state.fees.branch_list.data
  ) as [];
  const [isDeleting, setIsDeleting] = useState(false);

  const data = useAppSelector((state) => state.fees.selected_fee.data);
  const router = useRouter();
  const pathname = usePathname();

  console.log(pathname);

  let initialState = {
    id: data[0]?.id ?? "",
    usn: data[0]?.regno ?? "",
    name: data[0]?.name ?? "",
    sem: data[0]?.sem ?? "",
    branch: data[0]?.branch ?? "",
    total: data[0]?.total ?? "",
    category: data[0]?.category ?? "",
  };

  const dispatch = useAppDispatch();
  const { onOpen, isOpen, onClose } = useDisclosure();
  const user = useSupabase().user;

  useEffect(() => {
    console.log(id);
    if (isOpen) {
      dispatch(
        fetchSelectedFeeSearchDetails({ id, regno, college: user?.college! })
      );
    }
  }, [id, isOpen, regno, dispatch]);

  const {
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    isSubmitting,
  } = useFormik({
    initialValues: initialState,
    onSubmit: async (values) => await updateStudent(values),
    validationSchema: Schema,
    enableReinitialize: true,
  });

  const updateStudent = useCallback(
    async (values: typeof initialState) => {
      console.log(`updateID`, values.id);
      try {
        const formData = new FormData();
        formData.append("id", values.id);
        formData.append("usn", values.usn);
        formData.append("name", values.name);
        formData.append("category", values.category);
        formData.append("sem", values.sem);
        formData.append("branch", values.branch);
        formData.append("total_fee", values.total.toString());
        const response = await axios(
          process.env.NEXT_PUBLIC_ADMIN_URL + "studentupdate.php",
          {
            method: "POST",
            data: formData,
          }
        );
        if (!response || response.status !== 201)
          throw Error("Something went wrong !");
        toast.success("Updated successfully", { position: "top-right" });
        dispatch(
          fetchFeeDetails({
            branch: values.branch,
            year: data[0].year,
            college: user?.college!,
          })
        );
        router.refresh();
        onClose();
      } catch (e: any) {
        e.response.data?.msg && toast.error(e.response.data?.msg);
      }
    },
    [
      values.id,
      values.usn,
      values.name,
      values.category,
      values.sem,
      values.branch,
      values.total,
      data[0].year,
    ]
  );

  const deleteStudent = useCallback(
    async (values: typeof initialState) => {
      setIsDeleting(true);
      try {
        const formData = new FormData();
        formData.append("id", values.id);
        formData.append("usn", values.usn);
        const response = await axios(
          process.env.NEXT_PUBLIC_ADMIN_URL + "studentdelete.php",
          {
            method: "POST",
            data: formData,
          }
        );
        if (!response || response.status !== 201)
          throw Error("Something went wrong !");
        toast.success("Deleted successfully", { position: "top-right" });
        router.refresh();
        onClose();
      } catch (e: any) {
        e.response.data?.msg && toast.error(e.response.data?.msg);
      }
      setIsDeleting(false);
    },
    [values.id, values.usn]
  );

  return (
    <>
      <IDrawer
        isLoading={isSubmitting}
        isDisabled={!!Object.keys(errors).length}
        onSubmit={() => {
          handleSubmit();
        }}
        buttonTitle="Save"
        onClose={onClose}
        isOpen={isOpen}
        heading="Student Details"
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
            {/* <pre>{JSON.stringify(values)}</pre> */}
            <FormControl
              isInvalid={!!errors.usn?.length && touched.usn}
              px={"5"}
            >
              <FormLabel flex={1}>
                <Text>USN</Text>
              </FormLabel>
              <Input
                isReadOnly
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
                {branch_list.map((branch: any, key) => (
                  <option key={branch + key} value={branch.branch}>
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
                {Categories.map((category, key) => (
                  <option key={category.value + key} value={category.value}>
                    {category.option}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.category}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={!!errors.total?.length && touched.total}
              px={"5"}
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

            <FormControl isReadOnly px={"5"}>
              <FormLabel flex={1}>
                <Text>Paid Amount</Text>
              </FormLabel>
              <Input
                isReadOnly
                name="paid"
                bg={"white"}
                variant={"filled"}
                flex={"1.5"}
                value={data[0]?.paid}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FormErrorMessage>{errors.total}</FormErrorMessage>
            </FormControl>

            <FormControl isReadOnly px={"5"}>
              <FormLabel flex={1}>
                <Text>Balance Amount</Text>
              </FormLabel>
              <Input
                isReadOnly
                name="remaining"
                bg={"white"}
                variant={"filled"}
                flex={"1.5"}
                value={data[0]?.remaining}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </FormControl>

            <FormControl isReadOnly px={"5"}>
              <FormLabel flex={1}>
                <Text>Status</Text>
              </FormLabel>
              <Input
                isReadOnly
                name="status"
                bg={"white"}
                variant={"filled"}
                flex={"1.5"}
                value={data[0]?.status}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </FormControl>
          </>
          <HStack
            position={"sticky"}
            className="backdrop-blur-sm"
            bg={"rgba(255,255,255,0.4)"}
            bottom={"0"}
            w={"full"}
            p={"5"}
          >
            {values.id && (
              <Button
                isLoading={isDeleting}
                onClick={() => deleteStudent(values)}
                w={"full"}
                colorScheme="red"
                leftIcon={<AiOutlineUserDelete />}
              >
                Remove
              </Button>
            )}
          </HStack>
        </VStack>
      </IDrawer>
      {children({ onOpen })}
    </>
  );
}
