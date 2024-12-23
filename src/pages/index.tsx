"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Calendar, Clock, Users, CheckCircle, Building } from "lucide-react";
import { LanguageSwitcher } from "~/components/main/language-switcher";
import { LanguageProvider, useLanguage } from "~/context/language.context";
import { translations } from "~/utils/translations";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import BlurBackground from "~/ui/blur-backgrounds";

function LandingPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div
      className={`flex min-h-screen flex-col font-sans ${
        language === "fa" ? "font-vazir" : ""
      }`}
      dir={language === "fa" ? "rtl" : "ltr"}
      lang={language}
    >
      <header className="flex h-16 items-center px-4 lg:px-6">
        <Link className="flex items-center justify-center " href="#">
          <span className="sr-only">RoomReserve</span>
        </Link>
      </header>
      <main className="flex-1">
        <BlurBackground />
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-3xl font-bold text-primary ">
                Rougine meeting
              </h1>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter text-accent sm:text-4xl md:text-5xl lg:text-6xl/none">
                  {t.simplifyReservations}
                </h1>
                <p className="mx-auto max-w-[700px] text-primary  md:text-xl">
                  {t.simplifyDescription}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 space-x-4">
                <AuthShowcase />
              </div>
            </div>
          </div>
        </section>
        {/* <section
          id="features"
          className="w-full bg-gray-100 py-12 dark:bg-gray-800 md:py-24 lg:py-32"
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
              {t.keyFeatures}
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border-gray-800 p-4">
                <Calendar className="mb-2 h-8 w-8" />
                <h3 className="text-xl font-bold">{t.easyScheduling}</h3>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  {t.easySchedulingDesc}
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border-gray-800 p-4">
                <Clock className="mb-2 h-8 w-8" />
                <h3 className="text-xl font-bold">{t.timeManagement}</h3>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  {t.timeManagementDesc}
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border-gray-800 p-4">
                <Users className="mb-2 h-8 w-8" />
                <h3 className="text-xl font-bold">{t.teamCollaboration}</h3>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  {t.teamCollaborationDesc}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
              {t.howItWorks}
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
                  {language === "fa" ? "۱" : "1"}
                </div>
                <h3 className="text-xl font-bold">{t.chooseRoom}</h3>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  {t.chooseRoomDesc}
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
                  {language === "fa" ? "۲" : "2"}
                </div>
                <h3 className="text-xl font-bold">{t.setDateTime}</h3>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  {t.setDateTimeDesc}
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
                  {language === "fa" ? "۳" : "3"}
                </div>
                <h3 className="text-xl font-bold">{t.confirmBooking}</h3>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  {t.confirmBookingDesc}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="testimonials"
          className="w-full bg-gray-100 py-12 dark:bg-gray-800 md:py-24 lg:py-32"
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
              {t.whatUsersSay}
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border-gray-800 p-4">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="User Avatar"
                  className="rounded-full"
                  width={100}
                  height={100}
                />
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  {t.testimonial1}
                </p>
                <p className="font-bold">
                  {language === "fa"
                    ? "سارا احمدی، مدیرعامل"
                    : "Sarah Ahmed, CEO"}
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border-gray-800 p-4">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="User Avatar"
                  className="rounded-full"
                  width={100}
                  height={100}
                />
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  {t.testimonial2}
                </p>
                <p className="font-bold">
                  {language === "fa"
                    ? "علی محمدی، مدیر"
                    : "Ali Mohammed, Manager"}
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border-gray-800 p-4">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="User Avatar"
                  className="rounded-full"
                  width={100}
                  height={100}
                />
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  {t.testimonial3}
                </p>
                <p className="font-bold">
                  {language === "fa"
                    ? "مریم رضایی، مدیر فناوری اطلاعات"
                    : "Maryam Rezaei, IT Director"}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  {t.readyToOptimize}
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t.joinThousands}
                </p>
              </div>
              <Button className="bg-accent hover:bg-primary/80">
                {t.startFreeTrial}
              </Button>
            </div>
          </div>
        </section> */}
      </main>
      {/* <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t.allRightsReserved}
        </p>
        <nav
          className={`${
            language === "fa" ? "sm:mr-auto" : "sm:ml-auto"
          } flex gap-4 sm:gap-6`}
        >
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            {t.termsOfService}
          </Link>
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            {t.privacy}
          </Link>
        </nav>
      </footer> */}
    </div>
  );
}

export default function WrappedLandingPage() {
  return <LandingPage />;
}

function AuthShowcase() {
  const { data: sessionData, status } = useSession();
  const { language } = useLanguage();
  const t = translations[language];

  if (status === "loading") {
    return (
      <>
        <button className="rounded-full bg-rose-950/50 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
          ...
        </button>
      </>
    );
  }
  const role = sessionData?.user?.role.toLowerCase();
  return (
    <>
      <div className="flex flex-row items-center justify-center gap-4">
        {" "}
        <p className="  text-center  text-xl text-primary">
          {sessionData && (
            <Link
              className="rounded-full bg-primary/10 p-2 px-4 text-primary"
              href={`/${role}`}
            >
              {t.goToDashboard}
            </Link>
          )}
        </p>{" "}
        <button
          className="rounded-full bg-rose-950/50 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          {sessionData ? t.logout : t.loginTo}
        </button>
      </div>
    </>
  );
}

// export async function getServerSideProps(context) {
//   const session = await getServerSession(context.req, context.res, authOptions);

//   if (session) {
//     return {
//       redirect: {
//         destination: `/${session.user?.role.toLocaleLowerCase()}`,
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// }
