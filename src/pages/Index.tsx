import { BookingForm } from "@/components/BTMLogbookForm";

interface IndexProps {
  type: "domestic" | "international";
}

const Index: React.FC<IndexProps> = ({ type }) => {
  return <BookingForm type={type} key={type} />;
};

export default Index;
