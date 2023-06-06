import { Company } from "@prisma/client";
import { useFormik } from "formik";
import React from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import UploadImageBase64 from "~/features/uplaod-image-base64";
import { updateCompanySchema } from "~/server/validations/company.validation";
import { User } from "~/types";
import { api } from "~/utils/api";
import TextField from "~/ui/forms/text-field";
import IntegerField from "~/ui/forms/integer-field";

import withLabel from "~/ui/forms/with-label";
import InputError from "~/ui/forms/input-error";
import Button from "~/ui/buttons";
import { useToast } from "~/components/ui/toast/use-toast";
import { reloadSession } from "~/utils/util";
import { createRoomSchema } from "~/server/validations/room.validation";
import { ComboBox } from "~/features/shadui/ComboBox";
const TextFieldWithLable = withLabel(TextField);
const IntegerFieldWithLable = withLabel(IntegerField);

export default function RoomForm() {
  const { toast } = useToast();

  const getCompany = api.company.getAll.useQuery();
  const utils = api.useContext();
  const createRoom = api.room.createRoom.useMutation();
  const formik = useFormik({
    initialValues: {
      title: "",
      capacity: 0,
      companyId: undefined,
      description: "",

      price: 0,
    },
    validationSchema: toFormikValidationSchema(createRoomSchema),
    validateOnBlur: true,
    onSubmit: (values: typeof createRoomSchema._type) => {
      createRoom.mutate({
        capacity: values.capacity,
        companyId: values.companyId,
        description: values.description,
        price: values.price,
        title: values.title,
        image: values.image,
      });
    },
  });
  return (
    <form
      onSubmit={formik.handleSubmit}
      className="relative flex flex-col items-center justify-center gap-8"
    >
      <h1 className="w-full pb-2 text-accent">ساخت اتاق</h1>

      <div className="w-full ">
        <TextFieldWithLable
          label={"عنوان"}
          name="title"
          id="title"
          {...formik.getFieldProps("title")}
        />
        <InputError message={formik.errors.title} />
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
      <div className="w-full ">
        <IntegerFieldWithLable
          label={"ظرفیت"}
          isRtl
          name="capacity"
          id="capacity"
          value={formik.values.capacity.toString()}
          onValueChange={(value) => {
            formik.setValues((values) => {
              return {
                ...values,
                capacity: value,
              };
            });
          }}
        />
        <InputError message={formik.errors.capacity} />
      </div>
      <div className="w-full ">
        <IntegerFieldWithLable
          label="قیمت ( تومان )"
          name="price"
          id="price"
          isRtl
          value={formik.values.price.toString()}
          onValueChange={(value) => {
            formik.setValues((values) => {
              return {
                ...values,
                price: value,
              };
            });
          }}
        />
        <InputError message={formik.errors.price} />
      </div>

      <div className="z-30  flex w-full flex-col items-start justify-start gap-5">
        {getCompany.data && (
          <ComboBox
            values={getCompany.data.map((company) => {
              return { label: company.name, value: company.id };
            })}
            value={formik.values.companyId}
            onChange={(value) => {
              formik.setValues(() => {
                return {
                  ...formik.values,
                  companyId: value,
                };
              });
            }}
            placeHolder="جستجو شرکت ها"
          />
        )}
      </div>
      {JSON.stringify(formik.errors)}
      <Button
        disabled={createRoom.isLoading || !formik.isValid}
        isLoading={createRoom.isLoading || createRoom.isLoading}
        type="submit"
        className="w-full rounded-xl bg-primbuttn text-secondary"
      >
        ثبت
      </Button>
    </form>
  );
}
