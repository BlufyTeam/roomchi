import { getServerSession } from "next-auth";
import React, { useState } from "react";
import { authOptions } from "~/server/auth";
import TextField from "~/ui/forms/text-field";

import withLabel from "~/ui/forms/with-label";
import Button from "~/ui/buttons";
import PasswordField from "~/ui/forms/password-field";

import InputError from "~/ui/forms/input-error";

import { toFormikValidationSchema } from "zod-formik-adapter";
import { userLoginSchema } from "~/server/validations/user.validation";
import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import { useLanguage } from "~/context/language.context";
import { translations } from "~/utils/translations";

const TextFieldWithLable = withLabel(TextField);
export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-secondary ">
      <div
        className="pointer-events-none absolute inset-x-0 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-orange-400 to-accent opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <LoginForm />
    </div>
  );
}

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },

    validationSchema: toFormikValidationSchema(userLoginSchema),
    validateOnBlur: true,
    onSubmit: async (values: typeof userLoginSchema._type) => {
      setIsLoading(true);

      const result = await signIn("credentials", {
        username: formik.values.username,
        password: formik.values.password,
        callbackUrl: `${window.location.origin}/`,
        redirect: true,
      });
      setIsLoading(false);
    },
  });

  return (
    <>
      <form
        className="flex flex-col items-center justify-center gap-5 rounded-3xl bg-accent/5 p-5 backdrop-blur-xl"
        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-primary">{t.enter}</h1>
        <div className="w-full ">
          <TextFieldWithLable
            label={t.username}
            name="username"
            id="username"
            {...formik.getFieldProps("username")}
          />
          <InputError message={formik.errors.username} />
        </div>
        <div className="relative w-full">
          <PasswordField
            label={t.password}
            name="password"
            id="password"
            type="password"
            {...formik.getFieldProps("password")}
          />

          <InputError message={formik.errors.password} />
        </div>

        <Button
          disabled={isLoading}
          isLoading={isLoading}
          type="submit"
          className="w-full rounded-xl bg-primbuttn text-secondary"
        >
          {t.enter}
        </Button>
      </form>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  console.log({ session });
  if (session && session.user) {
    const role = session.user.role.toLocaleLowerCase();
    return {
      redirect: {
        destination: `/${role === "SUPER_ADMIN" ? "ADMIN" : role}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
