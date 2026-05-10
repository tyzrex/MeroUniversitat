import { redirect } from "next/navigation";

/** Legacy route — profile editing lives at `/dashboard/profile`. */
export default function SettingsProfileRedirectPage() {
  redirect("/dashboard/profile");
}
