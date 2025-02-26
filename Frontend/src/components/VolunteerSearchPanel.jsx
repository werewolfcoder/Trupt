import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Loader2 } from "lucide-react";

const VolunteerSearchPanel = ({ isOpen, onClose, foodName, freshness, emergency, location, imagePreview }) => {
  const overlayRef = useRef(null);
  const textRef = useRef(null);
  const [loadingText, setLoadingText] = useState("Searching Volunteer");

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0, y: "100%" },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );

      gsap.to(textRef.current, {
        scale: 1.05,
        repeat: -1,
        yoyo: true,
        duration: 0.8,
        ease: "power1.inOut",
      });
    } else {
      gsap.to(overlayRef.current, { opacity: 0, y: "100%", duration: 0.4, ease: "power2.in" });
    }
  }, [isOpen]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prev) => (prev.endsWith("...") ? "Searching Volunteer" : `${prev}.`));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-white bg-opacity-90 flex justify-center items-center z-50 p-4"
    >
      <div className="flex flex-col items-center space-y-4 w-full max-w-md bg-white rounded-2xl p-6 shadow-lg">
        <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
        <p ref={textRef} className="text-lg font-semibold text-black tracking-wide text-center">
          {loadingText}
        </p>

        {/* Display user-entered data */}
        <div className="w-full text-gray-700 bg-gray-100 p-4 rounded-lg space-y-4">
            {imagePreview && (
                <div className="flex flex-col items-center">
          <p className="font-medium mb-2"></p>
         <img
                        src={imagePreview}
                        alt="Food"
                        className="w-48 h-48 object-cover rounded-lg shadow-md"
                    />
                </div>
            )}
            <div className="space-y-2">
                <p><strong>Food:</strong> {foodName || 'N/A'}</p>
          <p><strong>Freshness:</strong> {freshness || '0'}/5</p>
          <p><strong>Emergency:</strong> {emergency || 'N/A'}</p>
          <p><strong>Location:</strong> {location || 'N/A'}</p>
</div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition active:scale-95"
        >
          Cancel Search
        </button>
      </div>
    </div>
  );
};

export default VolunteerSearchPanel;