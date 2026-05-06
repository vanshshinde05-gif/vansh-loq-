gsap.registerPlugin(ScrollTrigger);

// Initial Hero Animations
gsap.from(".fade-up-anim", {
    opacity: 0,
    y: 30,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out",
    delay: 0.2
});

// Scroll Animations for sections
gsap.utils.toArray('.perf-section').forEach((section) => {
    
    // Elements sliding in from the left
    const slideLeft = section.querySelector('.slide-left-anim');
    if (slideLeft) {
        gsap.from(slideLeft, {
            opacity: 0,
            x: -50,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: section,
                start: "top 70%",
                toggleActions: "play none none reverse"
            }
        });
    }

    // Elements sliding in from the right
    const slideRight = section.querySelector('.slide-right-anim');
    if (slideRight) {
        gsap.from(slideRight, {
            opacity: 0,
            x: 50,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: section,
                start: "top 70%",
                toggleActions: "play none none reverse"
            }
        });
    }
});
