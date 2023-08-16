import { Dispatch, FC, SetStateAction, useRef, useState } from "react";
import Footer from "Components/Footer/Footer";
import UserData from "Type/UserData.tsx";
import ProjectsPageData from "Type/ProjectsPageData.tsx";
import { updateProjectsPageText } from "./projectspageapi.tsx";
import ProjectCard from "./ProjectCard.tsx";
import AddProjectCard from "./AddProjectCard.tsx";
import { useSpring, animated } from "react-spring";
import ModeButtons from "Components/ModeButtons/ModeButtons.tsx";
import StatusBar from "Components/StatusBar/StatusBar.tsx";
import DeploymentBar from "Components/DeploymentBar/DeploymentBar.tsx";

const Projects: FC<{
  pageData: ProjectsPageData;
  setPageData: Dispatch<SetStateAction<ProjectsPageData>>;
  userData: UserData;
  setUserData: Dispatch<SetStateAction<UserData>>;
  deploying: boolean;
  deployed: { url: string; bool: boolean };
  setDeploying: (deploying: boolean) => void;
  setDeployed: (deployed: { url: string; bool: boolean }) => void;
}> = ({
  userData,
  setUserData,
  pageData,
  setPageData,
  deploying,
  setDeployed,
  setDeploying,
  deployed,
}) => {
  const [headerOneEdit, setHeaderOneEdit] = useState(false);
  const [headerOneEditValue, setHeaderOneEditValue] = useState(
    pageData.header_one
  );
  const headerOneTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [descriptionOneEdit, setDescriptionOneEdit] = useState(false);
  const [descriptionOneEditValue, setDescriptionOneEditValue] = useState(
    pageData.description_one
  );
  const descriptionOneTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [showError, setShowError] = useState<{
    visible: boolean;
    message: string;
  }>({ visible: false, message: "" });

  const headerAnimation = useSpring({
    from: { opacity: 0, transform: "translate3d(20px, 0, 0)" },
    to: { opacity: 1, transform: "translate3d(0, 0, 0)" },
    delay: 200,
  });

  const projectCardsAnimation = useSpring({
    from: { transform: "translate3d(0, 20px, 0)", opacity: 0 },
    to: { transform: "translate3d(0, 0, 0)", opacity: 1 },
    delay: 300,
  });

  const handleHeaderOneSubmit = async () => {
    const updateHeader = await updateProjectsPageText(
      "header_one",
      headerOneEditValue
    );
    if (updateHeader) {
      setPageData((prev) => ({ ...prev, header_one: headerOneEditValue }));
    }
    setHeaderOneEdit(false);
  };

  const handleDescriptionOneSubmit = async () => {
    const updateDescription = await updateProjectsPageText(
      "description_one",
      descriptionOneEditValue
    );
    if (updateDescription) {
      setPageData((prev) => ({
        ...prev,
        description_one: descriptionOneEditValue,
      }));
    }
    setDescriptionOneEdit(false);
  };

  return (
    <>
      <main>
        {showError.visible && (
          <StatusBar message={showError.message} color={"bg-red-400"} />
        )}
        <div className="container mx-auto my-20 max-w-screen-lg px-5">
          <section>
            <animated.div style={headerAnimation}>
              {headerOneEdit ? (
                <textarea
                  ref={headerOneTextareaRef}
                  value={headerOneEditValue}
                  onChange={(e) => setHeaderOneEditValue(e.target.value)}
                  onBlur={() => {
                    setHeaderOneEditValue(pageData.header_one);
                    setHeaderOneEdit(false);
                  }}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      await handleHeaderOneSubmit();
                    }
                  }}
                  className="mb-5 w-full resize-none appearance-none overflow-hidden border-none bg-transparent text-center text-3xl font-bold leading-snug outline-none focus:outline-none focus:ring-0 md:text-5xl lg:text-6xl"
                  autoFocus
                  onFocus={(e) => {
                    e.target.select();
                  }}
                  maxLength={25}
                />
              ) : (
                <h1
                  className="mb-5 cursor-pointer select-none text-center text-3xl font-bold leading-snug transition-all hover:opacity-50 md:text-5xl lg:text-6xl"
                  onClick={() => setHeaderOneEdit(true)}
                >
                  {pageData.header_one}
                </h1>
              )}
              {descriptionOneEdit ? (
                <textarea
                  ref={descriptionOneTextareaRef}
                  value={descriptionOneEditValue}
                  onChange={(e) => setDescriptionOneEditValue(e.target.value)}
                  onBlur={() => {
                    setDescriptionOneEditValue(pageData.description_one);
                    setDescriptionOneEdit(false);
                  }}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      await handleDescriptionOneSubmit();
                    }
                  }}
                  className="w-full resize-none appearance-none overflow-hidden border-none bg-transparent text-center text-lg leading-snug outline-none focus:outline-none focus:ring-0"
                  autoFocus
                  onFocus={(e) => e.currentTarget.select()}
                  maxLength={250}
                  rows={3}
                />
              ) : (
                <p
                  className="cursor-pointer select-none text-center font-semibold transition-all hover:opacity-50"
                  onClick={() => setDescriptionOneEdit(true)}
                >
                  {pageData.description_one}
                </p>
              )}
            </animated.div>
          </section>
        </div>
      </main>
      <section>
        <animated.div
          style={projectCardsAnimation}
          className="container mx-auto mb-5 px-5"
        >
          <div className="projects grid grid-cols-1 justify-items-center gap-5 md:grid-cols-2 lg:grid-cols-3">
            {userData.projects.map(
              ({ name, description, id, languages, image, slug }) => {
                return (
                  <ProjectCard
                    title={name}
                    description={description}
                    setUserData={setUserData}
                    image={image}
                    id={id}
                    key={id}
                    languages={languages}
                    slug={slug}
                    setShowError={setShowError}
                  />
                );
              }
            )}
            {userData.projects.length < 8 && (
              <AddProjectCard setUserData={setUserData} />
            )}
          </div>
        </animated.div>
      </section>
      <ModeButtons
        deploying={deploying}
        setDeploying={setDeploying}
        setDeployed={setDeployed}
        userData={userData}
        setUserData={setUserData}
      />
      {deploying && (
        <StatusBar
          message="Deploying! plz wait a few minutes..."
          color="bg-green-500"
        />
      )}
      {deployed.bool && (
        <DeploymentBar url={deployed.url} setDeployed={setDeployed} />
      )}
      <Footer />
    </>
  );
};

export default Projects;
