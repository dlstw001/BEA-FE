import { useRouter } from "next/router";
import { useEffect } from "react";
import jwt from "jsonwebtoken";

export default function Callback(props) {
  const router = useRouter();
  const { publicKey } = props;

  useEffect(() => {
    if (router.isReady) {
      // empty query
      if (Object.keys(router.query).length === 0) {
        router.push("/");
      }
      // server response error
      if (router.query.error === "true") {
        console.log("error: ", router.query?.errors);
        alert(router.query?.errors);
        router.push("/");
      }

      //success
      if (router.query.access_token) {
        localStorage.setItem("access_token", router.query.access_token);
        localStorage.setItem("refresh_token", router.query.refresh_token);
        const decoded = jwt.verify(router.query.access_token, publicKey, {
          algorithms: "RS256",
        });
        localStorage.setItem("userName", decoded.name);
        localStorage.setItem("userEmail", decoded.email);
        router.push("/systems");
      }
    }
  }, [router.query]);

  return <div></div>;
}

import fsPromises from "fs/promises";
import appRoot from "app-root-path";
export async function getStaticProps() {
  const filePath = appRoot.resolve("/key/public.key");
  const publicKey = await fsPromises.readFile(filePath);
  const data = publicKey.toString();
  return {
    props: { publicKey: data },
  };
}