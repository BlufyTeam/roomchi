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
import { useState } from "react";
import { object } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { toast } from "~/components/ui/toast/use-toast";
import MultiStep from "~/features/multi-step";
import PickTimeView from "~/features/pick-time-view";
import RoomsList from "~/features/rooms-list";
import { createPlanSchema } from "~/server/validations/plan.validation";

import Button from "~/ui/buttons";
import TextField from "~/ui/forms/text-field";
import withLabel from "~/ui/forms/with-label";
import ThreeDotsWave from "~/ui/loadings/three-dots-wave";
import { api } from "~/utils/api";
import { delay } from "~/utils/util";

const TextFieldWithLable = withLabel(TextField);

export function ReserveRoom({ date }: { date: Moment }) {
  const [step, setStep] = useState(0);
  const createPlan = api.plan.createPlan.useMutation({
    onSuccess: () => {
      setStep(4);
    },
    onError: () => {
      setStep(3);
    },
  });

  function handleNextStep(stepNumber?: number) {
    if (step + 1 === 4) return;
    if (step + 1 >= 3 && !formik.isValid) {
      toast({
        title: "مرحله بعد",
        description: (
          <pre className="font-iransans">
            {Object.values(formik.errors).map((a) => a + "\n")}
          </pre>
        ),
      });
      return;
    }
    if (step === 2 && !formik.values.title) return;
    if (stepNumber >= 0) return setStep((prev) => stepNumber);
    else return setStep((prev) => prev + 1);
  }
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
          onStepClick={(stepNumber) => {
            console.log({ stepNumber });
            handleNextStep(stepNumber);
          }}
          onPrevious={() => {
            setStep((prev) => prev - 1);
          }}
          onNext={() => {
            handleNextStep();
          }}
          icons={[
            <ReplaceIcon key={1} className="stroke-inherit" />,
            <HourglassIcon key={2} className="stroke-inherit" />,
            <StickyNoteIcon key={3} className="stroke-inherit" />,
            <Loader2Icon key={4} className="stroke-inherit" />,
            <CheckIcon key={4} className="stroke-inherit" />,
          ]}
          currentStep={step}
          steps={[
            <div
              key={1}
              className="flex flex-col items-center justify-center gap-4"
            >
              <h3 className="w-full px-2  text-center text-accent">
                برای رزرو اتاق انتخاب کنید
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
                  setStep((prev) => prev + 1);
                }}
              />
            </div>,

            <div
              key={2}
              className="flex flex-col items-center justify-center gap-4 text-accent"
            >
              <div className="flex items-center justify-center gap-2">
                <div>
                  <h3 className="w-full py-5 text-center"> زمان شروع</h3>
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
                  <h3 className="w-full py-5 text-center"> زمان پایان</h3>
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
              <Button
                key={2}
                onClick={(room) => {
                  setStep((prev) => prev + 1);
                }}
                className="bg-accent/20 text-accent"
              >
                مرحله بعد
              </Button>
            </div>,
            <div
              key={3}
              className="flex flex-col items-center justify-center gap-4 "
            >
              <TextFieldWithLable
                label="عنوان"
                {...formik.getFieldProps("title")}
              />
              <TextFieldWithLable
                label="توضیحات"
                {...formik.getFieldProps("description")}
              />
              <Button
                onClick={async () => {
                  handleNextStep();
                  await delay(2000);
                  createPlan.mutate({
                    roomId: formik.values.roomId,
                    title: formik.values.title,
                    start_datetime: formik.values.start_datetime,
                    end_datetime: formik.values.end_datetime,
                    description: formik.values.description,
                  });
                }}
                className="bg-accent/20 text-accent"
              >
                مرحله بعد
              </Button>
            </div>,
            <div
              key={4}
              className="flex flex-col items-center justify-center gap-2 text-center text-accent"
            >
              <p>در حال رزرو...</p>
              <p>{formik.values.room?.title}</p>
              <p>
                {moment(formik.values.start_datetime)
                  .locale("fa")
                  .format("D MMMM yyyy")}{" "}
                ساعت{" "}
                {moment(formik.values.start_datetime)
                  .locale("fa")
                  .format("HH:mm")}{" "}
                تا{" "}
                {moment(formik.values.end_datetime)
                  .locale("fa")
                  .format("HH:mm")}
              </p>
            </div>,
            <div className="flex flex-col items-center justify-center gap-5 ">
              <p className="text-primary"> اتاق با موفقیت رزرو شد</p>
              <Link className="text-accent" href={"/admin"}>
                بازگشت به تقویم
              </Link>
            </div>,
          ]}
        />
      </div>
    </>
  );
}
