import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ChatWindow from "./ChatWindow";
const tiaBotIcon = "/assets/tia-bot.webp";

type Emotion =
  | "happy"       // opens chatbot, clicks head, success
  | "thinking"    // AI is preparing response
  | "speaking"    // AI is streaming response
  | "confused"    // clicked head (hehe), invalid input, or dragging
  | "curious"     // cursor proximity (< 150px)
  | "sleepy"      // inactive for 30s+
  | "celebrating" // form successfully submitted
  | "focused"     // stayed on Services page
  | "listening"   // chatbot open but idle
  | "welcome"     // first visit walk in
  | "goodbye"     // chatbot closes
  | "idle";       // default state

const TiaChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOnboardingActive, setIsOnboardingActive] = useState(() => !localStorage.getItem("tia_onboarding_complete"));
  const location = useLocation();

  // Emotion and animation states
  const [emotion, setEmotion] = useState<Emotion>(() => {
    const welcomeSeen = localStorage.getItem("tia_welcome_seen");
    return welcomeSeen ? "idle" : "welcome";
  });
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [headTilt, setHeadTilt] = useState(0);
  const [mascotWalkOffset, setMascotWalkOffset] = useState(0);
  const [mascotYOffset, setMascotYOffset] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [thinkingFrame, setThinkingFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const mascotRef = useRef<HTMLDivElement>(null);
  const lastActivityTime = useRef(Date.now());
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(window.scrollY);
  const lastScrollTime = useRef(Date.now());
  const mascotCenter = useRef<{ x: number; y: number } | null>(null);

  // Exclude admin pages from rendering the chatbot
  const isAdminPage = location.pathname.startsWith("/admin");

  // 1. Inactivity tracking & waking
  useEffect(() => {
    const handleActivity = () => {
      lastActivityTime.current = Date.now();
      // If sleeping, wake up!
      setEmotion((prev) => {
        if (prev === "sleepy") {
          return isOpen ? "listening" : "idle";
        }
        return prev;
      });
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("scroll", handleActivity);

    const inactivityInterval = setInterval(() => {
      if (isOpen) return; // Don't sleep if chat window is open

      const elapsed = Date.now() - lastActivityTime.current;
      setEmotion((prev) => {
        if (prev !== "idle" && prev !== "sleepy" && prev !== "curious") return prev;

        if (elapsed >= 30000) {
          return "sleepy";
        } else if (elapsed >= 8000 && elapsed < 9200 && prev === "idle") {
          handlePeekSequence();
        }
        return prev;
      });
    }, 1000);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      clearInterval(inactivityInterval);
    };
  }, [isOpen]);

  // Peek sequence helper
  const handlePeekSequence = () => {
    // Step down
    setMascotYOffset(70);
    setTimeout(() => {
      // Slide up slightly
      setMascotYOffset(30);
      setEyeOffset({ x: -3, y: 0 }); // Look left
      
      setTimeout(() => {
        setEyeOffset({ x: 3, y: 0 }); // Look right
        
        setTimeout(() => {
          setEyeOffset({ x: 0, y: 0 });
          // Go back down
          setMascotYOffset(70);
          
          setTimeout(() => {
            // Return to normal
            setMascotYOffset(0);
          }, 600);
        }, 1200);
      }, 1200);
    }, 600);
  };

  // 2. High-fidelity Idle Sequence (Every 6-8 seconds: Blink -> Look Left -> Look Right -> Smile -> Idle)
  useEffect(() => {
    if (isOpen || emotion !== "idle") return;

    const interval = setInterval(() => {
      // 1. Blink
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);

        // 2. Look Left
        setEyeOffset({ x: -3.5, y: 0 });
        setTimeout(() => {
          // 3. Look Right
          setEyeOffset({ x: 3.5, y: 0 });
          setTimeout(() => {
            // 4. Center & Smile
            setEyeOffset({ x: 0, y: 0 });
            setEmotion("happy");
            
            setTimeout(() => {
              setEmotion("idle");
            }, 1200);
          }, 900);
        }, 900);
      }, 150);
    }, 7000); // Trigger every 7 seconds

    return () => clearInterval(interval);
  }, [isOpen, emotion]);

  // 3. Scroll velocity listener (rapid scrolling reaction)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const dy = Math.abs(currentScrollY - lastScrollY.current);
      const dt = currentTime - lastScrollTime.current;

      if (dt > 0) {
        const velocity = dy / dt;
        if (velocity > 3.0 && emotion === "idle" && !isOpen) {
          setEmotion("confused");
          if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
          scrollTimeout.current = setTimeout(() => {
            setEmotion("idle");
          }, 1500);
        }
      }

      lastScrollY.current = currentScrollY;
      lastScrollTime.current = currentTime;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [emotion, isOpen]);

  // 4. Mouse Proximity tracking (eyes follow and head tilts)
  useEffect(() => {
    // Reset cached center when state changes (e.g. mascot toggled or drag ended)
    mascotCenter.current = null;

    const handleResize = () => {
      mascotCenter.current = null;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (isOpen || isDragging || emotion === "welcome" || emotion === "sleepy" || emotion === "goodbye" || emotion === "celebrating" || emotion === "thinking" || emotion === "speaking") {
        return;
      }

      if (!mascotCenter.current) {
        if (!mascotRef.current) return;
        const rect = mascotRef.current.getBoundingClientRect();
        mascotCenter.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
      }

      const mascotCenterX = mascotCenter.current.x;
      const mascotCenterY = mascotCenter.current.y;

      const dx = e.clientX - mascotCenterX;
      const dy = e.clientY - mascotCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        setEmotion("curious");
        // Eye offset coordinates relative to mouse direction (clamped)
        const pupilX = (dx / dist) * Math.min(dist / 20, 3.5);
        const pupilY = (dy / dist) * Math.min(dist / 20, 3.5);
        setEyeOffset({ x: pupilX, y: pupilY });

        // Tiny head tilt (clamped)
        const tilt = (dx / dist) * Math.min(dist / 25, 6);
        setHeadTilt(tilt);
      } else {
        if (emotion === "curious") {
          setEmotion("idle");
          setEyeOffset({ x: 0, y: 0 });
          setHeadTilt(0);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isOpen, isDragging, emotion]);

  // 5. Page context awareness (focused reading on Services pages)
  useEffect(() => {
    if (isOpen) return;

    if (location.pathname.startsWith("/services")) {
      if (emotion === "idle") {
        setEmotion("focused");
        setEyeOffset({ x: 0, y: -3.5 }); // Look up
        setHeadTilt(-3); // Tilt head up slightly
      }
    } else {
      if (emotion === "focused") {
        setEmotion("idle");
        setEyeOffset({ x: 0, y: 0 });
        setHeadTilt(0);
      }
    }
  }, [location.pathname, emotion, isOpen]);

  // 6. Blink cycle interval
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (emotion === "sleepy" || emotion === "idle") return; // Idle has its own sequence
      
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(blinkInterval);
  }, [emotion]);

  // 7. Thinking frame cycle interval
  useEffect(() => {
    if (emotion !== "thinking") return;

    const interval = setInterval(() => {
      setThinkingFrame((prev) => (prev + 1) % 3);
    }, 350);

    return () => clearInterval(interval);
  }, [emotion]);

  // 8. ChatWindow Event Listeners
  useEffect(() => {
    const handleOpened = () => {
      setIsOpen(true);
      setEmotion("happy");
      setTimeout(() => setEmotion("listening"), 2000);
    };

    const handleClosed = () => {
      setIsOpen(false);
      setEmotion("goodbye");
      setTimeout(() => setEmotion("idle"), 1000);
    };

    const handleThinkingStart = () => {
      setEmotion("thinking");
    };

    const handleSpeakingStart = () => {
      setEmotion("speaking");
    };

    const handleThinkingStop = () => {
      setEmotion("listening");
    };

    const handleSuccess = () => {
      setEmotion("celebrating");
      setBubbleText("✨ Quotation Ready! ✨");
      setTimeout(() => {
        setBubbleText(null);
        setEmotion("idle");
      }, 4000);
    };

    const handleOnboardingStart = () => setIsOnboardingActive(true);
    const handleOnboardingComplete = () => setIsOnboardingActive(false);

    window.addEventListener("tia-chatbot-opened", handleOpened);
    window.addEventListener("tia-chatbot-closed", handleClosed);
    window.addEventListener("tia-chatbot-thinking-start", handleThinkingStart);
    window.addEventListener("tia-chatbot-speaking-start", handleSpeakingStart);
    window.addEventListener("tia-chatbot-thinking-stop", handleThinkingStop);
    window.addEventListener("tia-chatbot-success", handleSuccess);
    window.addEventListener("tia-chatbot-onboarding-start", handleOnboardingStart);
    window.addEventListener("tia-chatbot-onboarding-complete", handleOnboardingComplete);

    return () => {
      window.removeEventListener("tia-chatbot-opened", handleOpened);
      window.removeEventListener("tia-chatbot-closed", handleClosed);
      window.removeEventListener("tia-chatbot-thinking-start", handleThinkingStart);
      window.removeEventListener("tia-chatbot-speaking-start", handleSpeakingStart);
      window.removeEventListener("tia-chatbot-thinking-stop", handleThinkingStop);
      window.removeEventListener("tia-chatbot-success", handleSuccess);
      window.removeEventListener("tia-chatbot-onboarding-start", handleOnboardingStart);
      window.removeEventListener("tia-chatbot-onboarding-complete", handleOnboardingComplete);
    };
  }, []);

  // 9. First visit welcome sequence
  useEffect(() => {
    const welcomeSeen = localStorage.getItem("tia_welcome_seen");
    if (!welcomeSeen) {
      setEmotion("welcome");
      // Start slightly offscreen to the right
      setMascotWalkOffset(120);

      const walkTimer = setTimeout(() => {
        setMascotWalkOffset(0);
        setBubbleText("Hi! I'm TIA AI. Need help? 👋");
        
        const resetTimer = setTimeout(() => {
          setBubbleText(null);
          setEmotion("idle");
          localStorage.setItem("tia_welcome_seen", "true");
        }, 4500);

        return () => clearTimeout(resetTimer);
      }, 1000);

      return () => clearTimeout(walkTimer);
    }
  }, []);

  // Drag handlers
  const handleDragStart = () => {
    setIsDragging(true);
    setEmotion("confused");
    setBubbleText("Whoa! 😲");
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setEmotion("idle");
    setBubbleText(null);
  };

  // Chat window toggle with micro-animations
  const handleBodyClick = () => {
    if (isDragging) return;
    if (isOpen) {
      setIsOpen(false);
      setEmotion("goodbye");
      setTimeout(() => setEmotion("idle"), 1000);
    } else {
      // 1. Smile & Excitement
      setEmotion("happy");
      setBubbleText("Let's chat! 🚀");
      
      // 2. Wave & Float Upwards delay (800ms)
      setTimeout(() => {
        setIsOpen(true);
        setBubbleText(null);
      }, 850);
    }
  };

  // Eye component renderer
  const renderEye = (side: "left" | "right") => {
    if (isBlinking || emotion === "sleepy") {
      return (
        <div 
          className="w-2.5 h-0.5 bg-[#c084fc] rounded-full shadow-[0_0_6px_#a855f7]"
          style={{
            transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
            transition: "transform 0.1s ease-out"
          }}
        />
      );
    }

    if (emotion === "thinking") {
      if (thinkingFrame === 0) {
        return (
          <div 
            className="w-3 h-3 bg-[#c084fc] rounded-full shadow-[0_0_8px_#a855f7]"
            style={{
              transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
              transition: "transform 0.15s ease-out"
            }}
          />
        );
      } else if (thinkingFrame === 1) {
        return (
          <div 
            className="w-3 h-3 border-2 border-[#c084fc] rounded-full relative overflow-hidden shadow-[0_0_8px_#a855f7]"
            style={{
              transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
              transition: "transform 0.15s ease-out"
            }}
          >
            <div className="absolute top-0 left-0 w-1/2 h-full bg-[#c084fc]" />
          </div>
        );
      } else {
        return (
          <div 
            className="w-3 h-3 border-2 border-[#c084fc] bg-transparent rounded-full shadow-[0_0_6px_#a855f7]"
            style={{
              transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
              transition: "transform 0.15s ease-out"
            }}
          />
        );
      }
    }

    if (emotion === "happy" || emotion === "celebrating" || emotion === "welcome" || isHovered) {
      return (
        <svg 
          style={{
            transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
            transition: "transform 0.15s ease-out"
          }}
          viewBox="0 0 10 10" 
          className="w-3.5 h-3 text-[#d8b4fe] drop-shadow-[0_0_4px_#a855f7]"
        >
          <path d="M 1 7 A 4 4 0 0 1 9 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      );
    }

    if (emotion === "confused" && side === "right") {
      return (
        <div className="relative">
          <div className="absolute -top-2.5 left-[-2px] w-3.5 h-0.5 bg-[#c084fc] rotate-[20deg] shadow-[0_0_4px_#a855f7]" />
          <div 
            className="w-2.5 h-4 bg-[#c084fc] rounded-full shadow-[0_0_8px_#a855f7]"
            style={{
              transform: `translate(${eyeOffset.x}px, ${eyeOffset.y - 2.5}px)`,
              transition: "transform 0.15s ease-out"
            }}
          />
        </div>
      );
    }

    if (emotion === "focused") {
      return (
        <div 
          className="w-2.5 h-2.5 bg-[#c084fc] rounded-full shadow-[0_0_8px_#a855f7]"
          style={{
            transform: `translate(${eyeOffset.x}px, ${eyeOffset.y - 2.5}px)`,
            transition: "transform 0.15s ease-out"
          }}
        />
      );
    }

    return (
      <div 
        className="w-2.5 h-4 bg-[#c084fc] rounded-full shadow-[0_0_8px_#a855f7,0_0_15px_#d8b4fe]"
        style={{
          transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
          transition: "transform 0.15s ease-out"
        }}
      />
    );
  };

  // Mouth component renderer
  const renderMouth = () => {
    if (emotion === "speaking") {
      return (
        <motion.svg 
          animate={{ scaleY: [1, 0.3, 1.2, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 0.45, ease: "linear" }}
          viewBox="0 0 10 6" 
          className="w-3.5 h-2 text-[#d8b4fe] drop-shadow-[0_0_3px_#a855f7] origin-center"
        >
          <path d="M 1 1 Q 5 5 9 1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </motion.svg>
      );
    }

    if (emotion === "happy" || emotion === "celebrating" || emotion === "welcome" || isHovered) {
      return (
        <svg viewBox="0 0 10 6" className="w-3.5 h-2 text-[#d8b4fe] drop-shadow-[0_0_3px_#a855f7]">
          <path d="M 1 1 Q 5 5 9 1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    }

    if (emotion === "sleepy") {
      return (
        <svg viewBox="0 0 6 6" className="w-1.5 h-1.5 text-[#d8b4fe] drop-shadow-[0_0_2px_#a855f7]">
          <circle cx="3" cy="3" r="1.5" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      );
    }

    if (emotion === "confused") {
      return (
        <svg viewBox="0 0 10 6" className="w-3.5 h-2 text-[#d8b4fe] drop-shadow-[0_0_2px_#a855f7]">
          <path d="M 2 4 Q 4 1 6 4 T 8 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    }

    return (
      <svg viewBox="0 0 10 4" className="w-3 h-1 text-[#d8b4fe] drop-shadow-[0_0_2px_#a855f7]">
        <path d="M 2 2 L 8 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  };

  // Outer container positioning animations (snapped, walk, float up, entrance)
  const mascotAnimate: Record<string, string | number> = {
    x: mascotWalkOffset,
    y: isOpen ? 0 : mascotYOffset, // stays in position when chat opens below
    scale: 1,
    rotate: isHovered ? -4 : headTilt,
    opacity: emotion === "goodbye" ? 0 : 1,
  };
  
  const mascotTransition: Record<string, string | number> = {
    type: "spring",
    stiffness: 160,
    damping: 15,
  };

  if (emotion === "goodbye") {
    mascotAnimate.y = mascotYOffset + 120;
    mascotTransition.duration = 0.5;
    mascotTransition.ease = "easeIn";
  }

  if (isAdminPage) {
    return null;
  }

  const showMascot = !isOpen;

  return (
    <>
      {/* Mascot Wrapper (Positioned at bottom-right above the WhatsApp button) */}
      {showMascot && (
        <div 
          ref={mascotRef}
          className="fixed bottom-24 right-3 sm:bottom-28 sm:right-5 z-30 flex flex-col items-center pointer-events-none select-none p-3 overflow-visible"
        >
        {/* Dialogue Bubble */}
        <AnimatePresence>
          {bubbleText && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              className="mb-4 bg-card/95 border border-border text-foreground px-3.5 py-2 rounded-2xl shadow-xl text-xs font-semibold whitespace-nowrap pointer-events-auto flex items-center gap-1.5 backdrop-blur-sm z-50 select-text"
            >
              <span>{bubbleText}</span>
              <div className="absolute top-[96%] left-1/2 -translate-x-1/2 w-3 h-3 bg-card border-r border-b border-border rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zzz floating bubbles */}
        {emotion === "sleepy" && (
          <div className="absolute bottom-[100px] left-4 flex flex-col pointer-events-none select-none z-45">
            <span className="animate-sleep-z1 text-[10px] font-bold text-[#c084fc]/60">z</span>
            <span className="animate-sleep-z2 text-xs font-bold text-[#c084fc]/85 ml-2.5 -mt-1">z</span>
            <span className="animate-sleep-z3 text-sm font-bold text-[#c084fc] ml-5 -mt-1">Z</span>
          </div>
        )}

        {/* Outer Container (Spring Entrance, snaps back from drags) */}
        <motion.div
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.35}
          dragTransition={{ bounceStiffness: 140, bounceDamping: 12 }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={mascotAnimate}
          transition={mascotTransition}
          onClick={handleBodyClick}
          className={`w-16 h-20 sm:w-20 sm:h-24 relative pointer-events-auto flex flex-col items-center justify-end overflow-visible ${
            emotion === "sleepy" ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"
          }`}
        >
          {/* Inner Container (Idle breathing, local scale, particles) */}
          <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            animate={
              emotion === "thinking"
                ? { y: [0, -5, 0], scale: 1 }
                : emotion === "speaking"
                ? { y: [0, -2, 0], scale: 1 }
                : isHovered
                ? { scale: 1.06 }
                : emotion === "celebrating"
                ? { y: [0, -18, 0, -12, 0] }
                : emotion === "sleepy"
                ? { y: 6, scale: 0.92 }
                : { y: [0, -3, 0], scaleY: [1, 1.015, 1] }
            }
            transition={
              emotion === "thinking"
                ? { y: { repeat: Infinity, duration: 1.8, ease: "easeInOut" } }
                : emotion === "speaking"
                ? { y: { repeat: Infinity, duration: 1.4, ease: "easeInOut" } }
                : isHovered
                ? { type: "spring", stiffness: 200, damping: 10 }
                : emotion === "celebrating"
                ? { duration: 0.8, ease: "easeInOut" }
                : emotion === "sleepy"
                ? { duration: 0.3 }
                : {
                    y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                    scaleY: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                  }
            }
            style={{
              filter: isHovered 
                ? "drop-shadow(0 0 15px rgba(168,85,247,0.5))" 
                : emotion === "celebrating"
                ? "drop-shadow(0 0 20px rgba(168,85,247,0.75))"
                : "none",
            }}
            className="w-16 h-16 sm:w-20 sm:h-20 relative flex items-center justify-center bg-transparent overflow-visible"
          >
            {/* Soft Backing Glow */}
            <div className="absolute inset-0 rounded-full bg-purple-500/5 blur-[8px] pointer-events-none" />

            {/* Particles (Thinking state) */}
            {emotion === "thinking" && (
              <div className="absolute inset-0 pointer-events-none overflow-visible">
                <motion.div 
                  initial={{ x: -10, y: 30, opacity: 0, scale: 0.3 }}
                  animate={{ x: -20, y: -20, opacity: [0, 0.8, 0], scale: 1 }}
                  transition={{ repeat: Infinity, duration: 1.6, delay: 0 }}
                  className="absolute w-1.5 h-1.5 rounded-full bg-[#a855f7] shadow-[0_0_6px_#c084fc]"
                />
                <motion.div 
                  initial={{ x: 20, y: 25, opacity: 0, scale: 0.3 }}
                  animate={{ x: 30, y: -15, opacity: [0, 0.8, 0], scale: 0.8 }}
                  transition={{ repeat: Infinity, duration: 1.8, delay: 0.4 }}
                  className="absolute w-1 h-1 rounded-full bg-[#c084fc] shadow-[0_0_4px_#d8b4fe]"
                />
                <motion.div 
                  initial={{ x: -25, y: 15, opacity: 0, scale: 0.3 }}
                  animate={{ x: -15, y: -25, opacity: [0, 0.8, 0], scale: 1 }}
                  transition={{ repeat: Infinity, duration: 1.4, delay: 0.8 }}
                  className="absolute w-1 h-1 rounded-full bg-[#d8b4fe] shadow-[0_0_4px_#c084fc]"
                />
                <motion.div 
                  initial={{ x: 15, y: 10, opacity: 0, scale: 0.3 }}
                  animate={{ x: 25, y: -30, opacity: [0, 0.8, 0], scale: 1.2 }}
                  transition={{ repeat: Infinity, duration: 2.0, delay: 1.2 }}
                  className="absolute w-1.5 h-1.5 rounded-full bg-[#a855f7] shadow-[0_0_6px_#a855f7]"
                />
              </div>
            )}

            {/* Robot Image Base */}
            <img src={tiaBotIcon} alt="TIA Mascot" className="w-full h-full object-cover select-none bg-transparent" width={64} height={64} />

            {/* Dynamic Visor Overlay Screen */}
            <div className="absolute top-[28%] left-[17%] w-[66%] h-[34%] rounded-[30%] bg-[#08070d] flex flex-col items-center justify-between p-[9%_12%] overflow-hidden z-10 pointer-events-none border border-black/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
              {/* Focused Laser Scanline */}
              {emotion === "focused" && (
                <div className="absolute inset-0 bg-[#a855f7]/5">
                  <div className="absolute w-full h-[1.5px] bg-[#d8b4fe] shadow-[0_0_6px_#a855f7] animate-scanline" />
                </div>
              )}

              {/* Eyes Row */}
              <div className="flex justify-between w-full px-[8%] mt-[4%]">
                {renderEye("left")}
                {renderEye("right")}
              </div>

              {/* Mouth Row */}
              <div className="h-[25%] flex items-center justify-center mb-[2%]">
                {renderMouth()}
              </div>
            </div>

            {/* Active Pulse Glow Dot (Online Status) */}
            {!isOpen && emotion !== "sleepy" && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white z-20 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
            )}
          </motion.div>

          {/* Glowing Purple Portal / Ground Shadow */}
          <motion.div
            animate={{
              scaleX: isOpen ? 6.5 : isHovered ? 1.15 : emotion === "thinking" ? 0.85 : emotion === "sleepy" ? 0.92 : [1, 0.94, 1],
              scaleY: isOpen ? 0.25 : 1,
              opacity: isOpen ? 0.35 : 0.85,
            }}
            transition={
              isHovered || emotion === "thinking" || emotion === "sleepy" || isOpen
                ? { type: "spring", stiffness: 100, damping: 15 }
                : { repeat: Infinity, duration: 3, ease: "easeInOut" }
            }
            style={{
              boxShadow: "0 20px 45px rgba(109,76,255,0.20), 0 0 40px rgba(109,76,255,0.18)"
            }}
            className="w-11 sm:w-13 h-1.5 bg-gradient-to-r from-purple-600/80 to-indigo-600/80 rounded-full blur-[1px] mt-1.5 pointer-events-none"
          />

          {/* Interactive Click Hitbox */}
          <div 
            className="absolute inset-0 z-20 cursor-pointer"
            title="Toggle TIA Digital Consultant"
          />
        </motion.div>
      </div>
      )}

      {/* Chat Window Panel (Originates from bottom right) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{ transformOrigin: "top right" }}
            className="z-50"
          >
            <ChatWindow onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TiaChatbot;
