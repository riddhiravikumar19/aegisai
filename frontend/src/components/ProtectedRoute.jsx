import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
  }, []);

  if (session === undefined) {
    return <div style={{ color: "white", padding: 40 }}>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}