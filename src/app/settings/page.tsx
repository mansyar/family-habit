import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAppSettings } from "@/lib/actions";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/login");

  const settings = await getAppSettings();

  return (
    <SettingsClient
      userName={session.user.name}
      stickerThreshold={settings.stickerThreshold}
    />
  );
}
