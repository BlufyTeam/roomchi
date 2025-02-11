import { useFormik } from "formik";
import moment, { Moment } from "jalali-moment";
import {
  CheckIcon,
  HourglassIcon,
  Loader2Icon,
  ReplaceIcon,
  ShieldCheck,
  ShieldOff,
  StickyNoteIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Time } from "@internationalized/date";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { object } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import MultiSelector from "~/components/origin/multi-select";
import { MyTimeField } from "~/components/origin/time-picker";
import { Checkbox } from "~/components/shadcn/checkbox";
import { Label } from "~/components/shadcn/label";
import { toast } from "~/components/ui/toast/use-toast";
import { useLanguage } from "~/context/language.context";
import MultiStep from "~/features/multi-step";
import PickTimeView from "~/features/pick-time-view";
import RoomsList from "~/features/rooms-list";
import { cn } from "~/lib/utils";
import { createPlanSchema } from "~/server/validations/plan.validation";

import Button from "~/ui/buttons";
import ButtonCheckbox from "~/ui/forms/checkbox/checkbox";
import TextField from "~/ui/forms/text-field";
import withLabel from "~/ui/forms/with-label";
import NotificationIcon from "~/ui/icons/notification";
import ThreeDotsWave from "~/ui/loadings/three-dots-wave";
import { api } from "~/utils/api";
import { translations } from "~/utils/translations";
import { delay } from "~/utils/util";

const TextFieldWithLable = withLabel(TextField);

const icons = [
  <ReplaceIcon key={1} className="stroke-inherit" />,
  <HourglassIcon key={2} className="stroke-inherit" />,
  <StickyNoteIcon key={3} className="stroke-inherit" />,
  <NotificationIcon key={4} className="stroke-inherit" />,
  <Loader2Icon key={5} className="stroke-inherit" />,
  <CheckIcon key={6} className="stroke-inherit" />,
];

export function ReserveRoom({ date }: { date: Moment }) {
  const { language, t } = useLanguage();
  const session = useSession();

  const [step, setStep] = useState(0);
  const utils = api.useContext();
  const users = api.user.getMyCompanyUsers.useQuery();
  const createPlan = api.plan.createPlan.useMutation({
    onSuccess: async () => {
      await delay(2000);
      setStep(4);
      utils.plan.getPlansByDate.invalidate();
    },
    onError: async (error) => {
      await delay(2000);
      toast({
        title: t.reserveError,
        description: error.message,
      });
      setStep(1);
    },
  });

  async function goTo(stepNumber?: number) {
    formik.validateForm();
    if (stepNumber >= 5)
      if (formik.values.end_datetime <= formik.values.start_datetime)
        return toast({
          title: t.timeError,
          description: t.EndTimeError,
        });
    if (stepNumber >= 5 && createPlan.isLoading) return;
    if (stepNumber >= 4 && !formik.isValid) {
      toast({
        title: t.done,
        description: (
          <pre className="font-iransans">
            {Object.values(formik.errors).map((a) => a + "\n")}
          </pre>
        ),
      });
      return;
    }

    return setStep(stepNumber);
  }
  const router = useRouter();
  useEffect(() => {
    if (step === icons.length - 2) {
      new Promise(async (resolve) => {
        try {
          await createPlan.mutateAsync({
            roomId: formik.values.roomId,
            send_email: formik.values.send_email,
            is_confidential: formik.values.is_confidential,
            title: formik.values.title,
            start_datetime: formik.values.start_datetime,
            end_datetime: formik.values.end_datetime,
            description: formik.values.description,
            link: formik.values.link,
            participantsIds: formik.values.participants.map((a) => a.value),
          });
          goTo(0);
          formik.resetForm();
        } catch {}
      });
    }
  }, [step]);
  const formik = useFormik({
    initialValues: {
      room: undefined,
      send_email: false,
      is_confidential: false,
      title: "",
      link: "",
      roomId: "",
      start_datetime: date
        .clone()
        .set({
          year: date.year(),
          month: date.month(),
          d: date.day(),
          hour: moment().hour(),
        })
        .toDate(),
      end_datetime: date
        .clone()
        .set({
          year: date.year(),
          month: date.month(),
          d: date.day(),
          hour: moment().add(2, "hour").hour(),
        })
        .toDate(),
      description: "",
      participantsIds: [],
      participants: [],
    },
    validationSchema: toFormikValidationSchema(createPlanSchema),
    validateOnBlur: true,
    onSubmit: () => {},
  });
  return (
    <>
      <div className="flex w-full flex-col items-center justify-center font-iransans ">
        {t.confidential}
        <MultiStep
          isLoading={createPlan.isLoading}
          onStepClick={(stepNumber) => {
            goTo(stepNumber);
          }}
          onPrevious={() => {
            goTo(step - 1);
          }}
          onNext={() => {
            goTo(step + 1);
          }}
          icons={icons}
          currentStep={step}
          steps={[
            <div
              key={1}
              className="flex flex-col items-center justify-center gap-4"
            >
              <h3 className="w-full px-2  text-center text-accent">
                {t.reserveSelect}
              </h3>
              <RoomsList
                companyId={session.data.user.companyId}
                onClick={(room) => {
                  formik.setValues((values) => {
                    return {
                      ...values,
                      roomId: room.id,
                      room: room,
                    };
                  });
                  goTo(step + 1);
                }}
              />
            </div>,

            <div
              key={2}
              className="flex flex-col items-center justify-center gap-4 text-accent"
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <p
                  onClick={() => {
                    goTo(0);
                  }}
                  className="cursor-pointer text-primary underline"
                >
                  {formik.values.room?.title}
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div>
                    <h3 className="w-full py-5 text-center"> {t.startTime}</h3>
                    <MyTimeField
                      value={
                        new Time(
                          moment(formik.values.start_datetime).hour(),
                          moment(formik.values.start_datetime).minute()
                        )
                      }
                      onChange={(value) => {
                        formik.setFieldValue(
                          "start_datetime",
                          moment(date)
                            .set({
                              hour: value.hour,
                              minute: value.minute,
                            })
                            .toDate()
                        );
                      }}
                    />
                    {/* <PickTimeView
                      value={moment(formik.values.start_datetime)}
                      date={date}
                      onChange={(time) => {
                        formik.setValues((values) => {
                          return {
                            ...values,
                            start_datetime: time.toDate(),
                          };
                        });
                      }}
                    /> */}
                  </div>
                  <div>
                    <h3 className="w-full py-5 text-center"> {t.endTime}</h3>
                    <MyTimeField
                      value={
                        new Time(
                          moment(formik.values.end_datetime).hour(),
                          moment(formik.values.end_datetime).minute()
                        )
                      }
                      onChange={(value) => {
                        formik.setFieldValue(
                          "end_datetime",
                          moment(date)
                            .set({
                              hour: value.hour,
                              minute: value.minute,
                            })
                            .toDate()
                        );
                      }}
                    />
                    {/* <PickTimeView
                      value={moment(formik.values.end_datetime)}
                      date={date}
                      onChange={(time) => {
                        formik.setValues((values) => {
                          return {
                            ...values,
                            end_datetime: time.toDate(),
                          };
                        });
                      }}
                    /> */}
                  </div>
                </div>
              </div>
              <Button
                disabled={createPlan.isLoading}
                key={2}
                onClick={(room) => {
                  goTo(step + 1);
                }}
                className="bg-accent/20 text-accent"
              >
                {t.done}
              </Button>
            </div>,
            <div
              key={3}
              className="flex w-full max-w-sm flex-col items-center justify-center gap-4 "
            >
              <p
                onClick={() => {
                  goTo(0);
                }}
                className="cursor-pointer text-primary underline"
              >
                {formik.values.room?.title}
              </p>
              <p
                onClick={() => {
                  goTo(1);
                }}
                className="cursor-pointer text-primary underline"
              >
                {moment(formik.values.start_datetime)
                  .locale(language)
                  .format("D MMMM yyyy")}{" "}
                {moment(formik.values.start_datetime)
                  .locale(language)
                  .format("HH:mm")}{" "}
                {t.until}
                {moment(formik.values.end_datetime)
                  .locale(language)
                  .format("HH:mm")}
              </p>
              <TextFieldWithLable
                label={t.title}
                {...formik.getFieldProps("title")}
              />
              <TextFieldWithLable
                label={t.description}
                {...formik.getFieldProps("description")}
              />
              <TextFieldWithLable
                isRtl={false}
                label={t.linkForOnlineMeeting}
                {...formik.getFieldProps("link")}
              />
              <Button
                disabled={createPlan.isLoading}
                onClick={async () => {
                  goTo(3);
                }}
                className="bg-accent/20 text-accent"
              >
                {t.done}{" "}
              </Button>
            </div>,
            <div className="flex w-full flex-col items-center justify-center gap-5">
              {users.isLoading ? (
                "در حال دریافت کاربران برای انتخاب"
              ) : (
                <div className="flex flex-col items-center justify-center gap-5">
                  <ButtonCheckbox
                    checked={formik.values.is_confidential}
                    onClick={() => {
                      formik.setFieldValue(
                        "is_confidential",
                        !formik.values.is_confidential
                      );
                    }}
                    text={
                      formik.values.is_confidential
                        ? t.confidential
                        : t.notConfidential
                    }
                    checkIcon={<ShieldCheck className="size-5" />}
                    unCheckIcon={<ShieldOff className="size-5" />}
                  />

                  <ButtonCheckbox
                    checked={formik.values.send_email}
                    onClick={() => {
                      formik.setFieldValue(
                        "send_email",
                        !formik.values.send_email
                      );
                    }}
                    text={t.NotifyUsers}
                  />

                  <div className="mx-auto max-w-sm rounded-md bg-secondary p-5">
                    <MultiSelector
                      label={t.chooseUsers}
                      options={users.data
                        .filter((a) => {
                          if (a.role != "ROOM" && a.id !== session.data.user.id)
                            return a;
                        })
                        .map((a) => {
                          return {
                            label: a.name,
                            value: a.id,
                          };
                        })}
                      onChange={(option) => {
                        formik.setFieldValue("participants", option);
                      }}
                      value={formik.values.participants}
                    />
                  </div>
                </div>
              )}
              <Button
                disabled={createPlan.isLoading}
                onClick={async () => {
                  goTo(4);
                }}
                className="bg-accent/20 text-accent"
              >
                {t.next}{" "}
              </Button>
            </div>,
            <div
              key={4}
              className="flex flex-col items-center justify-center gap-2 text-center text-accent"
            >
              <p>{t.reserveInProgress}</p>
              <p>{formik.values.room?.title}</p>
              <p>
                {moment(formik.values.start_datetime)
                  .locale(language)
                  .format("D MMMM yyyy")}{" "}
                {t.time}{" "}
                {moment(formik.values.start_datetime)
                  .locale(language)
                  .format("HH:mm")}{" "}
                {t.until}{" "}
                {moment(formik.values.end_datetime)
                  .locale(language)
                  .format("HH:mm")}
              </p>
              <p>
                {t.withTitle} {formik.values.title}
              </p>
              {formik.values.description && (
                <p>
                  {t.withDescription}
                  {formik.values.description}
                </p>
              )}
            </div>,
            <div
              key={5}
              className="flex flex-col items-center justify-center gap-5 "
            >
              <p className="text-primary"> {t.successRoom}</p>
              <Link className="text-accent " href={"/admin"}>
                {t.backToCalendar}
              </Link>
            </div>,
          ]}
        />
      </div>
    </>
  );
}
