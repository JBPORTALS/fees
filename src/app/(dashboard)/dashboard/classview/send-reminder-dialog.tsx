import { CloseButton } from "@/components/ui/close-button";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/Field";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Combobox,
  createListCollection,
  Flex,
  HStack,
  Input,
  Portal,
  RadioCard,
  Switch,
  Textarea,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { LuMessageCircle } from "react-icons/lu";
import { z } from "zod";

const sendReminderSchema = z.object({
  dueDate: z.string().min(1, "Required"),
  all: z.boolean(),
  students: z.array(z.string()).optional(),
});

const students = ["Mano", "Nano", "Pino"];

export function SendReminderDialog() {
  const form = useForm<z.infer<typeof sendReminderSchema>>({
    resolver: zodResolver(sendReminderSchema),
    defaultValues: {
      dueDate: "",
      all: true,
      students: [],
    },
  });

  const contentRef = useRef<HTMLDivElement>(null);

  const [searchValue, setSearchValue] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const filteredItems = useMemo(
    () =>
      students.filter((item) =>
        item.toLowerCase().includes(searchValue.toLowerCase())
      ),
    [searchValue]
  );

  const collection = useMemo(
    () => createListCollection({ items: filteredItems }),
    [filteredItems]
  );

  const handleValueChange = (details: Combobox.ValueChangeDetails) => {
    setSelectedStudents(details.value);
  };

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button
          variant={"surface"}
          size={"sm"}
          colorPalette={"cyan"}
          ml={"auto"}
        >
          <LuMessageCircle /> Send Fee Reminder
        </Button>
      </DialogTrigger>
      <DialogContent ref={contentRef}>
        <Form {...form}>
          <form>
            <DialogHeader>
              <VStack align={"start"} w={"full"}>
                <HStack
                  alignItems={"center"}
                  w={"full"}
                  justifyContent={"space-between"}
                >
                  <DialogTitle w={"full"}>Send Fee Reminder</DialogTitle>
                  <FormField
                    control={form.control}
                    name="all"
                    render={({ field }) => (
                      <FormItem flexDir={"row-reverse"}>
                        <Switch.Root
                          id="all"
                          name={field.name}
                          checked={field.value}
                          onCheckedChange={({ checked }) =>
                            field.onChange(checked)
                          }
                        >
                          <Switch.HiddenInput
                            name={field.name}
                            onBlur={field.onBlur}
                          />
                          <Switch.Control />
                        </Switch.Root>
                        <FormLabel>All </FormLabel>
                        <FormDescription />
                      </FormItem>
                    )}
                  />
                </HStack>
                <DialogDescription>
                  {form.getValues().all
                    ? `Send reminder to all students who holds remaining fee to
                  pay`
                    : `Send reminder to specific students who holds remaining fee to pay. Start mentioning the students in mentions text field`}
                </DialogDescription>
              </VStack>
            </DialogHeader>
            <DialogBody spaceY={"2"}>
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <Input type="date" {...field} />
                    <FormDescription />
                  </FormItem>
                )}
              />

              {!form.getValues().all && (
                <FormField
                  control={form.control}
                  name="students"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mentions</FormLabel>
                      <Combobox.Root
                        multiple
                        closeOnSelect
                        width="full"
                        value={selectedStudents}
                        collection={collection}
                        onValueChange={handleValueChange}
                        onInputValueChange={(details) =>
                          setSearchValue(details.inputValue)
                        }
                      >
                        <Combobox.Control>
                          <Flex
                            wrap="wrap"
                            align="center"
                            px="2"
                            py="1"
                            minH="10"
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="md"
                            _focusWithin={{
                              borderColor: "blue.500",
                              boxShadow: "0 0 0 1px #3182ce",
                            }}
                          >
                            {selectedStudents.map((student) => (
                              <Badge
                                key={student}
                                colorScheme="blue"
                                mr="1"
                                mb="1"
                              >
                                {student}
                              </Badge>
                            ))}
                            <Box flex="1" minW="100px">
                              <Combobox.Input
                                border="none"
                                outline="none"
                                _focus={{ boxShadow: "none" }}
                                px="0"
                                py="0"
                              />
                            </Box>
                            <Combobox.IndicatorGroup>
                              <Combobox.Trigger />
                            </Combobox.IndicatorGroup>
                          </Flex>
                        </Combobox.Control>

                        <Portal container={contentRef}>
                          <Combobox.Positioner>
                            <Combobox.Content>
                              <Combobox.ItemGroup>
                                <Combobox.ItemGroupLabel>
                                  Mentions
                                </Combobox.ItemGroupLabel>
                                {filteredItems.map((item) => (
                                  <Combobox.Item key={item} item={item}>
                                    {item}
                                    <Combobox.ItemIndicator />
                                  </Combobox.Item>
                                ))}
                                <Combobox.Empty>
                                  No students found
                                </Combobox.Empty>
                              </Combobox.ItemGroup>
                            </Combobox.Content>
                          </Combobox.Positioner>
                        </Portal>
                      </Combobox.Root>
                      <FormDescription>
                        Start typing student's name or usn to find the student
                        and select to tag them in reminder list.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              )}
            </DialogBody>
            <DialogFooter>
              <Button variant={"outline"}>Cancel</Button>
              <Button>Send</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </DialogRoot>
  );
}
