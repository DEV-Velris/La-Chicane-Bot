import i18next from "i18next";
import Backend from "i18next-fs-backend";
import { join } from "path";

export async function initI18n() {
  await i18next.use(Backend).init({
    lng: "fr",
    fallbackLng: "fr",
    preload: ["en", "fr"],
    ns: ["translation"],
    defaultNS: "translation",
    backend: {
      loadPath: join(__dirname, "./locales/{{lng}}/{{ns}}.json")
    }
  });
}

export default i18next;
