export default function AuthHeader({ profile }) {
  console.log("profile", profile?.name);
  return (
    <header className="shadow-[0_4px_8px_0_rgba(0,0,0,0.2)]">
      <div className="py-[10px] px-[30px] bg-[#000] ">
        <div className="flex justify-between items-center">
          <div></div>
          <div>Howdy, {profile?.name}</div>
        </div>
      </div>
    </header>
  );
}
