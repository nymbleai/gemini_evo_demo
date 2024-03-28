import { redirectIfAuthenticated } from "@/features/auth-page/helpers";
import { LogIn } from "@/features/auth-page/login";

export default async function Home() {
  await redirectIfAuthenticated();
  return (
    <main className="container max-w-lg flex items-center">
      {/* workaround for running build in dev mode */}
      {/* <LogIn isDevMode={process.env.NODE_ENV === "development"} /> */}

      {/* workaround for running build in dev mode */}
      <LogIn isDevMode={true} />
    </main>
  );
}
