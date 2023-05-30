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
import { ROLES } from "~/server/constants";
import { User } from "~/types";

const TextFieldWithLable = withLabel(TextField);
// const TextAreaWithLable = withLabel(TextAreaField);

export function UserForm({
  user,
  onClearUser = () => {},
}: {
  user?: User | undefined;
  onClearUser?: () => any;
}) {
  const createUser = api.user.createUser.useMutation();
  const updateUser = api.user.updateUser.useMutation();

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      username: user?.username || "",
      password: user?.password || "",
      description: user?.description || "",
      role: user?.role || "USER",
    },

    validationSchema: toFormikValidationSchema(createUserSchema),
    validateOnBlur: true,
    onSubmit: (values: typeof createUserSchema._type) => {
      if (!user)
        return createUser.mutate({
          name: values.name,
          username: values.username,
          password: values.password,
          email: values.email,
          description: values.description,
          role: values.role || "USER",
        });

      return updateUser.mutate({
        id: user.id,
        name: values.name,
        username: values.username,
        password: values.password,
        email: values.email,
        description: values.description,
        role: values.role || "USER",
      });
    },
  });

  useEffect(() => {
    formik.setValues((a) => {
      return {
        name: user?.name || "",
        email: user?.email || "",
        username: user?.username || "",
        password: user?.password || "",
        description: user?.description || "",
        role: user?.role || "USER",
      };
    });
  }, [user]);

  return (
    <>
      <form
        onSubmit={(e) => {
          formik.handleSubmit(e);
        }}
        className="flex flex-col items-center justify-center gap-8"
      >
        {user && (
          <Button
            onClick={onClearUser}
            className="border border-accent/50 bg-secondary text-primbuttn hover:bg-primary hover:text-secbuttn"
          >
            ساخت کاربر جدید +
          </Button>
        )}
        <h3 className="w-full pb-2 text-accent">
          {user ? "ویرایش کاربر" : "ساخت کاربر"}
        </h3>
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
          <select
            name="role"
            id="role"
            className="w-full rounded-full bg-secondary p-2 text-primary "
            {...formik.getFieldProps("role")}
          >
            {ROLES.map((role) => {
              return (
                <>
                  <option
                    selected={role.value.key === formik.values.role}
                    key={role.id}
                    value={role.value.key}
                  >
                    {role.value.name}
                  </option>
                </>
              );
            })}
          </select>
          {/* <MultiSelectBox
            values={ROLES.filter(
              (role) => role.value.key === formik.values.role
            ).map((a) => a.value.key)}
            list={ROLES.map((item) => {
              return {
                key: item.value.key,
                value: item.value.name,
              };
            })}
            onChange={(values) =>
              formik.setValues((values) => {
                return {
                  ...values,
                  role: values[0],
                };
              })
            }
          /> */}
          {/* <MultiBox
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
            initialKeys={ROLES.filter(
              (role) =>
                role.id ===
                ROLES.find((a) => a.value.key === formik.values.role).id
            )}
            renderItem={(role, isSelected) => {
              return (
                <>
                  <Button
                    className={`
                    rounded-full px-5
                    ${
                      isSelected
                        ? "bg-accent text-secbuttn"
                        : "bg-secbuttn text-primbuttn"
                    }  `}
                  >
                    {isSelected + ""}
                    {role.value.name}
                  </Button>
                </>
              );
            }}
          /> */}
        </div>

        <Button
          disabled={createUser.isLoading || !formik.isValid}
          isLoading={createUser.isLoading || updateUser.isLoading}
          type="submit"
          className="w-full rounded-xl bg-primbuttn text-secondary"
        >
          {user ? "ویرایش" : "ثبت"}
        </Button>
      </form>
    </>
  );
}

export default function MultiSelectBox({
  className = "bg-green-700 text-white shadow-2xl shadow-green-700",
  values = [],
  list = [],
  onChange = (value) => {},
}) {
  const [selectedKeys, setSelectedKeys] = useState(values);
  const isSelected = (key) => selectedKeys.includes(key);

  useEffect(() => {
    onChange(selectedKeys);
  }, [selectedKeys]);
  return (
    <>
      <div className="flex gap-2">
        {list.map((item) => {
          return (
            <span
              className={`${
                isSelected(item.key) ? className : "ring-1 ring-gray-300"
              } w-auto cursor-pointer select-none rounded-full  px-3 py-2 text-primary hover:shadow-md`}
              key={item.key}
              onClick={() => {
                setSelectedKeys((prev) => {
                  return prev.includes(item.key)
                    ? [...prev.filter((i) => i !== item.key)]
                    : [...prev, item.key];
                });
              }}
            >
              {item.value}
            </span>
          );
        })}
      </div>
    </>
  );
}
