import { useFormik } from "formik";
import React, { useEffect } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { api } from "~/utils/api";
import TextField from "~/ui/forms/text-field";
import IntegerField from "~/ui/forms/integer-field";
import withLabel from "~/ui/forms/with-label";
import InputError from "~/ui/forms/input-error";
import Button from "~/ui/buttons";
import { useToast } from "~/components/ui/toast/use-toast";
import { nodemailerConfigSchema } from "~/server/validations/mail.validation";
import { Switch } from "~/components/shadcn/switch";
import { useLanguage } from "~/context/language.context";
import { translations } from "~/utils/translations";
import { activeDirectoryConfigSchema } from "~/server/validations/active-directory";
import { z } from "zod";
import { EnglishAndNumberField } from "~/ui/forms/english-field";

const EnglishFieldFieldWithLabel = withLabel(EnglishAndNumberField);

type ActiveDirectoryConfigType = z.infer<typeof activeDirectoryConfigSchema>;
export default function ActiveDirectoryForm() {
  const { toast } = useToast();
  const utils = api.useContext();
  const { language } = useLanguage();
  const t = translations[language];

  const getUsersMutate = api.activeDirectory.getUsers.useMutation();
  const formik = useFormik<ActiveDirectoryConfigType>({
    initialValues: {
      domainName: "",
      domainController: "",
      loginName: "",
      password: "",
    },
    validationSchema: toFormikValidationSchema(activeDirectoryConfigSchema),
    validateOnBlur: true,
    validateOnMount: true,
    onSubmit: (values) => {},
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="relative flex   flex-col items-center justify-center gap-8 rounded-lg bg-secondary p-5"
    >
      <div className="w-full">
        <EnglishFieldFieldWithLabel
          label="Domain Name"
          name="domainName"
          id="domainName"
          value={formik.values.domainName}
          onValueChange={(value) => {
            formik.setFieldValue("domainName", value);
          }}
        />
        <InputError message={formik.errors.domainName} />
      </div>
      <div className="w-full">
        <EnglishFieldFieldWithLabel
          label="Domain Controller"
          name="domainController"
          id="domainController"
          value={formik.values.domainController}
          onValueChange={(value) => {
            formik.setFieldValue("domainController", value);
          }}
        />
        <InputError message={formik.errors.domainController} />
      </div>

      <div className="w-full">
        <EnglishFieldFieldWithLabel
          label="Login Name"
          name="loginName"
          id="loginName"
          value={formik.values.loginName}
          onValueChange={(value) => {
            formik.setFieldValue("loginName", value);
          }}
        />
        <InputError message={formik.errors.loginName} />
      </div>
      <div className="w-full">
        <EnglishFieldFieldWithLabel
          label="Password"
          name="password"
          id="password"
          value={formik.values.password}
          onValueChange={(value) => {
            formik.setFieldValue("password", value);
          }}
        />
        <InputError message={formik.errors.password} />
      </div>

      <Button
        isLoading={getUsersMutate.isLoading}
        type="submit"
        onClick={() => {
          console.log("hi");
          getUsersMutate.mutate({
            domainName: "",
            domainController: "",
            loginName: "",
            password: "",
          });
        }}
        className="w-full rounded-xl bg-primbuttn text-secondary"
      >
        {t.save}
      </Button>
    </form>
  );
}
