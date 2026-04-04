import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

function BackButton({ fallback = "/" }) {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      onClick={() => navigate(-1) || navigate(fallback)}
      className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Back</span>
    </Button>
  );
}

export default BackButton;