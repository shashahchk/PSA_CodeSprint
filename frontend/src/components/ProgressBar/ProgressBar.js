import React, { useEffect, useRef } from "react";
import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";

const ProgressBackground = styled.div(({ theme }) => ({
  margin: theme.spacing(2, 0),
  width: theme.spacing(10),
  backgroundColor: theme.palette.grey[300],
  borderRadius: theme.spacing(1),
}));

const Progress = styled.div(({ theme }) => ({
  width: 0,
  height: theme.spacing(2),
  borderRadius: theme.spacing(1),
  transition: "width 0.2s ease",
}));

const ProgressBar = ({ width }) => {
  const theme = useTheme();

  const progressBarRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.width = width;
            console.log(width);
            console.log(entry.target.style.width);
            entry.target.style.backgroundColor = theme.palette.primary.main;
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(progressBarRef.current);

    return () => {
      observer.disconnect();
    };
  }, [width]);

  return (
    <ProgressBackground>
      <Progress ref={progressBarRef} />
    </ProgressBackground>
  );
};

export default ProgressBar;
