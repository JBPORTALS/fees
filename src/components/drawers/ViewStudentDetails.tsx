import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  SimpleGrid,
  Spinner,
  Tag,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import IDrawer from "../ui/utils/IDrawer";
import { useFormik, Formik } from "formik";
import * as Yup from "yup";
import { useAppSelector } from "@/store";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { AiOutlineUserDelete } from "react-icons/ai";
import {
  fetchFeeDetails,
  fetchSelectedFeeSearchDetails,
} from "@/store/fees.slice";
import { useAppDispatch } from "@/hooks";
import { CATS, SEMS } from "../mock-data/constants";
import IModal from "../ui/utils/IModal";
import moment from "moment";
import { useUser } from "@/utils/auth";

const Schema = Yup.object().shape({
  name: Yup.string().required().min(2),
  sem: Yup.string().required("Sem is required"),
  category: Yup.string().required("Year is required"),
  branch: Yup.string().required("Branch is required"),
  total: Yup.number().required().min(0).typeError("invalid number"),
  paid: Yup.number().required().min(0).typeError("invalid number"),
});

type FormikState = {
  id: string;
  name: string;
  usn: string;
  sem: string;
  branch: string;
  total: number;
  status: "FULLY PAID" | "PARTIALLY PAID" | "NOT PAID";
  paid: number;
  remaining: number;
  category: string;
};

let initialState: FormikState = {
  id: "",
  usn: "",
  name: "",
  sem: "",
  branch: "",
  total: 0,
  status: "NOT PAID",
  paid: 0,
  remaining: 0,
  category: "",
};

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
  const pending = useAppSelector((state) => state.fees.selected_fee.pending);
  const router = useRouter();
  const acadYear = useAppSelector((state) => state.fees.acadYear);
  const {
    errors,
    touched,
    setFieldValue,
    values,
    isSubmitting,
    isValid,
    handleBlur,
    handleChange,
    handleSubmit,
    setFormikState,
  } = useFormik<FormikState>({
    initialValues: initialState,
    onSubmit: async () => await updateStudent(),
    validationSchema: Schema,
    enableReinitialize: true,
    initialStatus: "Loading",
  });

  const dispatch = useAppDispatch();
  const { onOpen, isOpen, onClose } = useDisclosure();
  const {
    onOpen: onPaymentOpen,
    isOpen: isPaymentOpen,
    onClose: onPaymentClose,
  } = useDisclosure();
  const user = useUser();

  const Categories = CATS(user?.college);

  useEffect(() => {
    console.log(id);
    if (id && isOpen && user?.college) {
      dispatch(
        fetchSelectedFeeSearchDetails({ id, regno, college: user?.college! })
      );
    }
  }, [id, isOpen, regno, dispatch, user?.college]);

  useEffect(() => {
    if (isOpen && id && !pending)
      setFormikState({
        isSubmitting: false,
        values: {
          id: data[0]?.id ?? "",
          usn: data[0]?.regno ?? "",
          name: data[0]?.name ?? "",
          sem: data[0]?.sem ?? "",
          branch: data[0]?.branch ?? "",
          total: data[0]?.total ?? "",
          category: data[0]?.category ?? "",
          status: data[0]?.status ?? "",
          paid: data[0]?.paid ?? "",
          remaining: data[0]?.remaining ?? 0,
        },
        errors: {},
        touched: {},
        submitCount: 0,
        status: "",
        isValidating: true,
      });
  }, [pending, regno, isOpen, id]);

  function changeStateValue() {
    setFieldValue(
      "remaining",
      parseInt(values.total.toString()) - parseInt(values.paid.toString())
    );
    if (values.total == values.paid) setFieldValue("status", "FULLY PAID");
    else if (values.paid < values.total && values.paid > 0)
      setFieldValue("status", "PARTIALLY PAID");
    else if (values.remaining == values.total)
      setFieldValue("status", "NOT PAID");
  }

  useEffect(() => {
    changeStateValue();
  }, [values.total, values.paid]);

  const updateStudent = async () => {
    try {
      const formData = new FormData();
      formData.append("id", values.id);
      formData.append("usn", values.usn);
      formData.append("name", values.name);
      formData.append("category", values.category);
      formData.append("sem", values.sem);
      formData.append("branch", values.branch);
      formData.append("college", user?.college!);
      formData.append("total_fee", values.total.toString());
      formData.append("status", values.status);
      formData.append("paid", values.paid.toString());
      formData.append("remaining", values.remaining.toString());
      formData.append("acadyear", acadYear);
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
  };

  const deleteStudent = useCallback(async () => {
    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.append("id", values.id);
      formData.append("usn", values.usn);
      formData.append("college", user?.college!);
      formData.append("acadyear", acadYear);
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
      dispatch(
        fetchFeeDetails({
          branch: values.branch,
          year: data[0].year,
          college: user?.college!,
        })
      );
      router.refresh();
      onClose();
      onClose();
    } catch (e: any) {
      e.response.data?.msg && toast.error(e.response.data?.msg);
    }
    setIsDeleting(false);
  }, [
    values.id,
    values.usn,
    user?.college,
    data,
    dispatch,
    router,
    onClose,
    router,
    values.branch,
  ]);

  const [amount, setAmount] = useState("0");
  const [method, setMethod] = useState("");
  const [challanId, setChallanId] = useState("");
  const [tid, setTid] = useState("");
  const [date, setDate] = useState("");

  const paymentUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("id", values.id);
      formData.append("regno", values.usn);
      formData.append("paid", amount);
      formData.append("method", method);
      formData.append("college", user?.college!);
      formData.append("challan_id", challanId);
      formData.append("tid", tid);
      formData.append("date", moment(date).format("DD-MM-yyyy"));
      formData.append("acadYear", acadYear);

      const response = await axios(
        process.env.NEXT_PUBLIC_ADMIN_URL + "studentupdatefee.php",
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
      onPaymentClose();
    } catch (e: any) {
      e.response.data?.msg && toast.error(e.response.data?.msg);
    }
  };

  return (
    <>
      <IModal
        heading="Payment Updation"
        buttonTitle="Update"
        size={"2xl"}
        isOpen={isPaymentOpen}
        onSubmit={paymentUpdate}
        onClose={() => {
          onPaymentClose();
        }}
        isDisabled={
          !amount || !method || amount == "0" || !challanId || !date || !tid
        }
      >
        <VStack>
          <HStack>
            <Heading size={"md"}>{values.name}</Heading>
            <Heading size={"md"} color={"gray.500"}>
              {values.usn}
            </Heading>
          </HStack>
          <HStack>
            <Tag colorScheme="purple" size={"lg"}>
              {values.branch} - {values.sem} Sem
            </Tag>
            <Tag colorScheme="purple" size={"lg"}>
              {values.category}
            </Tag>
          </HStack>
          <SimpleGrid columns={2} gap={"3"}>
            <FormControl>
              <FormLabel>Challan ID</FormLabel>
              <Input
                bg={"white"}
                value={challanId}
                onChange={(e) => setChallanId(e.target.value)}
                type="text"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Amount</FormLabel>
              <Input
                bg={"white"}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Payment Method</FormLabel>
              <Select
                bg={"white"}
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value={""}>Select</option>
                <option value={"UPI_SCAN"}>UPI SCAN</option>
                <option value={"MANUAL_RECIEPT"}>MANUAL RECIEPT</option>
                <option value={"EASYPAY_PAYMENT"}>EASYPAY PAYMENT</option>
                <option value={"OTHERS"}>OTHERS</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Transaction ID</FormLabel>
              <Input
                bg={"white"}
                value={tid}
                onChange={(e) => setTid(e.target.value)}
                type="text"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Payment Date</FormLabel>
              <Input
                bg={"white"}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                type="date"
              />
            </FormControl>
          </SimpleGrid>
        </VStack>
      </IModal>

      <IDrawer
        size={"sm"}
        isLoading={isSubmitting}
        isDisabled={!!Object.keys(errors).length}
        onSubmit={() => {
          handleSubmit();
        }}
        buttonTitle="Save"
        onClose={() => {
          setFormikState({
            isSubmitting: false,
            isValidating: false,
            submitCount: 0,
            values: initialState,
            errors: {},
            touched: {},
            status: "",
          });
          onClose();
        }}
        isOpen={isOpen}
        heading="Student Details"
      >
        {pending ? (
          <VStack
            h={"auto"}
            py={"300px"}
            w={"auto"}
            alignContent={"center"}
            alignItems={"center"}
          >
            <Spinner colorScheme="facebook" color="blue" size={"lg"} />
          </VStack>
        ) : (
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
                  {SEMS(user?.college).map((value) => (
                    <option value={value.value} key={value.value}>
                      {value.option}
                    </option>
                  ))}
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
                  <option value={""}>Select Category</option>
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

              <FormControl px={"5"}>
                <FormLabel flex={1}>
                  <Text>Paid Amount</Text>
                </FormLabel>
                <Input
                  name="paid"
                  bg={"white"}
                  variant={"filled"}
                  flex={"1.5"}
                  value={values.paid}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormErrorMessage>{errors.total}</FormErrorMessage>
              </FormControl>

              <FormControl px={"5"}>
                <FormLabel flex={1}>
                  <Text>Balance Amount</Text>
                </FormLabel>
                <Input
                  name="remaining"
                  bg={"white"}
                  variant={"filled"}
                  flex={"1.5"}
                  value={values.remaining}
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
                  value={values.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormControl>
            </>
            <VStack
              position={"sticky"}
              className="backdrop-blur-sm"
              bg={"rgba(255,255,255,0.4)"}
              bottom={"0"}
              w={"full"}
              p={"5"}
            >
              {values.id && (
                <>
                  {values.remaining < 0 && (
                    <Alert status="warning">
                      <AlertIcon />
                      <Box>
                        <AlertTitle fontSize={"small"}>Warning !</AlertTitle>
                        <AlertDescription fontSize={"smaller"}>
                          Remaining Amount is less than zero. You still may
                          continue to save the changes.
                        </AlertDescription>
                      </Box>
                    </Alert>
                  )}
                  <Button
                    isDisabled={!isValid}
                    onClick={onPaymentOpen}
                    w={"full"}
                    colorScheme="purple"
                  >
                    Update Payment
                  </Button>
                  <Button
                    isLoading={isDeleting}
                    onClick={() => deleteStudent()}
                    w={"full"}
                    colorScheme="red"
                    leftIcon={<AiOutlineUserDelete />}
                  >
                    Remove
                  </Button>
                </>
              )}
            </VStack>
          </VStack>
        )}
      </IDrawer>
      {children({ onOpen })}
    </>
  );
}
