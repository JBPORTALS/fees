import WithoutUSNLayout from "@/components/layouts/WithoutUSNLayout";

export default async function GenerateRecieptRootLayout(props: {
  children: React.ReactNode;
}) {
  return <WithoutUSNLayout>{props?.children}</WithoutUSNLayout>;
}
