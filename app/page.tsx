/* import { redirect } from "next/navigation" */

import LangPage from "./[lang]/page";


export default function RootPage() {
  /* redirect("en") */
  return <LangPage params={Promise.resolve({ lang: "en" })} />
}
