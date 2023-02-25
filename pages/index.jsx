import React from "react";
import Head from "next/head";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

// --- Helpers ---

const ResumeContext = React.createContext();

// https://ui.shadcn.com/docs/installation#add-a-cn-helper
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Generic Components ---

const Hr = () => <hr className="border-neutral-200 w-full" />;

const SmallMono = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        `font-mono text-xs uppercase tracking-wider opacity-50 font-medium ${className}`
      )}
      {...props}
    />
  );
});

const FirstLineBold = ({ children }) => {
  const [first, ...rest] = children.split("\n");
  return (
    <>
      <div className="font-semibold">{first}</div>
      <div>{rest}</div>
    </>
  );
};

const SplitNewLines = ({ children }) => {
  const items = children.split("\n");
  return (
    <>
      {items.map((item, i) => (
        <p key={i}>{item}</p>
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

// --- Resume Components ---

const Name = () => {
  const { name, nameRest, nameNote } = React.useContext(ResumeContext);
  return (
    <>
      <div className="text-xs tracking-wider text-neutral-400 -mt-10">
        <SplitNewLines>{nameNote}</SplitNewLines>
      </div>
      <div className="text-3xl font-semibold">
        {name}
        {/* <span className="border-r border-dashed border-neutral-300" /> */}
        <span className="opacity-20">{nameRest}</span>
      </div>
    </>
  );
};

const HeaderBlock = ({ children }) => {
  return (
    <div className="relative">
      <div className="absolute -top-4 -left-7 -right-7 -bottom-4 rounded-3xl bg-black bg-opacity-5 pointer-events-none" />
      {children}
    </div>
  );
};

const Header = () => {
  const { title, location, website, websiteText, email } =
    React.useContext(ResumeContext);
  return (
    <div className="flex gap-2 justify-between items-end">
      <div>
        <Name />
        <div>{title}</div>
      </div>
      <div>
        <SmallMono>Location</SmallMono>
        <div>
          <FirstLineBold>{location}</FirstLineBold>
        </div>
      </div>
      <div className="mr-4">
        <HeaderBlock>
          <SmallMono>Portfolio</SmallMono>
          <div>
            <a href={website} className="block font-semibold">
              {websiteText}
            </a>
            <a href={`mailto:${email}`}>{email}</a>
          </div>
        </HeaderBlock>
      </div>
    </div>
  );
};

const Skills = () => {
  const { skills } = React.useContext(ResumeContext);
  return (
    <>
      <div className="flex gap-2 justify-between">
        {skills.map((skill, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="font-semibold text-xs tracking-wider">
              {skill.title}
            </span>
            <SmallMono>
              <SplitNewLines>{skill.desc}</SplitNewLines>
            </SmallMono>
          </div>
        ))}
      </div>
    </>
  );
};

const InBetween = ({ children, separator }) => {
  return (
    <div>
      {children.map((child, i) => (
        <React.Fragment key={i}>
          {child}
          {i < children.length - 1 && separator}
        </React.Fragment>
      ))}
    </div>
  );
};

const Position = ({ org, title, from, to, skills, desc }) => (
  <>
    <div>
      <span className="font-semibold">{title}</span>
      <div className="text-xs tracking-wider opacity-60">
        <div className="font-semibold">{org}</div>
        {from} – {to}
      </div>
    </div>
    <div className="">
      <Paragraphs>{desc}</Paragraphs>
      {skills && (
        <div className="block mt-2 tracking-wide">
          <InBetween separator={<SmallMono className="mx-3">/</SmallMono>}>
            {skills.map((skill, i) => {
              // is object
              if (typeof skill === "object") {
                return (
                  <span key={i}>
                    <span className="text-xs tracking-wider font-semibold opacity-60">
                      {Object.keys(skill)[0]}:
                    </span>{" "}
                    <SmallMono>{skill[Object.keys(skill)[0]]}</SmallMono>
                  </span>
                );
              }
              return <SmallMono key={i}>{skill}</SmallMono>;
            })}
          </InBetween>
        </div>
      )}
    </div>
  </>
);

const Positions = () => {
  const { positions } = React.useContext(ResumeContext);
  return (
    <>
      {positions.map((position, i) => (
        <div
          key={i}
          className="grid gap-2"
          style={{
            gridTemplateColumns: "repeat(1, 23ch minmax(0, 1fr))",
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
      <SmallMono>Education</SmallMono>
      <div>{education}</div>
    </div>
  );
};

const Footer = () => {
  const { ref, updated } = React.useContext(ResumeContext);
  return (
    <div className="flex justify-between">
      <SmallMono>{ref}</SmallMono>
      <SmallMono>Last Updated: {updated}</SmallMono>
    </div>
  );
};

const Page = ({ children }) => {
  // Letter size: 8.5 x 11 inches
  const LETTER_W = 8.5;
  const LETTER_H = 11;

  return (
    <div
      className="flex flex-col justify-between p-16 shadow-2xl"
      style={{
        width: "100vw",
        height: `${(100 * LETTER_H) / LETTER_W}vw`,
      }}
    >
      {children}
    </div>
  );
};

// --- Main component ---

export async function getStaticProps() {
  const yaml = require("js-yaml");
  const fs = require("fs");
  const doc = yaml.load(fs.readFileSync("./public/resume.yaml", "utf8"));
  const updated = fs.readFileSync("./public/updated-date.txt", "utf8")

  return {
    props: {
      doc: {...doc, updated},
    },
  };
}

function Home(props) {
  const { name, nameRest, updated } = props.doc;
  return (
    <>
      <Head>
        <title>{`${name}${nameRest} Resume - ${updated}`}</title>
      </Head>
      <ResumeContext.Provider value={props.doc}>
        <Page>
          <Header />
          <Hr />
          <Skills />
          <Hr />
          <Positions />
          <Education />
          <Hr />
          <Footer />
        </Page>
        <pre className="print:hidden">{JSON.stringify(props.doc, null, 2)}</pre>
      </ResumeContext.Provider>
    </>
  );
}

export default Home;
