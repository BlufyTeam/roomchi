import { Company } from "@prisma/client";
import { useFormik } from "formik";
import React from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import UploadImageBase64 from "~/features/uplaod-image-base64";
import { updateCompanySchema } from "~/server/validations/company.validation";
import { User } from "~/types";
import { api } from "~/utils/api";
import TextField from "~/ui/forms/text-field";

import withLabel from "~/ui/forms/with-label";
import InputError from "~/ui/forms/input-error";
import Button from "~/ui/buttons";
import { useToast } from "~/components/ui/toast/use-toast";
import { reloadSession } from "~/utils/util";
const TextFieldWithLable = withLabel(TextField);

export default function CompanyForm({ company }: { company: Company }) {
  const { toast } = useToast();
  const utils = api.useContext();
  const updateCompany = api.company.updateCompany.useMutation({
    onSuccess: () => {
      toast({
        title: "ویرایش شرکت",
        description: "ویرایش شد",
      });
      reloadSession();
    },
  });
  const formik = useFormik({
    initialValues: {
      id: company.id,
      name: company.name,
      //@ts-ignore
      logo_base64: company.logo_base64,
      description: company.description,
    },
    validationSchema: toFormikValidationSchema(updateCompanySchema),
    validateOnBlur: true,
    onSubmit: (values: typeof updateCompanySchema._type) => {
      updateCompany.mutate({
        id: values.id,
        name: values.name,
        description: values.description,
        logo_base64: values.logo_base64,
      });

      //   const changes = [];
      //   Object.entries(formik.initialValues).map(([key, value]) => {
      //     if (value !== formik.values[key])
      //       changes.push(`${key} به ${formik.values[key]} تغییر پیدا کرد`);
      //   });
      //  changes.length <= 0 ? "مقداری تغییر نکرد" : changes.join("\n"),
    },
  });
  return (
    <form
      onSubmit={formik.handleSubmit}
      className="relative flex flex-col items-center justify-center gap-8"
    >
      <h1 className="w-full pb-2 text-accent">ویرایش شرکت</h1>

      <div className="w-full ">
        <TextFieldWithLable
          label={"نام"}
          name="name"
          id="name"
          {...formik.getFieldProps("name")}
        />
        <InputError message={formik.errors.name} />
      </div>
      <div className="w-full ">
        <TextFieldWithLable
          label={"توضیحات"}
          name="description"
          id="description"
          {...formik.getFieldProps("description")}
        />
        <InputError message={formik.errors.description} />
      </div>
      <h3>لوگو شرکت</h3>
      <UploadImageBase64
        images={
          formik.values.logo_base64?.length > 0
            ? [formik.values.logo_base64]
            : []
        }
        onChange={(base64: string) => {
          console.log({ base64 });
          formik.setValues((values) => {
            return {
              ...values,
              logo_base64: base64,
            };
          });
        }}
        onError={(error) => {
          toast({
            title: "خطای حجم عکس",
            description: "حجم عکس نمی تواند بیشتر از 64 کیلوبایت باشد",
          });
        }}
      />
      <InputError message={formik.errors.logo_base64} />
      <Button
        disabled={updateCompany.isLoading || !formik.isValid}
        isLoading={updateCompany.isLoading || updateCompany.isLoading}
        type="submit"
        className="w-full rounded-xl bg-primbuttn text-secondary"
      >
        ویرایش
      </Button>
    </form>
  );
}
