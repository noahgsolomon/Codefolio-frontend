import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "Components/Footer/Footer.tsx";
import { useSpring, animated } from "react-spring";
import HomeData from "Type/HomeData.tsx";
import UserData from "Type/UserData.tsx";
import { updateDescriptionOne, updateHeaderOne } from "./dashboardapi.tsx";
import SkillSection from "Components/Sections/SkillSection.tsx";
import StorySection from "Components/Sections/Story/StorySection.tsx";
import ResumeSection from "Components/Sections/ResumeSection.tsx";
import AnyPageData from "Type/AnyPageData.tsx";
import FAQSection from "Components/Sections/FAQSection.tsx";
import ValueSection from "Components/Sections/ValueSection.tsx";
import AddSection from "Components/AddSection/AddSection.tsx";
import { SectionType } from "Type/Section.tsx";

const Dashboard: React.FC<{
  pageData: HomeData;
  setPageData: React.Dispatch<SetStateAction<HomeData>>;
  userData: UserData;
}> = ({ pageData, userData, setPageData }) => {
  const navigate = useNavigate();
  const [headerOneEdit, setHeaderOneEdit] = useState(false);
  const [headerOneEditValue, setHeaderOneEditValue] = useState(
    pageData.headerOne
  );
  const [descriptionOneEdit, setDescriptionOneEdit] = useState(false);
  const [descriptionOneEditValue, setDescriptionOneEditValue] = useState(
    pageData.descriptionOne
  );
  const [imageOneEdit, setImageOneEdit] = useState(false);

  const [animationProps, setAnimation] = useSpring(() => ({
    opacity: 0,
    transform: "translate3d(0, -20px, 0)",
  }));
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    setAnimation.start({ opacity: 1, transform: "translate3d(0, 0px, 0)" });
  }, [navigate, setAnimation]);

  const headerOneTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const descriptionOneTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (headerOneEdit && headerOneTextareaRef.current) {
      headerOneTextareaRef.current.style.height = "auto";
      headerOneTextareaRef.current.style.height = `${headerOneTextareaRef.current.scrollHeight}px`;
    }
  }, [headerOneEdit, headerOneEditValue]);

  useEffect(() => {
    if (descriptionOneEdit && descriptionOneTextareaRef.current) {
      descriptionOneTextareaRef.current.style.height = "auto";
      descriptionOneTextareaRef.current.style.height = `${descriptionOneTextareaRef.current.scrollHeight}px`;
    }
  }, [descriptionOneEdit, descriptionOneEditValue]);

  const handleHeaderOneSubmit = async () => {
    const updateHeader = await updateHeaderOne(headerOneEditValue);
    if (updateHeader) {
      setPageData((prev) => ({ ...prev, headerOne: headerOneEditValue }));
      setHeaderOneEditValue(updateHeader);
    }
    setHeaderOneEdit(false);
  };

  const handleDescriptionOneSubmit = async () => {
    const updateDescription = await updateDescriptionOne(
      descriptionOneEditValue
    );
    if (updateDescription) {
      setPageData((prev) => ({
        ...prev,
        descriptionOne: descriptionOneEditValue,
      }));
      setDescriptionOneEditValue(updateDescription);
    }
    setHeaderOneEdit(false);
  };

  const fileInput = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImageLoading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    console.log(formData.get("file"));
    try {
      const response = await fetch(
        "http://localhost:8080/profile-image-upload",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        setImageLoading(false);
        return;
      }

      const data = await response.json();
      setPageData({
        ...pageData,
        profileImage: `${data.url}?timestamp=${new Date().getTime()}`,
      });
      setTimeout(() => setImageLoading(false), 500);
    } catch (error) {
      setImageLoading(false);
      console.error("Error uploading file: ", error);
    }
  };

  const allSectionTypes: SectionType[] = [
    "STORY",
    "RESUME",
    "SKILL",
    "FAQ",
    "VALUE",
  ] as SectionType[];

  const sectionList = pageData.sections.map((section) => section.type);

  const availableSectionTypes = allSectionTypes.filter(
      (t) => !sectionList.includes(t)
  );

  return (
    <>
      <animated.div style={animationProps}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row xl:mx-auto xl:justify-center">
            <div>
              <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center justify-center font-bold xl:mt-32">
                {headerOneEdit ? (
                  <textarea
                    ref={headerOneTextareaRef}
                    value={headerOneEditValue}
                    onChange={(e) => setHeaderOneEditValue(e.target.value)}
                    onBlur={() => {
                      setHeaderOneEditValue(pageData.headerOne);
                      setHeaderOneEdit(false);
                    }}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        await handleHeaderOneSubmit();
                      }
                    }}
                    className="font-extra-bold w-full resize-none appearance-none overflow-hidden border-none bg-transparent text-center text-4xl leading-snug outline-none focus:outline-none focus:ring-0 md:text-5xl md:leading-relaxed xl:text-left xl:text-6xl xl:leading-normal"
                    autoFocus
                    maxLength={50}
                  />
                ) : (
                  <h1
                    className="font-extra-bold max-w-[15ch] cursor-pointer select-none text-center text-4xl leading-snug transition-all hover:opacity-50 md:text-5xl md:leading-relaxed xl:text-left xl:text-6xl xl:leading-normal"
                    onClick={() => setHeaderOneEdit(true)}
                  >
                    {pageData.headerOne}
                  </h1>
                )}
                {descriptionOneEdit ? (
                  <textarea
                    ref={descriptionOneTextareaRef}
                    value={descriptionOneEditValue}
                    onChange={(e) => setDescriptionOneEditValue(e.target.value)}
                    onBlur={() => {
                      setDescriptionOneEditValue(pageData.descriptionOne);
                      setDescriptionOneEdit(false);
                    }}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        await handleDescriptionOneSubmit();
                        setDescriptionOneEdit(false);
                      }
                    }}
                    className="w-full resize-none appearance-none overflow-hidden border-none bg-transparent p-0 text-center text-base opacity-60 outline-none focus:outline-none focus:ring-0 xl:max-w-[50ch] xl:text-left"
                    autoFocus
                    maxLength={250}
                  />
                ) : (
                  <p
                    className="max-w-[35ch] cursor-pointer select-none text-center text-base opacity-60 transition-all hover:opacity-50 xl:max-w-[50ch] xl:text-left"
                    onClick={() => setDescriptionOneEdit(true)}
                  >
                    {pageData.descriptionOne}
                  </p>
                )}
              </div>
              <div className="mx-auto mt-5 flex justify-center xl:justify-start">
                <Link
                  to="/contact"
                  className="mr-4 rounded-xl border-2 border-black bg-black px-6 py-4 font-bold text-white transition-all hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-500"
                >
                  Get in touch
                </Link>
                <Link
                  to="/projects"
                  className="rounded-xl border-2 border-black px-6 py-4 font-bold transition-all hover:-translate-y-0.5 hover:bg-black hover:text-white"
                >
                  View Projects
                </Link>
              </div>
            </div>
            <div
              className={`relative mx-auto mt-10 transition-all lg:mx-0 xl:ml-20 xl:mt-32 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              onMouseEnter={() => setImageOneEdit(true)}
              onMouseLeave={() => setImageOneEdit(false)}
              onClick={() => fileInput.current && fileInput.current.click()}
            >
              <input
                type="file"
                ref={fileInput}
                className="hidden"
                accept=".jpg,.png"
                onChange={handleFileUpload}
              />
              <img
                className="rounded-3xl shadow-customHover"
                src={pageData.profileImage}
                alt="pfp"
              ></img>
              <div
                className={`absolute right-0 top-0 flex h-full w-full cursor-pointer items-center justify-center rounded-3xl border-8 border-dashed border-black bg-white p-2 text-3xl font-bold text-black transition-all ${
                  imageOneEdit ? "opacity-50" : "opacity-0"
                }`}
              >
                Drag or click to upload image
              </div>
            </div>
          </div>
        </div>
        {pageData.sections.map((section, index) => {
          const { type, details } = section;

          let sectionComponent;
          switch (type) {
            case "SKILL":
              sectionComponent = (
                <SkillSection
                  key={index}
                  userData={userData}
                  preview={false}
                  details={details}
                  setPageData={
                    setPageData as React.Dispatch<
                      React.SetStateAction<AnyPageData>
                    >
                  }
                  page={"HOME"}
                />
              );
              break;
            case "STORY":
              sectionComponent =
                "descriptionOne" in details &&
                "bulletOne" in details &&
                "bulletTwo" in details &&
                "bulletThree" in details &&
                "imageOne" in details ? (
                  <StorySection
                    page={"HOME"}
                    key={index}
                    details={details}
                    setPageData={
                      setPageData as React.Dispatch<
                        React.SetStateAction<AnyPageData>
                      >
                    }
                  />
                ) : null;
              break;
            case "RESUME":
              sectionComponent = (
                <ResumeSection
                  key={index}
                  page={"HOME"}
                  details={details}
                  setPageData={
                    setPageData as React.Dispatch<
                      React.SetStateAction<AnyPageData>
                    >
                  }
                  userData={userData}
                />
              );
              break;
            case "FAQ":
              sectionComponent =
                "descriptionOne" in details &&
                "headerOne" in details &&
                "faq" in details ? (
                  <FAQSection
                    setPageData={
                      setPageData as React.Dispatch<
                        React.SetStateAction<AnyPageData>
                      >
                    }
                    key={index}
                    page={"HOME"}
                    details={details}
                  />
                ) : null;
              break;
            case "VALUE":
              sectionComponent =
                "descriptionOne" in details &&
                "headerOne" in details &&
                "values" in details ? (
                  <ValueSection
                    setPageData={
                      setPageData as React.Dispatch<
                        React.SetStateAction<AnyPageData>
                      >
                    }
                    key={index}
                    page={"HOME"}
                    details={details}
                  />
                ) : null;
              break;
            default:
              sectionComponent = null;
          }

          return [
            <AddSection
              key={`add-${index}`}
              sections={availableSectionTypes}
              page={"HOME"}
              setPageData={
                setPageData as React.Dispatch<
                    React.SetStateAction<AnyPageData>
                >
              }
            />,
            sectionComponent,
          ];
        })}
        <AddSection
            setPageData={
              setPageData as React.Dispatch<
                  React.SetStateAction<AnyPageData>
              >
            }
            sections={availableSectionTypes}
            page={"HOME"}
        />
      </animated.div>
      <Footer />
    </>
  );
};
export default Dashboard;
