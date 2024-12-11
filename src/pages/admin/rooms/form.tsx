import { Company } from "@prisma/client";
import { useFormik } from "formik";
import React, { useEffect } from "react";
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
import { useRoom } from "~/context/room.context";
import withConfirmation from "~/ui/with-confirmation";
import { useLanguage } from "~/context/language.context";
import { translations } from "~/utils/translations";

const TextFieldWithLable = withLabel(TextField);
const IntegerFieldWithLable = withLabel(IntegerField);

const ButtonWithConfirmation = withConfirmation(Button);
export default function RoomForm() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language];
  const getCompany = api.company.getAll.useQuery();
  const { selectedRowRoom, setSelectedRowRoom } = useRoom();
  const utils = api.useContext();
  const createRoom = api.room.createRoom.useMutation({
    onSuccess: () => {
      utils.room.getRoomsByCompanyId.invalidate();
    },
  });
  const updateRoom = api.room.updateRoom.useMutation({
    onSuccess: () => {
      utils.room.getRoomsByCompanyId.invalidate();
    },
  });
  const deleteRoom = api.room.deleteRoom.useMutation({
    onSuccess: () => {
      utils.room.getRoomsByCompanyId.invalidate();
    },
  });

  useEffect(() => {
    formik.setValues(() => {
      return {
        title: selectedRowRoom?.title ?? "",
        capacity: selectedRowRoom?.capacity ?? 0,
        companyId: selectedRowRoom?.companyId ?? undefined,
        description: selectedRowRoom?.description ?? "",
        price: selectedRowRoom?.price ?? 0,
      };
    });
  }, [selectedRowRoom]);
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
      if (!selectedRowRoom)
        return createRoom.mutate({
          capacity: values.capacity,
          companyId: values.companyId,
          description: values.description,
          price: values.price,
          title: values.title,
          image: values.image,
        });

      return updateRoom.mutate({
        id: selectedRowRoom.id,
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
      {selectedRowRoom && (
        <Button
          onClick={() => {
            setSelectedRowRoom(undefined);
          }}
          className="absolute -top-10  border border-accent/10 bg-secondary text-primbuttn hover:bg-accent hover:text-secbuttn"
        >
          {t.createNewRoom} +
        </Button>
      )}

      <div className="w-full ">
        <TextFieldWithLable
          label={t.title}
          name="title"
          id="title"
          {...formik.getFieldProps("title")}
        />
        <InputError message={formik.errors.title} />
      </div>
      <div className="w-full ">
        <TextFieldWithLable
          label={t.description}
          name="description"
          id="description"
          {...formik.getFieldProps("description")}
        />
        <InputError message={formik.errors.description} />
      </div>
      <div className="w-full ">
        <IntegerFieldWithLable
          label={t.capacity}
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
          label={t.price + " (" + t.toman + ")"}
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
            placeHolder={t.searchCompanies}
          />
        )}
      </div>
      <Button
        disabled={createRoom.isLoading || !formik.isValid}
        isLoading={createRoom.isLoading || updateRoom.isLoading}
        type="submit"
        className="w-full rounded-xl bg-primbuttn text-secondary"
      >
        {selectedRowRoom ? t.edit : t.done}
      </Button>
      {selectedRowRoom && (
        <ButtonWithConfirmation
          title={t.delete + " " + t.room}
          disabled={deleteRoom.isLoading}
          isLoading={deleteRoom.isLoading}
          type="button"
          onClick={() => {
            deleteRoom.mutate({ id: selectedRowRoom.id });
          }}
          className="w-full rounded-xl bg-amber-500 text-black"
        >
          حذف
        </ButtonWithConfirmation>
      )}
    </form>
  );
}
