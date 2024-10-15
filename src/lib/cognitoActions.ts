import { redirect } from "next/navigation";
import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  resendSignUpCode,
  autoSignIn,
} from "aws-amplify/auth"
import { getErrorMessage } from "@/utils/get-error-message";

export async function handleSignUp(
  prevstate: string | undefined,
  formData: FormData
){
  try {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username: String(formData.get("username")),
      password: String(formData.get ("password" )),
      options: {
        userAttributes: {
          email: String(formData.get("email")),
          name: String(formData.get ("name")),
        },

        autoSignIn: true,
      },
    });
  } catch (error) {
    return getErrorMessage(error);
  }
  redirect("/auth/confirm-signup");
}

export async function handleSendEmailVerificationCode(
  prevstate: { message: string; errorMessage: string },
  formData: FormData
) {
  let currentState;
  try {
    await resendSignUpCode({
      username:String(formData.get("email")),
    });
    currentState = {
      ...prevstate,
      message: "Code sent successfully",
    };
  } catch (error) {
    currentState ={
      ...prevstate,
      errorMessage: getErrorMessage(error),
    };
  }

  return currentState;
}

export async function handleconfirmSignUp(
  prevstate: string | undefined,
  formData: FormData
) {
  try {
    const { isSignUpComplete, nextStep } = await confirmSignUp({
      username: String(formData.get("email")),
      confirmationCode: String(formData.get ("code" )),
    });
  } catch (error) {
    return getErrorMessage(error);
  }
  redirect("/auth/login");
}

export async function handleSignIn(
  prevstate: string | undefined,
  formData: FormData
) {
  let redirectLink = "/dashboard";
  try {
    const { isSignedIn, nextStep } = await signIn({
      username: String(formData.get("email")),
      password: String(formData.get ("password" )),
    });
    if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
      await resendSignUpCode({
        username: String(formData.get("email")),
      });
      redirectLink = "/auth/confirm-signup";
    }
  } catch (error) {
    return getErrorMessage(error);
  }

  redirect(redirectLink);
}

export async function handleSignOut() {
  try {
    await signOut();
  } catch(error) {
    console.log(getErrorMessage(error));
  }
  redirect("/auth/login");
}

