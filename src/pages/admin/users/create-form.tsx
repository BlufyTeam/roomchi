import { useFormik } from "formik";
import React, { useEffect, useState } from "react";

import { toFormikValidationSchema } from "zod-formik-adapter";
import { createUserSchema } from "~/server/validations/user.validation";

import TextField from "~/ui/forms/text-field";
import TextAreaField from "~/ui/forms/textarea-field";
import withLabel from "~/ui/forms/with-label";
import Button from "~/ui/buttons";
import PasswordField from "~/ui/forms/password-field";
import MultiBox from "~/ui/multi-box";
import { api } from "~/utils/api";
import InputError from "~/ui/forms/input-error";

const TextFieldWithLable = withLabel(TextField);
// const TextAreaWithLable = withLabel(TextAreaField);

const ROLES = [
  {
    id: 0,
    value: {
      key: "USER",
      name: "کاربر",
    },
  },
  {
    id: 1,
    value: {
      key: "ADMIN",
      name: "ادمین",
    },
  },
];

export function CreateUserForm() {
  const createUser = api.user.createUser.useMutation();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "ali@gmail.com",
      username: "",
      password: "",
      description: "",
      role: "USER",
    },
    validationSchema: toFormikValidationSchema(createUserSchema),
    validateOnBlur: true,
    onSubmit: (values: typeof createUserSchema._type) => {
      createUser.mutate({
        name: values.name,
        username: values.username,
        password: values.password,
        email: values.email,
        description: values.description,
        role: values.role ?? "USER",
      });
    },
  });

  return (
    <>
      <form
        onSubmit={(e) => {
          formik.handleSubmit(e);
        }}
        className="flex flex-col items-center justify-center gap-8"
      >
        <h3 className="w-full pb-2 text-accent">ساخت کاربر</h3>
        <div className="w-full ">
          <TextFieldWithLable
            label={"نام"}
            name="name"
            id="name"
            {...formik.getFieldProps("name")}
          />
          <InputError message={formik.errors.name} />
        </div>
        <div className="flex items-center justify-center gap-10 text-primary">
          <div>
            <TextFieldWithLable
              label={"نام کاربری"}
              name="username"
              id="username"
              {...formik.getFieldProps("username")}
            />
            <InputError message={formik.errors.username} />
          </div>
          <div className="relative">
            <PasswordField
              label={"رمز عبور"}
              name="password"
              id="password"
              type="password"
              {...formik.getFieldProps("password")}
            />

            <InputError message={formik.errors.password} />
          </div>
        </div>

        <div className="w-full">
          <TextFieldWithLable
            label={"ایمیل"}
            name="email"
            id="email"
            {...formik.getFieldProps("email")}
          />
          <InputError message={formik.errors.email} />
        </div>
        <div className="w-full">
          <TextFieldWithLable
            label={"توضیحات"}
            name="description"
            id="description"
            {...formik.getFieldProps("description")}
            maxLength={100}
          />
          <InputError message={formik.errors.description} />
        </div>

        <div className="flex w-full flex-col items-start justify-start gap-5">
          <label className="text-primary">نقش کاربر</label>
          <MultiBox
            min={1}
            onChange={(result) => {
              formik.setValues((values) => {
                return {
                  ...values,
                  role: result[0]?.value.key,
                };
              });
            }}
            className="flex items-center justify-center gap-3"
            list={ROLES}
            initialKeys={[
              ROLES.find((a) => a.value.key === formik.values.role)?.id || 0,
            ]}
            renderItem={(role, isSelected) => {
              return (
                <>
                  <Button
                    className={`${
                      isSelected
                        ? "bg-accent text-primbuttn"
                        : "bg-secbuttn text-primbuttn"
                    }  `}
                  >
                    {role.value.name}
                  </Button>
                </>
              );
            }}
          />
        </div>

        <Button
          disabled={createUser.isLoading || !formik.isValid}
          isLoading={createUser.isLoading}
          type="submit"
          className="w-full rounded-xl bg-primbuttn text-secondary"
        >
          ثبت
        </Button>
      </form>
    </>
  );
}
