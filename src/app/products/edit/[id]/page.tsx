import { EditProductClient } from "./EditProductClient";
import React from "react"; // Import React to use React.use()

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  // Use React.use to unwrap the Promise
  const resolvedParams = React.use(params); // Assuming params is indeed a Promise

  return <EditProductClient id={resolvedParams.id} />;
}
