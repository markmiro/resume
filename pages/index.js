import { IBM_Plex_Mono, Inter, Space_Mono } from "next/font/google";
import styled from "@emotion/styled";
import tw from 'tailwind.macro'
import React from "react";
import { format } from "date-fns";

const ResumeContext = React.createContext();

const inter = Inter({ subsets: ["latin"] });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });
// const ibmMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "700"] });

const B = styled.div``;

const Small = styled.span({  })`
  font-size: 0.75em;
  font-family: ${spaceMono.style.fontFamily};
  font-weight: ${spaceMono.style.fontWeight};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  /* font-weight: 700; */
  opacity: 0.5;
`;

const BTitle = ({ children }) => <Small>{children}</Small>;

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

const BBody = ({ children }) => (
  <div className="whitespace-nowrap">{children}</div>
);

const Heading = () => {
  const { name, nameRest, email, title, website, websiteText, location } =
    React.useContext(ResumeContext);
  return (
    <div className="flex gap-2 justify-between items-end">
      <div>
        <div className="text-3xl font-bold">
          {name}
          <span className="opacity-20">{nameRest}</span>
        </div>
        <div>{title}</div>
      </div>
      <B>
        <BTitle>Location</BTitle>
        <BBody>
          <FirstLineBold>{location}</FirstLineBold>
        </BBody>
      </B>
      <B className="relative mr-4">
        <div className="absolute -top-4 -left-7 -right-7 -bottom-4 rounded-3xl bg-black bg-opacity-5 pointer-events-none" />
        <BTitle>Portfolio</BTitle>
        <BBody>
          <a href={website}>
            <b>{websiteText}</b>
          </a>
          <br />
          <a href={`mailto:${email}`}>{email}</a>
        </BBody>
      </B>
    </div>
  );
};

const Skills = () => {
  const { skills } = React.useContext(ResumeContext);

  return (
    <div className="flex gap-2 justify-between">
      {/* <pre>{JSON.stringify(skills, null, 2)}</pre> */}
      {skills.map((skill) => (
        <B>
          <BTitle>{skill.title}</BTitle>
          <BBody>
            <SplitNewLines>{skill.desc}</SplitNewLines>
          </BBody>
        </B>
      ))}
    </div>
  );
};

const Position = ({ org, title, from, to, skills, desc }) => (
  <>
    <div className="w-52">
      <div>{org}</div>
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
    <div>
      <Small>Education</Small>
      <div>{education}</div>
    </div>
  );
};

const Footer = () => {
  const { ref } = React.useContext(ResumeContext);
  const date = new Date();

  return (
    <div className="flex justify-between">
      <Small>{ref}</Small>
      <Small>Resume Updated: {format(date, "MMM dd, YYY")}</Small>
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

const Page = styled.div`
  width: 100vw;
  height: ${(100 * LETTER_H) / LETTER_W}vw;
  /* --- */
  font-family: ${inter.style.fontFamily};
  /* background: red; */
  /* border: 2px solid black; */
  /* overflow-y: auto; */
`;

function Home(props) {
  return (
    <>
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
        <pre className="print:hidden">{JSON.stringify(props.doc, null, 2)}</pre>
      </ResumeContext.Provider>
    </>
  );
}

export default Home;
