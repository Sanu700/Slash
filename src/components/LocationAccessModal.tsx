import { useAuth } from "@/lib/auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";

const LocationAccessModal = ({ onClose }) => {
  const { isAuthenticated } = useAuth();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationError, setLocationError] = useState("");
  const watchIdRef = useRef<number | null>(null);

  // Only show modal once per login session
  useEffect(() => {
    if (isAuthenticated) {
      const asked = sessionStorage.getItem("location_modal_asked");
      if (!asked) {
        setShowLocationModal(true);
      }
    } else {
      setShowLocationModal(false);
      setLocationError("");
      // Optionally clear location/session flag on logout
      sessionStorage.removeItem("location_modal_asked");
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    }
  }, [isAuthenticated]);

  // Handle location access
  const handleAllowLocation = () => {
    setLocationError("");
    sessionStorage.setItem("location_modal_asked", "true");
    setShowLocationModal(false);
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy, timestamp } = position.coords;
          localStorage.setItem(
            "user_location",
            JSON.stringify({ latitude, longitude, accuracy, timestamp })
          );
        },
        (error) => {
          setLocationError(error.message || "Location access denied.");
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
    if (onClose) onClose();
  };

  const handleDenyLocation = () => {
    sessionStorage.setItem("location_modal_asked", "true");
    setShowLocationModal(false);
    if (onClose) onClose();
  };

  // Call onClose if modal is closed by clicking outside or pressing ESC
  const handleOpenChange = (open) => {
    setShowLocationModal(open);
    if (!open && onClose) onClose();
  };

  return (
    <Dialog open={showLocationModal} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Allow Location Access?</DialogTitle>
          <DialogDescription>
            We use your location to provide a better experience. Please allow access to your device's location.
          </DialogDescription>
        </DialogHeader>
        {locationError && (
          <div className="text-red-500 text-sm mb-2">{locationError}</div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={handleDenyLocation}>Deny</Button>
          <Button onClick={handleAllowLocation}>Allow</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LocationAccessModal; 