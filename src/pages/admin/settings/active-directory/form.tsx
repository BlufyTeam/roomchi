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
import {
  incomeMailConfigSchema,
  nodemailerConfigSchema,
} from "~/server/validations/mail.validation";
import { Switch } from "~/components/shadcn/switch";
import { useLanguage } from "~/context/language.context";
import { translations } from "~/utils/translations";
import { activeDirectoryConfigSchema } from "~/server/validations/active-directory";

const TextFieldWithLabel = withLabel(TextField);
const IntegerFieldWithLabel = withLabel(IntegerField);

export default function ActiveDirectoryForm() {
  const { toast } = useToast();
  const utils = api.useContext();
  const { t } = useLanguage();

  const getConfig = api.activeDirectory.getAdminConfig.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const updateConfig = api.activeDirectory.setAdminConfig.useMutation({
    onSuccess: () => {
      utils.activeDirectory.getAdminConfig.invalidate();
      toast({
        title: t.Success,
        description: t.activeDirectoryConfiguredSuccessfully,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      domainName: "",
      domainController: "",
      loginName: "",
      password: "",
    },
    validationSchema: toFormikValidationSchema(activeDirectoryConfigSchema),
    validateOnBlur: true,
    validateOnMount: true,
    onSubmit: (values) => {
      updateConfig.mutate(values);
    },
  });

  useEffect(() => {
    if (getConfig.data) {
      formik.setValues(getConfig.data);
    }
  }, [getConfig.data]);

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="relative flex   flex-col items-center justify-center gap-8 rounded-lg bg-secondary p-5"
    >
      <div className="w-full">
        <TextFieldWithLabel
          label="Domain Name"
          name="domainName"
          id="domainName"
          {...formik.getFieldProps("domainName")}
        />
        <InputError message={formik.errors.domainName} />
      </div>
      <div className="w-full">
        <TextFieldWithLabel
          label="Domain Controller"
          name="domainController"
          id="domainController"
          value={formik.values.domainController.toString()}
          onValueChange={(value) => {
            formik.setFieldValue("domainController", value);
          }}
        />
        <InputError message={formik.errors.domainController} />
      </div>

      <div className="w-full">
        <TextFieldWithLabel
          label="Login Name"
          name="loginName"
          id="loginName"
          value={formik.values.loginName.toString()}
          onValueChange={(value) => {
            formik.setFieldValue("loginName", value);
          }}
        />
        <InputError message={formik.errors.loginName} />
      </div>
      <div className="w-full">
        <TextFieldWithLabel
          label="Password"
          name="password"
          id="password"
          type="password"
          value={formik.values.password.toString()}
          onValueChange={(value) => {
            formik.setFieldValue("password", value);
          }}
        />
        <InputError message={formik.errors.password} />
      </div>

      <Button
        disabled={updateConfig.isLoading || !formik.isValid}
        isLoading={updateConfig.isLoading}
        type="submit"
        className="w-full rounded-xl bg-primbuttn text-secondary"
      >
        {t.save}
      </Button>
    </form>
  );
}
