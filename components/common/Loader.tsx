import { PuffLoader } from "react-spinners";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <PuffLoader
        color="#3b82f6" // blue-500
        size={50}
        speedMultiplier={0.8}
      />
    </div>
  );
}
