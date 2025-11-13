import Loading from "@/component/Loading";
import { router } from "expo-router";
import { useEffect } from "react";

const Index = () => {


  useEffect(() => {
    router.replace("/home")
  }, []);

    return (
      <Loading/>
    );

};

export default Index;
