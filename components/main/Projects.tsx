import React from "react";
import ProjectCard from "../sub/ProjectCard";

const Projects = () => {
  return (
    <div
      className="flex flex-col items-center justify-center py-20"
      id="projects"
    >
      <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-20">
        The Power Behind Moh
      </h1>
      <div className="h-full w-full flex flex-col md:flex-row gap-10 px-10">
        <ProjectCard
          src="/anteraction_moh.jpg"
          title="Transforming AI into Meaningful Conversations"
          description="Moh AI is an advanced chatbot designed to understand emotions, analyze relationships, and provide insightful advice."
        />
        <ProjectCard
          src="/mohimg1.jpg"
          title="Bringing Conversations to Life"
          description="Our chatbot UI is built for smooth, responsive, and real-time interactions with users."
        />
        <ProjectCard
          src="/mohimg2.jpg"
          title="The Brain Behind Moh"
          description="We use Artificial Intelligence and Machine Learning to ensure accuracy snd insightful responses."
        />
      </div>
    </div>
  );
};

export default Projects;
