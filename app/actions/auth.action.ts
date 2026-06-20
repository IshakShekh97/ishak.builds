"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import type { SignInSchemaType } from "@/lib/zod.schema";

export const SignIn = async (data: SignInSchemaType) => {
  try {
    await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
    });

    revalidatePath("/dashboard");

    return {
      response: true,
      message: "Authentication Successful",
    };
  } catch (error: unknown) {
    console.log(error);
    const msg =
      error instanceof Error ? error.message : "Authentication Failed";
    return {
      response: false,
      message: msg,
    };
  }
};
