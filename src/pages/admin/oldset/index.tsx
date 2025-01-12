import React from "react";
import AdminMainLayout from "~/pages/admin/layout";
import Button from "~/ui/buttons";

const themes = [
  "theme-light-1",
  "theme-light-2",
  "theme-light-3",
  "theme-dark-1",
  "theme-dark-2",
  "theme-dark-3",
];

export default function SettingsPage() {
  return (
    <AdminMainLayout>
      <Button
        className="m-5 bg-primbuttn p-5 text-secondary"
        onClick={() => {
          document.querySelector("html").dir =
            document.querySelector("html").dir === "rtl" ? "ltr" : "rtl";
        }}
      >
        toggle rtl
      </Button>

      <div className="flex items-center justify-center gap-5">
        {themes.map((theme) => {
          return (
            <>
              <Button
                key={theme}
                className="bg-primbuttn p-5 text-secondary"
                onClick={() => {
                  document.querySelector("body").className = theme;

                  localStorage.setItem("theme", theme);
                }}
              >
                {theme}
              </Button>
            </>
          );
        })}
      </div>
    </AdminMainLayout>
  );
}
