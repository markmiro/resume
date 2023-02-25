import { IBM_Plex_Mono, Inter, Space_Mono } from "next/font/google";
import _styled from "@emotion/styled";
import React from "react";
import Head from "next/head";

const ResumeContext = React.createContext();

const inter = Inter({ subsets: ["latin"] });
// const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });
const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500"],
});

const Small = _styled.span`
  font-size: 0.7em;
  font-family: ${ibmMono.style.fontFamily};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  opacity: 0.5;
`;

const FirstLineBold = ({ children }) => {
  const [first, ...rest] = children.split("\n");
  return (
    <>
      <b>{first}</b>
      <br />
      {rest}
    </>
  );
};

const SplitNewLines = ({ children }) => {
  const items = children.split("\n");
  return (
    <>
      {items.map((item, i) => (
        <p>{item}</p>
      ))}
    </>
  );
};

const Paragraphs = ({ children }) => {
  return (
    <div className="flex flex-col gap-2">
      <SplitNewLines>{children}</SplitNewLines>
    </div>
  );
};

const Name = () => {
  const { name, nameRest, nameNote } = React.useContext(ResumeContext);
  return (
    <>
      <div className="text-xs text-neutral-400 pb-1 border-b border-neutral-300 -mt-10">
        <SplitNewLines>{nameNote}</SplitNewLines>
      </div>
      <div className="text-3xl font-bold">
        {name}
        <span className="border-r border-dashed border-neutral-300" />
        <span className="opacity-20">{nameRest}</span>
      </div>
    </>
  );
};

const HeaderHighlight = () => {
  const { email, website, websiteText } = React.useContext(ResumeContext);
  return (
    <div className="relative">
      <div className="absolute -top-4 -left-7 -right-7 -bottom-4 rounded-3xl bg-black bg-opacity-5 pointer-events-none" />
      <Small>Portfolio</Small>
      <div>
        <a href={website}>
          <b>{websiteText}</b>
        </a>
        <br />
        <a href={`mailto:${email}`}>{email}</a>
      </div>
    </div>
  );
};

const Heading = () => {
  const { title, location } = React.useContext(ResumeContext);
  return (
    <div className="flex gap-2 justify-between items-end">
      <div>
        <Name />
        <div>{title}</div>
      </div>
      <div>
        <Small>Location</Small>
        <div>
          <FirstLineBold>{location}</FirstLineBold>
        </div>
      </div>
      <div className="mr-4">
        <HeaderHighlight />
      </div>
    </div>
  );
};

const Skills = () => {
  const { skills } = React.useContext(ResumeContext);
  return (
    <div className="flex gap-2 justify-between">
      {/* <pre>{JSON.stringify(skills, null, 2)}</pre> */}
      {skills.map((skill) => (
        <div className="flex flex-col gap-1">
          <b className="text-black">{skill.title}</b>
          <Small>
            <SplitNewLines>{skill.desc}</SplitNewLines>
          </Small>
        </div>
      ))}
    </div>
  );
};

const Position = ({ org, title, from, to, skills, desc }) => (
  <>
    <div className="w-52">
      <div className="font-bold">{org}</div>
      <Small>{title}</Small>
      <Small className="block">
        {from} – {to}
      </Small>
    </div>
    <div className="">
      <Paragraphs>{desc}</Paragraphs>
      {skills && <Small className="block mt-2">{skills}</Small>}
    </div>
  </>
);

const Positions = () => {
  const { positions } = React.useContext(ResumeContext);
  return (
    <>
      {positions.map((position) => (
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: "repeat(1, 22ch minmax(0, 1fr))",
          }}
        >
          <Position {...position} />
        </div>
      ))}
    </>
  );
};

const Education = () => {
  const { education } = React.useContext(ResumeContext);
  return (
    <div className="flex flex-col gap-1">
      <Small>Education</Small>
      <div>{education}</div>
    </div>
  );
};

const Footer = () => {
  const { ref, updated } = React.useContext(ResumeContext);
  return (
    <div className="flex justify-between">
      <Small>{ref}</Small>
      <Small>Resume Updated: {updated}</Small>
    </div>
  );
};

export async function getStaticProps() {
  const yaml = require("js-yaml");
  const fs = require("fs");
  const doc = yaml.load(fs.readFileSync("./public/resume.yaml", "utf8"));
  return {
    props: {
      doc,
    },
  };
}

const LETTER_W = 8.5;
const LETTER_H = 11;

const Page = _styled.div`
  width: 100vw;
  height: ${(100 * LETTER_H) / LETTER_W}vw;
  /* --- */
  font-family: ${inter.style.fontFamily};
`;

function Home(props) {
  const { name, nameRest, updated } = props.doc;
  return (
    <>
      <Head>
        <title>{`${name}${nameRest} Resume - ${updated}`}</title>
      </Head>
      <ResumeContext.Provider value={props.doc}>
        <Page className="flex flex-col justify-between p-16 shadow-2xl">
          <Heading />
          <hr />
          <Skills />
          <hr />
          <Positions />
          <Education />
          <hr />
          <Footer />
        </Page>
        {/* <pre className="print:hidden">{JSON.stringify(props.doc, null, 2)}</pre> */}
      </ResumeContext.Provider>
    </>
  );
}

export default Home;
