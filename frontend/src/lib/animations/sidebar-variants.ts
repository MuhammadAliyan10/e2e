import { Variants } from "framer-motion";

export const sidebarVariants: Variants = {
  expanded: {
    width: "13rem",
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 30,
    },
  },
  collapsed: {
    width: "4rem", // 72px
    transition: {
      type: "spring",
      stiffness: 350,
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
