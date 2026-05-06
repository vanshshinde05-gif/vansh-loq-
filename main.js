gsap.registerPlugin(ScrollTrigger);

// ==========================================
// SMOOTH SCROLLING (Lenis)
// ==========================================
const lenis = new Lenis({
    duration: 1.5, // Slightly longer duration for extra silkiness
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1.0,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Sync ScrollTrigger with Lenis
lenis.on('scroll', ScrollTrigger.update);

// ==========================================
// Navbar fade in on scroll
// ==========================================
lenis.on('scroll', (e) => {
    const nav = document.getElementById('navbar');
    if (e.animatedScroll > 100) {
        nav.style.opacity = '1';
    } else {
        nav.style.opacity = '0';
    }
});

// ==========================================
// Setup Initial States for text elements
// ==========================================
gsap.set(".content-left, .content-right, .content-center:not(#step-1 .content-center)", {
    opacity: 0,
    y: 50
});

// ==========================================
// Text Animation Sequences
// ==========================================
gsap.to("#step-1 .content-center", {
    opacity: 0,
    y: -50,
    scrollTrigger: {
        trigger: "#step-1",
        start: "top top",
        end: "bottom top",
        scrub: 1
    }
});

const textSections = [
    { trigger: "#step-2", target: "#step-2 .content-right" },
    { trigger: "#step-3", target: "#step-3 .content-left" },
    { trigger: "#step-4", target: "#step-4 .content-left" }
];

textSections.forEach(item => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: item.trigger,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        }
    });
    tl.to(item.target, { opacity: 1, y: 0, duration: 0.5 }, 0.2)
      .to(item.target, { opacity: 0, y: -50, duration: 0.5 }, 0.8);
});

gsap.to("#step-5 .content-center", {
    opacity: 1,
    y: 0,
    scrollTrigger: {
        trigger: "#step-5",
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1
    }
});

// ==========================================
// ULTIMATE SMOOTH VIDEO SCRUBBING (Up & Down)
// ==========================================
// This version uses a proxy-lerp technique.
// We animate a virtual time value with GSAP's scrub, 
// and then use the GSAP ticker to sync the video.
// This handles BOTH directions with buttery smoothness.
// ==========================================

const video = document.getElementById("hero-video");
let videoDuration = 0;
let isSeeking = false;

// Proxy object for GSAP to animate
let videoProxy = { time: 0 };

video.addEventListener('loadedmetadata', () => {
    videoDuration = video.duration;
    initVideoScrub();
});

// Track seeking state to prevent decoder thrashing
video.addEventListener('seeking', () => isSeeking = true);
video.addEventListener('seeked', () => isSeeking = false);

function initVideoScrub() {
    // Create the master scroll trigger for the video
    ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.8, // Slightly higher for extra silkiness at the end
        onUpdate: (self) => {
            // Update our proxy target time
            videoProxy.time = self.progress * videoDuration;
        }
    });

    // Use GSAP ticker for the highest possible update frequency (60fps+)
    gsap.ticker.add(() => {
        // Only update if the video isn't already busy seeking
        // and if the difference is enough to matter (> 16ms of video time)
        if (!isSeeking && Math.abs(video.currentTime - videoProxy.time) > 0.016) {
            video.currentTime = videoProxy.time;
        }
    });
}

// Fallback if metadata is already loaded
if (video.readyState >= 1) {
    videoDuration = video.duration;
    initVideoScrub();
}

video.pause();
