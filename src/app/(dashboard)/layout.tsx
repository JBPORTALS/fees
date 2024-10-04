import HeaderLayoutProvider from "./HeaderLayout";

export default async function DashboardRootLayout(props: {
  children: React.ReactNode;
}) {
  return <HeaderLayoutProvider>{props?.children}</HeaderLayoutProvider>;
}
