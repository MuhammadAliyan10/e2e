import { TextHoverEffect } from "@/components/Global/text/text-hover-effect";
import { Timeline } from "@/components/Global/ui/timeline";
import React from "react";

const page = () => {
  const data = [
    {
      title: "About Synthly",
      content: (
        <div>
          <p className="mb-8 text-xs md:text-sm font-normal text-neutral-800 dark:text-neutral-200">
            Synthly is a cutting-edge platform designed for professionals and
            organizations to securely upload, analyze, and audit synthetic
            datasets. Using AI-powered algorithms, Synthly ensures your data is
            accurate, unbiased, and ready for critical decision-making.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <img
              src="/landing/how-its-work/Upload.jpg"
              alt="Upload data"
              className="h-32 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
            <img
              src="/landing/how-its-work/Audit.jpg"
              alt="AI audit"
              className="h-32 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "4-Step AI Audit Process",
      content: (
        <div>
          <p className="mb-8 text-xs md:text-sm font-normal text-neutral-800 dark:text-neutral-200">
            Synthly’s AI performs a comprehensive audit of your dataset in four
            structured steps, ensuring accuracy, fairness, and compliance:
          </p>
          <ul className="list-disc list-inside mb-8 text-xs md:text-sm text-neutral-800 dark:text-neutral-200 space-y-2">
            <li>
              📊 <strong>Bias Detection</strong> – Identify imbalances or skew
              that could impact AI model fairness.
            </li>
            <li>
              🔍 <strong>Data Integrity Check</strong> – Detect missing,
              inconsistent, or erroneous values.
            </li>
            <li>
              🧹 <strong>Noise & Outlier Analysis</strong> – Highlight unusual
              patterns or irrelevant data points.
            </li>
            <li>
              ✅ <strong>Compliance & Quality Review</strong> – Ensure datasets
              meet regulatory and organizational standards.
            </li>
          </ul>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/landing/how-its-work/Audit.jpg"
              alt="Audit process"
              className="h-32 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
            <img
              src="/landing/how-its-work/Chart.jpg"
              alt="Data quality"
              className="h-32 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Visualization & Insights",
      content: (
        <div>
          <p className="mb-8 text-xs md:text-sm font-normal text-neutral-800 dark:text-neutral-200">
            Once auditing is complete, Synthly generates detailed visualizations
            comparing <strong>Before</strong> and <strong>After</strong> states
            of your data. Interactive charts provide clear insights into
            improvements, making it easy to interpret results at a glance.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/landing/how-its-work/Chart.jpg"
              alt="Before audit"
              className="h-32 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
            <img
              src="/landing/how-its-work/Upload.jpg"
              alt="After audit"
              className="h-32 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Export Reports",
      content: (
        <div>
          <p className="mb-8 text-xs md:text-sm font-normal text-neutral-800 dark:text-neutral-200">
            After analysis, users can download a fully{" "}
            <strong>cleaned dataset</strong> or a comprehensive{" "}
            <strong>audit report</strong> summarizing all findings,
            improvements, and quality metrics. These reports are suitable for
            internal review or regulatory compliance.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/landing/how-its-work/Report.jpg"
              alt="Download dataset"
              className="h-32 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
            <img
              src="/landing/how-its-work/Audit.jpg"
              alt="Audit report"
              className="h-32 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <TextHoverEffect text="ABOUT" />
      <div className="relative w-full overflow-clip my-5">
        <Timeline data={data} />
      </div>
    </div>
  );
};

export default page;
