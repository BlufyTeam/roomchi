import { useFormik } from "formik";
import moment, { Moment } from "jalali-moment";
import {
  CheckIcon,
  HourglassIcon,
  Loader2Icon,
  ReplaceIcon,
  StickyNoteIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { object } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { toast } from "~/components/ui/toast/use-toast";
import { useLanguage } from "~/context/language.context";
import MultiStep from "~/features/multi-step";
import PickTimeView from "~/features/pick-time-view";
import RoomsList from "~/features/rooms-list";
import { createPlanSchema } from "~/server/validations/plan.validation";

import Button from "~/ui/buttons";
import TextField from "~/ui/forms/text-field";
import withLabel from "~/ui/forms/with-label";
import ThreeDotsWave from "~/ui/loadings/three-dots-wave";
import { api } from "~/utils/api";
import { translations } from "~/utils/translations";
import { delay } from "~/utils/util";

const TextFieldWithLable = withLabel(TextField);

const icons = [
  <ReplaceIcon key={1} className="stroke-inherit" />,
  <HourglassIcon key={2} className="stroke-inherit" />,
  <StickyNoteIcon key={3} className="stroke-inherit" />,
  <Loader2Icon key={4} className="stroke-inherit" />,
  <CheckIcon key={4} className="stroke-inherit" />,
];

export function ReserveRoom({ date }: { date: Moment }) {
  const { language } = useLanguage();
  const t = translations[language];
  const [step, setStep] = useState(0);
  const utils = api.useContext();
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
    if (stepNumber >= 4)
      if (formik.values.end_datetime <= formik.values.start_datetime)
        return toast({
          title: t.timeError,
          description: t.EndTimeError,
        });
    if (stepNumber >= 4 && createPlan.isLoading) return;
    if (stepNumber >= 3 && !formik.isValid) {
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

  useEffect(() => {
    if (step === icons.length - 2) {
      new Promise(async (resolve) => {
        createPlan.mutate({
          roomId: formik.values.roomId,
          title: formik.values.title,
          start_datetime: formik.values.start_datetime,
          end_datetime: formik.values.end_datetime,
          description: formik.values.description,
        });
      });
    }
  }, [step]);
  const formik = useFormik({
    initialValues: {
      room: undefined,
      title: "",
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
    },
    validationSchema: toFormikValidationSchema(createPlanSchema),
    validateOnBlur: true,
    onSubmit: () => {},
  });
  return (
    <>
      <div className="flex  w-full overflow-hidden">
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
                    <PickTimeView
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
                    />
                  </div>
                  <div>
                    <h3 className="w-full py-5 text-center"> {t.endTime}</h3>
                    <PickTimeView
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
                    />
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
                {t.next}
              </Button>
            </div>,
            <div
              key={3}
              className="flex flex-col items-center justify-center gap-4 "
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
                {t.until}{" "}
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
                {t.withTitle}
                {formik.values.title}
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
