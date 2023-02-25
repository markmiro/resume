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

export default function FilePage(props) {
  return (
    <div>
      Props:
      <pre>{JSON.stringify(props.doc, null, 2)}</pre>
    </div>
  );
}
