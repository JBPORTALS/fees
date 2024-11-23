import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { procedure, router } from "../trpc";
import { YearFee } from "@/store/fees.slice";
import { SessionData } from "@/utils/session";

export const appRouter = router({
  hello: procedure.query(async ({ input }) => {
    return {
      greetings: "helo world",
    };
  }),
  feeYearView: procedure
    .input(
      z.object({
        acadYear: z.string(),
        branch: z.string(),
        college: z.string(),
      })
    )
    .query(async ({ input }) => {
      const formData = new FormData();
      formData.append("acadYear", input.acadYear);
      formData.append("branch", input.branch);
      formData.append("college", input.college);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMIN_URL + "feeyearview.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data as YearFee[];
    }),
  searchData: procedure
    .input(
      z.object({
        acadYear: z.string(),
        query: z.string(),
        college: z.string(),
      })
    )
    .query(async ({ input }) => {
      const formData = new FormData();
      formData.append("acadYear", input.acadYear);
      formData.append("searchdata", input.query);
      formData.append("college", input.college);

      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMIN_URL + "feesearchsutdent.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      //   console.log(data);
      return data as [];
    }),
  getChallanDetails: procedure
    .input(
      z.object({
        challan_id: z.string(),
        college: z.string(),
        acadYear: z.string(),
      })
    )
    .query(async ({ input }) => {
      const formData = new FormData();
      formData.append("challan_id", input.challan_id);
      formData.append("college", input?.college!);
      formData.append("acadyear", input.acadYear);

      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMIN_URL + "feechallanfilter.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      //   console.log(data);
      return data as any;
    }),
  searchDataByMode: procedure
    .input(
      z.object({
        acadYear: z.string(),
        branch: z.string(),
        college: z.string(),
        year: z.string(),
        mode: z.string(),
        fromDate: z.string(),
        toDate: z.string(),
        feeType: z.string(),
      })
    )
    .query(async ({ input }) => {
      const formData = new FormData();
      formData.append("acadYear", input.acadYear);
      formData.append("branch", input.branch);
      formData.append("year", input.year);
      formData.append("mode", input.mode);
      formData.append("fromdate", input.fromDate);
      formData.append("todate", input.toDate);
      formData.append("type", input.feeType);
      formData.append("college", input.college);

      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMIN_URL + "feefilter.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      //   console.log(data);
      return data as [];
    }),
  signIn: procedure
    .input(
      z.object({
        email: z.string().min(1, "Email required"),
        password: z.string().min(1, "Password required"),
      })
    )
    .mutation(async ({ input }) => {
      const formData = new FormData();
      formData.append("email", input.email);
      formData.append("password", input.password);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMIN_URL + "usersignin.php",
        {
          method: "POST",
          body: formData,
        }
      );

      console.log(
        "API URL",
        process.env.NEXT_PUBLIC_ADMIN_URL,
        response.status
      );

      if (!response.ok)
        throw new TRPCError({
          message: "Invalid credentials",
          code: "BAD_REQUEST",
        });

      const user = (await response.json()) as SessionData;
      // console.log(user, "user");
      return user;
    }),
  getUser: procedure
    .input(z.string().min(1, "ID required"))
    .query(async ({ input }) => {
      try {
        // Prepare form data
        const formData = new FormData();
        formData.append("id", input);

        // Fetch user details
        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_ADMIN_URL}usergetdetails.php`,
          {
            method: "POST", // Changed to POST as you're sending form data
            body: formData,
          }
        );

        if (!userResponse.ok) {
          throw new Error(
            `User details fetch failed: ${userResponse.statusText}`
          );
        }

        const userData = await userResponse.json();

        if (!userData) {
          throw new Error("Invalid user data");
        }

        return userData as SessionData;
      } catch (error) {
        console.error("Error in getUser procedure:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch user data",
        });
      }
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
