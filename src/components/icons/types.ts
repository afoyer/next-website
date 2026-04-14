import type { ComponentType } from "react";
import type { Variants } from "motion/react";

export type IconProps = {
  className?: string;
  fill?: string;
  stroke?: string;
  size?: number | string;
  variants?: Variants;
};

export type Icon = ComponentType<IconProps>;
