import Image from "next/image";

const TEAM = [
  {
    name: "Nathan Graddon",
    title: "Student • Computer Science (AI & Robotics)",
    email: "ngraddon@udel.edu",
    img: "/team/nathan.jpeg",
  },
  {
    name: "Ryan Padrone",
    title: "Student • Computer Science (AI & Robotics)",
    email: "ryn@udel.edu",
    img: "/team/ryan.jpg",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white px-8 py-20">
      {/* Header */}
      <section className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Contact
        </h1>
        <p className="text-neutral-400 max-w-3xl mx-auto leading-relaxed">
          We built MindMap to support mental well-being to make the hard decisions 
          just a little easier
        </p>
        <p className="text-neutral-500 max-w-3xl mx-auto mt-4 leading-relaxed">
          We both conduct research and programming at the{" "}
          <span className="text-neutral-300">Computational Research Lab</span>.
        </p>
      </section>

      {/* Team Cards */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        {TEAM.map((member) => (
          <div
            key={member.email}
            className="bg-[#0b1020] border border-white/5 rounded-2xl p-10 flex flex-col items-center text-center hover:border-purple-500/40 transition"
          >
            {/* Circle Image */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden border border-white/10 shadow-lg shadow-purple-500/10">
              <Image
                src={member.img}
                alt={member.name}
                fill
                className="object-cover"
                sizes="128px"
                priority
              />
            </div>

            {/* Info */}
            <h2 className="text-2xl font-semibold mt-6">{member.name}</h2>
            <p className="text-neutral-400 mt-2">{member.title}</p>

            {/* Email */}
            <a
              href={`mailto:${member.email}`}
              className="mt-5 inline-flex items-center justify-center px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition"
            >
              {member.email}
            </a>
          </div>
        ))}
      </section>
    </div>
  );
}