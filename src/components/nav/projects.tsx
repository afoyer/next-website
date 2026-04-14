import { StorageImage } from "../StorageImage";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";

export type Project = {
  title: string;
  image: string;
  gif?: string;
  link: string;
};

const containerVariants = {
  open: {
    opacity: 1,
    display: "grid",
    transition: {
      duration: 0.2,
      staggerChildren: 0.1,
    },
  },
  closed: {
    opacity: 0,
    display: "none",
    transition: {
      duration: 0.2,
    },
  },
};

const itemVariants = {
  open: (isCurrentProject: boolean) => ({
    opacity: 1,
    y: 0,
    color: isCurrentProject ? "var(--nav-icon-focused)" : "var(--nav-icon)",
  }),
  closed: {
    opacity: 0,
    y: 20,
  },
};

export default function Projects({
  isOpen,
  projects,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  position: "top" | "bottom";
  projects: Project[];
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      style={{
        gridTemplateColumns: `repeat(${projects.length}, minmax(0, 1fr))`,
      }}
      className={`projects grid grid-cols-4  items-center justify-center absolute my-2 bottom-full left-0 gap-4 w-full px-12 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      {projects.map((project, index) => (
        <ProjectItem
          key={project.title + index}
          project={project}
          setIsOpen={setIsOpen}
        />
      ))}
    </motion.div>
  );
}

function ProjectItem({
  project,
  setIsOpen,
}: {
  project: Project;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const pathname = usePathname();
  const [showGif, setShowGif] = useState(false);
  const [hoverKey, setHoverKey] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isCurrentPage = pathname === project.link;
  const baseOpacity = isCurrentPage ? 1 : 0.6;
  const isVideo = !!project.gif && /\.(mp4|webm)$/i.test(project.gif);

  const handleMouseEnter = () => {
    if (!project.gif) return;
    if (isVideo) {
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
        video.play();
      }
    } else {
      setHoverKey((k) => k + 1);
    }
    setShowGif(true);
  };

  const handleMouseLeave = () => {
    setShowGif(false);
  };

  return (
    <motion.div
      whileHover={{ color: "var(--nav-accent)" }}
      variants={itemVariants}
      custom={isCurrentPage}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative project-item rounded-2xl overflow-clip w-full aspect-3/2 hover:cursor-pointer ${isCurrentPage ? "pointer-events-none" : "pointer-events-auto"} backdrop-blur-sm`}
    >
      <Link
        href={project.link}
        className="relative block w-full h-full"
        onClick={() => setIsOpen(false)}
      >
        <h1 className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold z-11 w-full text-center pointer-events-none">
          {project.title}
        </h1>

        {/* Static image — fades out when video is playing */}
        {project.image.startsWith("/") ? (
          <Image
            src={project.image}
            alt={project.title}
            loading="eager"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            style={{
              opacity: showGif ? 0 : baseOpacity,
              transition: "opacity 0.3s ease",
            }}
          />
        ) : (
          <StorageImage
            storagePath={project.image}
            alt={project.title}
            loading="eager"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            style={{
              opacity: showGif ? 0 : baseOpacity,
              transition: "opacity 0.3s ease",
            }}
          />
        )}

        {/* Animated overlay — fades in on hover */}
        {project.gif && (isVideo ? (
          // mp4/webm: loop=false, onEnded fades back to static
          <video
            ref={videoRef}
            src={project.gif}
            muted
            playsInline
            preload="auto"
            onEnded={() => setShowGif(false)}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: showGif ? baseOpacity : 0,
              transition: "opacity 0.3s ease",
            }}
          />
        ) : (
          // gif: key remount resets playback on each hover
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={hoverKey}
            src={project.gif}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: showGif ? baseOpacity : 0,
              transition: "opacity 0.3s ease",
            }}
          />
        ))}
      </Link>
    </motion.div>
  );
}
