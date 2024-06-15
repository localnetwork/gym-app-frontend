import Header from "./Header";
export default function Layout({ children, profile }) {
  return (
    <div>
      {profile && <Header profile={profile} />}
      <main>{children}</main>
    </div>
  );
}
