import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ConfirmationPage = ({ isOpen, onClose, foodName, freshness, emergency, location }) => {
  const overlayRef = useRef(null);
  const textRef = useRef(null);
  const navigate = useNavigate();
  const [loadingText, setLoadingText] = useState("Submitting...");
  const [submitted, setSubmitted] = useState(false);

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

      setTimeout(() => {
        setSubmitted(true);
        setLoadingText("Submission Successful!");
        setTimeout(() => navigate("/"), 2000);
      }, 2000);
    }
  }, [isOpen, navigate]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-white bg-opacity-90 flex justify-center items-center z-50 p-4"
    >
      <div className="flex flex-col items-center space-y-4 w-full max-w-md bg-white rounded-2xl p-6 shadow-lg">
        {submitted ? (
          <CheckCircle className="w-12 h-12 text-green-500" />
        ) : (
          <p ref={textRef} className="text-lg font-semibold text-black tracking-wide text-center">
            {loadingText}
          </p>
        )}

        {/* Display user-entered data */}
        <div className="w-full text-gray-700 bg-gray-100 p-4 rounded-lg space-y-2">
          <p><strong>🍲 Food:</strong> {foodName}</p>
          <p><strong>⭐ Freshness:</strong> {freshness}/5</p>
          <p><strong>⏰ Emergency:</strong> {emergency}</p>
          <p><strong>📍 Location:</strong> {location}</p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;