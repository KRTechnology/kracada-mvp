import { Metadata } from "next";
import CVUploadContent from "@/app/cv-optimization/upload/CVUploadContent";

export const metadata: Metadata = {
  title: "Upload CV - CV Optimization",
  description:
    "Upload your CV for professional optimization. Accepted formats: PDF and DOCX files.",
};

export default function CVUploadPage() {
  return <CVUploadContent />;
}
