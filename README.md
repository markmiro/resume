# Mark Miro Resume

Resume built with Next.js and Tailwind CSS, and deployed on Vercel as a static site.

It's generated from [this](public/resume.yaml) yaml file.

Why? Because I originally designed my resume in Figma [here](https://www.figma.com/proto/9oouBQk4moAYiRfx9MUriI/Mark-Mironyuk-Resume?page-id=0%3A1&node-id=680%3A5892&viewport=386%2C458%2C0.08&scaling=min-zoom), but the PDF export creates files that are multiple megabytes in size. The exported version of my new [resume](public/Mark-Mironyuk-Resume-Feb-24-2023-09_50-PM.pdf) is 175kb.

I've tested printing and exporting to PDF with Chrome on macOS. It doesn't work well with Safari (iOS and macOS).

I've tried printing in Safari on both iOS and macOS and the results are not as good.

Deployed at:
   [markmiro-resume.vercel.app](https://markmiro-resume.vercel.app/)

---

To run this application:

```
npm run dev
```

Before commiting, run:

```
npm run precommit
```
