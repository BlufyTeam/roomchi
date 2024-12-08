import { signOut } from "next-auth/react";
import { useLanguage } from "~/context/language.context";
import BlurBackground from "~/ui/blur-backgrounds";
import Button from "~/ui/buttons";
import { Container, ContainerBottomBorder } from "~/ui/containers";
import ExitIcon from "~/ui/icons/exits";
import NotificationIcon from "~/ui/icons/notification";
import { translations } from "~/utils/translations";

export default function AdminSkeleton() {
  const { language } = useLanguage();
  const t = translations[language];
  return (
    <>
      <div className="m-auto flex min-h-screen w-full max-w-[1920px] flex-col items-center bg-secondary">
        <Container className="flex w-full items-center justify-center">
          <BlurBackground />

          <Container className="flex  flex-col bg-secondary">
            <div
              className="flex flex-col items-center justify-between gap-5  py-8 md:flex-row"
              dir="rtl"
            >
              <div className="flex w-full flex-col items-center justify-start  gap-2 md:flex-row">
                <div className="h-6 w-40 animate-pulse rounded-md bg-primbuttn/50"></div>

                <div className="h-6 w-8 animate-pulse rounded-md bg-primbuttn/50"></div>
              </div>

              <div className="flex items-center justify-center gap-5 ">
                <span className="h-8 w-8 animate-pulse rounded-full bg-primbuttn/50"></span>
                <Button
                  onClick={() => signOut()}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-full stroke-white p-1.5 text-primary  hover:bg-accent/50 hover:stroke-primary hover:ring-accent/50"
                >
                  <ExitIcon className="h-4 w-4" />
                  <span className="hidden text-sm text-primary md:flex">
                    {t.exit}
                  </span>
                </Button>

                <span className="h-6 w-40 animate-pulse rounded-md bg-primbuttn/50"></span>
              </div>
            </div>
          </Container>
        </Container>
        <ContainerBottomBorder className="sticky top-0 z-50 flex h-8 w-full py-2 backdrop-blur-lg">
          <Container className=" max2xl:w-full">
            <div className="h-8 w-1/3 rounded-t-md bg-primbuttn/50"></div>
          </Container>
        </ContainerBottomBorder>

        <ContainerBottomBorder className="h-full items-start bg-accent/5 ">
          <></>
        </ContainerBottomBorder>
      </div>
    </>
  );
}
