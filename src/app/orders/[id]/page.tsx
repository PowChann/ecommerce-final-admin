import { OrderDetailsClient } from "./OrderDetailsClient";
import React from "react"; // Import React to use React.use()

interface OrderDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  // Use React.use to unwrap the Promise
  const resolvedParams = React.use(params); // Assuming params is indeed a Promise

  return <OrderDetailsClient id={resolvedParams.id} />;
}
