import {
  Alert,
  Box,
  Button,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Spinner,
  Tag,
  Field,
  Text,
  useDisclosure,
  VStack,
  NativeSelect,
  NumberInput,
  InputGroup,
} from "@chakra-ui/react";
import IDrawer from "../ui/utils/IDrawer";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppSelector } from "@/store";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
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
import { toaster } from "../ui/toaster";

const Schema = Yup.object().shape({
  name: Yup.string().required().min(2),
  phone: Yup.string()
    .required()
    .min(10, "Phone number should be 10 digits")
    .max(10, "Phone number can't be exceed more than 10 digits")
    .optional(),
  sem: Yup.string().required("Sem is required"),
  category: Yup.string().required("Year is required"),
  branch: Yup.string().required("Branch is required"),
  total: Yup.number().required().min(0).typeError("invalid number"),
  paid: Yup.number().required().min(0).typeError("invalid number"),
});

type FormikState = {
  id: string;
  name: string;
  phone: string;
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
  phone: "",
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
  const { onOpen, open, onClose } = useDisclosure();
  const {
    onOpen: onPaymentOpen,
    open: isPaymentOpen,
    onClose: onPaymentClose,
  } = useDisclosure();
  const user = useUser();

  const Categories = CATS(user?.college);

  useEffect(() => {
    console.log(id);
    if (id && open && user?.college) {
      dispatch(
        fetchSelectedFeeSearchDetails({ id, regno, college: user?.college! })
      );
    }
  }, [id, open, regno, dispatch, user?.college]);

  useEffect(() => {
    if (open && id && !pending)
      setFormikState({
        isSubmitting: false,
        values: {
          id: data[0]?.id ?? "",
          usn: data[0]?.regno ?? "",
          phone: data[0]?.phone ?? "",
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
  }, [pending, regno, open, id, data, setFormikState]);

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
      formData.append("phone", values.phone);
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
      toaster.success({ title: "Updated successfully" });
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
      console.log(e);
      toaster.error({ title: e.response.data?.msg });
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
      toaster.info({ title: "Deleted successfully" });
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
      toaster.error({ title: e.response.data?.msg });
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
      formData.append("phone", values.phone);
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
      toaster.success({ title: "Updated successfully" });
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
      toaster.error({ title: e.response.data?.msg });
    }
  };

  return (
    <>
      <IModal
        heading="Payment Updation"
        buttonTitle="Update"
        size={"xl"}
        open={isPaymentOpen}
        onSubmit={paymentUpdate}
        onClose={() => {
          onPaymentClose();
        }}
        disabled={
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
            <Tag.Root colorPalette="purple" size={"lg"}>
              <Tag.Label>
                {values.branch} - {values.sem} Sem
              </Tag.Label>
            </Tag.Root>
            <Tag.Root colorPalette="purple" size={"lg"}>
              <Tag.Label>{values.category}</Tag.Label>
            </Tag.Root>
          </HStack>
          <SimpleGrid columns={2} gap={"3"}>
            <Field.Root>
              <Field.Label>Challan ID</Field.Label>
              <Input
                value={challanId}
                onChange={(e) => setChallanId(e.target.value)}
                type="text"
              />
            </Field.Root>
            <Field.Root>
              <Field.Label>Amount</Field.Label>
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
              />
            </Field.Root>
            <Field.Root>
              <Field.Label>Payment Method</Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                >
                  <option value={""}>Select</option>
                  <option value={"UPI_SCAN"}>UPI SCAN</option>
                  <option value={"MANUAL_RECIEPT"}>MANUAL RECIEPT</option>
                  <option value={"EASYPAY_PAYMENT"}>EASYPAY PAYMENT</option>
                  <option value={"OTHERS"}>OTHERS</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Field.Root>
            <Field.Root>
              <Field.Label>Transaction ID</Field.Label>
              <Input
                value={tid}
                onChange={(e) => setTid(e.target.value)}
                type="text"
              />
            </Field.Root>
            <Field.Root>
              <Field.Label>Payment Date</Field.Label>
              <Input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                type="date"
              />
            </Field.Root>
          </SimpleGrid>
        </VStack>
      </IModal>

      <IDrawer
        size={"sm"}
        loading={isSubmitting}
        disabled={!!Object.keys(errors).length}
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
        open={open}
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
            <Spinner colorPalette="facebook" color="blue" size={"lg"} />
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
              <Field.Root
                invalid={!!errors.usn?.length && touched.usn}
                px={"5"}
              >
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

              <Field.Root
                invalid={!!errors.sem?.length && touched.sem}
                px={"5"}
              >
                <Field.Label flex={1}>
                  <Text>Sem</Text>
                </Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    name="sem"
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
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
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
                  <NativeSelect.Field
                    name="branch"
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
                  <NativeSelect.Field
                    name="category"
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
                  </NativeSelect.Field>
                </NativeSelect.Root>
                <Field.ErrorText>{errors.category}</Field.ErrorText>
              </Field.Root>

              <Field.Root
                invalid={!!errors.total?.length && touched.total}
                px={"5"}
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

              <Field.Root px={"5"}>
                <Field.Label flex={1}>
                  <Text>Paid Amount</Text>
                </Field.Label>
                <Input
                  name="paid"
                  value={values.paid}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Field.ErrorText>{errors.total}</Field.ErrorText>
              </Field.Root>

              <Field.Root px={"5"}>
                <Field.Label flex={1}>
                  <Text>Balance Amount</Text>
                </Field.Label>
                <Input
                  name="remaining"
                  value={values.remaining}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Field.Root>

              <Field.Root readOnly px={"5"}>
                <Field.Label flex={1}>
                  <Text>Status</Text>
                </Field.Label>
                <Input
                  readOnly
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Field.Root>
            </>
            <VStack
              position={"sticky"}
              backdropFilter={"blur(5px)"}
              bottom={"0"}
              w={"full"}
              p={"5"}
            >
              {values.id && (
                <>
                  {values.remaining < 0 && (
                    <Alert.Root status="warning">
                      <Alert.Indicator />
                      <Box>
                        <Alert.Title fontSize={"small"}>Warning !</Alert.Title>
                        <Alert.Description fontSize={"smaller"}>
                          Remaining Amount is less than zero. You still may
                          continue to save the changes.
                        </Alert.Description>
                      </Box>
                    </Alert.Root>
                  )}
                  <Button
                    disabled={!isValid}
                    onClick={onPaymentOpen}
                    w={"full"}
                    colorPalette={"purple"}
                    variant={"surface"}
                  >
                    Update Payment
                  </Button>
                  <Button
                    loading={isDeleting}
                    onClick={() => deleteStudent()}
                    w={"full"}
                    colorPalette="red"
                  >
                    <AiOutlineUserDelete />
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
