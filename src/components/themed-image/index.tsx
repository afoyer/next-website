import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type ThemedImageProps = Omit<ImageProps, "src"> & {
	/** Image shown while the light theme is active. */
	lightSrc: string;
	/** Image shown while the dark theme is active. */
	darkSrc: string;
};

/**
 * Renders both variants and lets the `data-theme` attribute decide which one is
 * visible, so the swap happens instantly with the theme toggle and there is no
 * hydration mismatch (the server does not know the user's theme).
 */
export function ThemedImage({ lightSrc, darkSrc, className, alt, ...rest }: ThemedImageProps) {
	return (
		<>
			<Image {...rest} alt={alt} src={lightSrc} className={cn(className, "dark:hidden")} />
			<Image
				{...rest}
				alt={alt}
				src={darkSrc}
				className={cn(className, "hidden dark:block")}
				aria-hidden
			/>
		</>
	);
}
