import { Variants } from "framer-motion";

export const sidebarVariants: Variants = {
  expanded: {
    width: "16rem", // 256px
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  collapsed: {
    width: "4rem", // 64px
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

export const navItemVariants: Variants = {
  expanded: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  collapsed: {
    opacity: 0,
    x: -10,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

export const sectionVariants: Variants = {
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};
