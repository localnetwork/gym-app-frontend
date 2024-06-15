import Image from "next/image";

export default function About() {
  const items = [
    {
      title: "Boxing",
      image: "/images/boxing.jpg",
    },
    {
      title: "Jogging",
      image: "/images/jogging.jpg",
    },
    {
      title: "Boxing",
      image: "/images/boxing.jpg",
    },
    {
      title: "Boxing",
      image: "/images/boxing.jpg",
    },
  ];
  return (
    <section className="py-[50px]">
      <div className="container">
        <div className="flex flex-wrap">
          {items.map((item, index) => (
            <div key={index} className="max-w-[50%] w-full relative">
              <Image
                src={item.image}
                alt="alt"
                width={600}
                height={400}
                className="absolute object-cover h-full w-full top-0 left-0"
              />
              <div className="text-center relative min-h-[400px] flex items-center justify-center bg-[#000] bg-opacity-50">
                <h3 className="text-[40px] font-black">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
