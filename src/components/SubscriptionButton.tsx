"use client";

import React, { useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";

type Props = {
  isPro: boolean;
};

const SubscriptionButton = (props: Props) => {
  const [loading, setLoading] = useState(false);

  const handleSubscription = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button disabled={loading} onClick={handleSubscription}>
        {props.isPro ? "Manage Subscription" : "Get Pro"}
      </Button>
    </div>
  );
};

export default SubscriptionButton;
