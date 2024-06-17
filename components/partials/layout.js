import AuthHeader from "./AuthHeader";
import Footer from "./Footer";
import Header from "./Header";
import { useRouter } from "next/router";
export default function Layout({ children, profile }) {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-[100vh]">
      {profile && <AuthHeader profile={profile} />}

      {!profile && router.asPath != "/login" && <Header />}
      <main className="flex-grow">{children}</main>
      {router.asPath != "/login" && <Footer />}
    </div>
  );
}
