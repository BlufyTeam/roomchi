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

const TextFieldWithLabel = withLabel(TextField);
const IntegerFieldWithLabel = withLabel(IntegerField);

export default function AdminNodemailerForm() {
  const { toast } = useToast();
  const utils = api.useContext();
  const { language } = useLanguage();
  const t = translations[language];

  const getConfig = api.mail.getAdminConfig.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const updateConfig = api.mail.setAdminConfig.useMutation({
    onSuccess: () => {
      utils.mail.getAdminConfig.invalidate();
      toast({
        title: t.Success,
        description: t.NodemailerConfiguredSuccessfully,
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
      smtpHost: "",
      smtpPort: 587,
      smtpSecure: false,
      smtpUser: "",
      smtpPass: "",
      emailFrom: "",
      sender_name: "",
    },
    validationSchema: toFormikValidationSchema(nodemailerConfigSchema),
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
          label="SMTP Host"
          name="smtpHost"
          id="smtpHost"
          {...formik.getFieldProps("smtpHost")}
        />
        <InputError message={formik.errors.smtpHost} />
      </div>
      <div className="w-full">
        <IntegerFieldWithLabel
          label="SMTP Port"
          name="smtpPort"
          id="smtpPort"
          value={formik.values.smtpPort.toString()}
          onValueChange={(value) => {
            formik.setFieldValue("smtpPort", value);
          }}
        />
        <InputError message={formik.errors.smtpPort} />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="smtpSecure" className="text-sm font-medium">
          Use Secure Connection (SSL/TLS)
        </label>
        <Switch
          id="smtpSecure"
          checked={formik.values.smtpSecure}
          onClick={() => {
            formik.setFieldValue("smtpSecure", !formik.values.smtpSecure);
          }}
        />
      </div>
      <div className="w-full">
        <TextFieldWithLabel
          label="SMTP Username"
          name="smtpUser"
          id="smtpUser"
          {...formik.getFieldProps("smtpUser")}
        />
        <InputError message={formik.errors.smtpUser} />
      </div>
      <div className="w-full">
        <TextFieldWithLabel
          label="SMTP Password"
          name="smtpPass"
          id="smtpPass"
          type="password"
          {...formik.getFieldProps("smtpPass")}
        />
        <InputError message={formik.errors.smtpPass} />
      </div>
      <div className="w-full">
        <TextFieldWithLabel
          label="From Email Address"
          name="emailFrom"
          id="emailFrom"
          type="email"
          {...formik.getFieldProps("emailFrom")}
        />
        <InputError message={formik.errors.emailFrom} />
      </div>
      <div className="w-full">
        <TextFieldWithLabel
          label="Sender Name"
          name="sender_name"
          id="sender_name"
          {...formik.getFieldProps("sender_name")}
        />
        <InputError message={formik.errors.sender_name} />
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
