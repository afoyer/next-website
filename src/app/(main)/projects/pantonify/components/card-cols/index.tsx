"use client";

import Image from "next/image";
import { useRef } from "react";
import useColAnimation from "./animations";
import { pantonifyData } from "./data";
import styles from "./index.module.css";

const COL_GRADIENT =
	"bg-linear-to-tr from-zinc-200 to-zinc-300 dark:from-zinc-600 dark:to-zinc-700";

export default function CardCols() {
	const ref = useRef<HTMLElement>(null);
	useColAnimation(ref);
	return (
		<section
			ref={ref}
			className={`${styles.section} ${styles["sticky-cols"]} bg-linear-to-t from-zinc-300 to-white dark:from-zinc-800 dark:to-zinc-900 text-black dark:text-white`}
		>
			<div className={styles["sticky-cols-wrapper"]}>
				{/* COL 1 */}
				<div className={`${styles.col} col_1`}>
					<div className={`${styles.col_content_wrapper} ${COL_GRADIENT}`}>
						<div className={`${styles.col_content}`}>
							<h1 className={styles.heading}>{pantonifyData.introHeading}</h1>
							<p className={styles.subheading}>{pantonifyData.introSubHeading}</p>
						</div>
					</div>
				</div>
				{/* COL 2 */}
				<div className={`${styles.col} ${styles.col_2}`}>
					<div className={`${styles.col_img} ${styles.col_img_1}`} data-id="col-image-2">
						<div className={`${styles.col_img_wrapper} ${COL_GRADIENT}`}>
							<Image src={"/images/pantonify/mockup.png"} fill alt="Mockup" />
						</div>
					</div>
					<div className={`${styles.col_content} ${styles.col_img_2}`} data-id="col-image-2">
						<div className={`${styles.col_img_wrapper} ${COL_GRADIENT}`}></div>
					</div>
				</div>
				{/* COL 3 */}
				<div className={`${styles.col} ${styles.col_3} col-3`}>
					<div
						className={`${styles.col_content_wrapper} ${COL_GRADIENT}`}
						data-id="col_content_wrapper_1"
					>
						<h1>Process</h1>
					</div>
					<div className={`${styles.col_content_wrapper}`} data-id="col_content_wrapper_2">
						<p>
							Using libraries such next-auth, hex2pantone, and fast-average-color, Pantonify can
							analyze and display the nearest Pantone swatch code to a song’s album art using its
							average color.
						</p>
					</div>
				</div>
				{/* COL 4 */}
				<div className={`${styles.col} ${styles.col_4} `}>
					<div className={`${styles.col_img}`}>
						<div className={`${styles.col_img_wrapper} ${COL_GRADIENT}`}></div>
					</div>
				</div>
			</div>
		</section>
	);
}
