import { TextHoverEffect } from "@/components/Global/text/text-hover-effect";
import { Timeline } from "@/components/Global/ui/timeline";
import React from "react";

const page = () => {
  const data = [
    {
      title: "Step 1: Upload Your Dataset",
      content: (
        <div>
          <p className="mb-8 text-xs md:text-sm font-normal text-neutral-800 dark:text-neutral-200">
            Start by securely uploading your synthetic dataset to Synthly. Our
            platform supports multiple file formats and ensures your data
            remains confidential throughout the process.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <img
              src="/landing/how-its-work/Upload.jpg"
              alt="Upload data"
              className="h-32 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
            <img
              src="/landing/how-its-work/Audit.jpg"
              alt="Secure upload"
              className="h-32 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Step 2: AI-Powered Audit",
      content: (
        <div>
          <p className="mb-8 text-xs md:text-sm font-normal text-neutral-800 dark:text-neutral-200">
            Synthly AI analyzes your dataset through a structured four-step
            audit process to ensure accuracy, consistency, and fairness.
          </p>
          <ul className="list-disc list-inside mb-8 text-xs md:text-sm text-neutral-800 dark:text-neutral-200 space-y-2">
            <li>
              📊 <strong>Bias Detection</strong> – Identify imbalances or skew
              in the dataset.
            </li>
            <li>
              🔍 <strong>Data Integrity Check</strong> – Detect missing,
              inconsistent, or erroneous values.
            </li>
            <li>
              🧹 <strong>Noise & Outlier Analysis</strong> – Highlight unusual
              patterns or irrelevant entries.
            </li>
            <li>
              ✅ <strong>Compliance & Quality Review</strong> – Ensure datasets
              meet organizational and regulatory standards.
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
              alt="Audit results"
              className="h-32 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Step 3: Visualize & Analyze",
      content: (
        <div>
          <p className="mb-8 text-xs md:text-sm font-normal text-neutral-800 dark:text-neutral-200">
            Once the audit is complete, Synthly generates intuitive
            visualizations comparing the <strong>original</strong> and{" "}
            <strong>cleaned</strong> dataset. Interactive charts make it easy to
            understand improvements and identify key insights.
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
      title: "Step 4: Export Reports",
      content: (
        <div>
          <p className="mb-8 text-xs md:text-sm font-normal text-neutral-800 dark:text-neutral-200">
            After reviewing the audit results, you can download a fully{" "}
            <strong>cleaned dataset</strong> or a detailed{" "}
            <strong>audit report</strong>. These reports provide a clear summary
            of findings, improvements, and quality metrics for internal or
            regulatory use.
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
      <TextHoverEffect text="HOW IT WORKS" />
      <div className="relative w-full overflow-clip my-5 -mt-40">
        <Timeline data={data} />
      </div>
    </div>
  );
};

export default page;
