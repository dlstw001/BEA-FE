import { useEffect } from "react";
import { useRouter } from "next/router";
import { Typography, Button } from "@mui/material";
import jwt from "jsonwebtoken";

export default function Home(props) {
  const router = useRouter();
  const { publicKey } = props;

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      const decoded = jwt.verify(access_token, publicKey, {
        algorithms: "RS256",
      });
      if (decoded.email == localStorage.getItem("userEmail")) {
        router.push("/systems");
      }
    }
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexFlow: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src="/homeLogo.svg"
        width="30%"
        height="30%"
        alt="logiLogo"
        style={{ marginTop: "100px" }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderColor: "#E5E5E5",
          backgroundColor: "white",
          width: "660px",
          height: "250px",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "40px",
          borderRadius: "4px",
          padding: "2px",
        }}
      >
        <Typography variant="h4" align="center">
          Welcome to BEA Management System.
        </Typography>
        <br />
        <Typography variant="h4" align="center">
          Please sign in with Peplink ID.
        </Typography>
        <Button
          variant="contained"
          style={{ backgroundColor: "#FFB81C", margin: "20px" }}
          onClick={() => {
            window.location.href = process.env.NEXT_PUBLIC_APP_LOGIN;
          }}
          sx={{ width: "239px", height: "42px" }}
        >
          Proceed to Peplink ID
        </Button>
      </div>
      <div style={{ marginTop: "300px" }}>
        © 2022 Peplink | Pepwave. All Rights Reserved.
      </div>
    </div>
  );
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
