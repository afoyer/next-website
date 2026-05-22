import { useGSAP } from "@gsap/react";
import { RefObject } from "react";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText)

export default function useColAnimation(ref: RefObject<HTMLElement | null>) {
    useGSAP(() => {
        const mm = gsap.matchMedia()
        mm.add("(min-width: 768px)", ()=>{
            const textElements = gsap.utils.toArray<HTMLElement>('.col-3 h1, .col-3 p')
            console.log(textElements)
        textElements.forEach(el => {
            const split = new SplitText(el, { type: 'lines', linesClass: 'line' })
            split.lines.forEach(line => {
                line.innerHTML = `<span>${line.textContent}</span>`
            })
        })
        gsap.set('.col-3 [data_id="col_content_wrapper_1"] .line span', { y: "0%" })
        gsap.set('.col-3 [data_id="col_content_wrapper_2"] .line span', { y: "-125%" })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '[class*="sticky-cols"]',
                start: "top top",
                end: "+=200%",
                pin: true,
                scrub: 1,
                markers: true,
                snap: { snapTo: [0,0.55, 1], duration: 0.2, delay: 0.1, ease: "power1.inOut" },
                invalidateOnRefresh:true,
            }
        })
        // STEP 1
        tl.to('.col_1', { opacity: 0, scale: 0.75 , delay: 0.2})
            .to('[class*="col_2"]', { x: "0%" }, "<")
            .to('[class*="col_3"]', { y: "0%" }, "<")
            .to('[class*="col_img_1"] img', { scale: 1.25 }, "<")
            .to('[class*="col_img_2"]', { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }, "<")
            .to('[class*="col_img_1"] img', { scale: 1 }, "<")
        // STEP 2
         tl.to('[class*="col_2"]', { opacity: 0, scale: 0.75 })
            .to('[class*="col_3"]', { x: "0%" }, "<")
            .to('[class*="col_4"]', { y: "0%" }, "<")
            .to('[class*="col_3"] [data_id="col_content_wrapper_1"] .line span', {y:'-125%'}, "<")
            .to('[class*="col_3"] [data_id="col_content_wrapper_2"] .line span', {y:'0%'}, "<")
   

        })
         })
}