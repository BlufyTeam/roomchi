import { useFormik } from "formik";
import React from "react";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { api } from "~/utils/api";
import TextField from "~/ui/forms/text-field";
import withLabel from "~/ui/forms/with-label";
import InputError from "~/ui/forms/input-error";
import Button from "~/ui/buttons";
import { useToast } from "~/components/ui/toast/use-toast";
import { useLanguage } from "~/context/language.context";
import { translations } from "~/utils/translations";

const TextFieldWithLabel = withLabel(TextField);

const testEmailSchema = z.object({
  to: z.string().email("Invalid email address"),
});

export default function TestEmailForm() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language];
  const sendTestEmail = api.mail.sendEmail.useMutation({
    onSuccess: () => {
      toast({
        title: t.Success,
        description: t.TestEmailSentSuccessfully,
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
      to: "",
    },
    validationSchema: toFormikValidationSchema(testEmailSchema),
    validateOnBlur: true,
    validateOnMount: true,
    onSubmit: (values) => {
      sendTestEmail.mutate({
        to: values.to,
        subject: "test",
        text: "test mail server roomchi",
      });
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="relative mt-8 flex flex-col items-center justify-center gap-8"
    >
      <div className="w-full">
        <TextFieldWithLabel
          label={t.RecipientEmail}
          name="to"
          id="to"
          type="email"
          {...formik.getFieldProps("to")}
        />
        <InputError message={formik.errors.to} />
      </div>
      <Button
        disabled={sendTestEmail.isLoading || !formik.isValid}
        isLoading={sendTestEmail.isLoading}
        type="submit"
        className="w-full rounded-xl bg-primbuttn text-secondary"
      >
        {t.SendTestEmail}
      </Button>
    </form>
  );
}
