import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import logoSrc from "../../public/logo.png";

export default function Splash() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div>
          <Image
            src={logoSrc}
            alt="FromTheArea Logo"
            width={160}
            height={100}
            objectFit="contain"
          />
        </div>
        <div style={{ marginTop: 20 }}>
          <a href="/login">
            <Button color="primary" size="lg">
              Log in with CAS
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
